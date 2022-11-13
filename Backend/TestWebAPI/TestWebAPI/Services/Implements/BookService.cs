using TestWebAPI.Services.Interfaces;
using Test.Data.Entities;
using Test.Data;
using System.Data;
using Microsoft.EntityFrameworkCore;
using TestWebAPI.Models;
using TestWebAPI.Models.Requests;
using Common.Enums;

namespace TestWebAPI.Services.Implements
{
    public class BookService : IBookService
    {
        private readonly TestContext _bookContext;
        public BookService(TestContext bookContext)
        {
            _bookContext = bookContext;
        }

        public async Task<IEnumerable<Book>> Get()
        {
            return await _bookContext.Books.Include(m => m.Category).ToListAsync();
        }

        public async Task<Book?> Get(int id)
        {
            return await _bookContext.Books.Include(m => m.Category).FirstOrDefaultAsync(b => b.BookId == id);
        }

        public async Task InitData()
        {
            for (int i = 1; i <= 3; i++)
            {
                var c = new Category()
                {
                    Name = $"Category01__{i}"
                };
                await _bookContext.Categories.AddAsync(c);
            }

            await _bookContext.SaveChangesAsync();

            var cates = await _bookContext.Categories.ToListAsync();
            
            for(int i = 20; i < 200; i++)
            {
                var p = new Book()
                {
                    Title = $"Book_{i}",
                    Category = cates[i % 3]
                };
                await _bookContext.Books.AddAsync(p);
            }
            await _bookContext.SaveChangesAsync();
        }

        public async Task<BookPagination> GetPaginationAsync(BookQueryModel queryModel)
        {
            var books = await _bookContext.Books.Include(m => m.Category).ToListAsync();

            //queryModel.Name = queryModel.Name?.Trim()?.ToLower();
            if(!string.IsNullOrWhiteSpace(queryModel.Name))
            {
                var nameToQuery = queryModel.Name.Trim().ToLower();
                books = books?.Where(x => x.Title.ToLower().Contains(nameToQuery))?.ToList();
            }

            if (queryModel.CategoryID.HasValue)
            {
                var categoryID = queryModel.CategoryID.Value;
                books = books?.Where(x => x.Category.CategoryId == categoryID)?.ToList();
            }

            queryModel.SortOption ??= BookSortEnum.NameAcsending;

            switch(queryModel.SortOption.Value)
            {
                case BookSortEnum.NameAcsending:
                    books = books?.OrderBy(x => x.Title)?.ToList();
                    break;
                case BookSortEnum.NameDesending:
                    books = books?.OrderByDescending(x => x.Title)?.ToList();
                    break;
                case BookSortEnum.CategoryNameDesending:
                    books = books?.OrderByDescending(x => x.Category.Name)?.ToList();
                    break;
                case BookSortEnum.CategoryNameAcsending:
                    books = books?.OrderBy(x => x.Category.Name)?.ToList();
                    break;
                default: break;
            }

            if (books == null || books.Count == 0)
            {
                return new BookPagination
                {
                    Books = new List<Book>(),
                    TotalPage = 1,
                    TotalBooksCount = 0,
                    QueryModel = queryModel
                };
            }

            var output = new BookPagination();

            output.TotalBooksCount = books.Count;
            output.TotalPage = (output.TotalBooksCount - 1) / queryModel.PageSize + 1;

            if (queryModel.PageNumber > output.TotalPage)
                queryModel.PageNumber = output.TotalPage;

            output.Books = books.Skip((queryModel.PageNumber - 1) * queryModel.PageSize).Take(queryModel.PageSize).ToList();

            output.QueryModel = queryModel;

            return output;
        }

        public async Task<Book?> DeleteBook (int id)
        {
            var book = await _bookContext.Books.FindAsync(id);
            if (book == null) throw new ArgumentNullException("Book Id must not be null", nameof(book));

            _bookContext.Books.Remove(book);

            await _bookContext.SaveChangesAsync();
            return book;
        }

        public async Task<Book> CreateBook (AddBookModel book)
        {
            var category = await _bookContext.Categories.FindAsync(book.CategoryId);

            if (category != null)
            {
                var addBook = new Book
                {
                    Title = book.Title,
                    Category = category,
                };

                var newBook = await _bookContext.Books.AddAsync(addBook);
                await _bookContext.SaveChangesAsync();

                return addBook;
            }
            return null;
        }

        public async Task<Book> UpdateBook (int id, AddBookModel updateBook)
        {
            var category = await _bookContext.Categories.FindAsync(updateBook.CategoryId);

            var book = await _bookContext.Books.FindAsync(id);

            if (book == null) return null;
            if (category == null) return null;

            book.Title = updateBook.Title;
            book.Category = category;

            var update = _bookContext.Books.Update(book);

            if (update == null) return null;

            var updateModel = new Book
            {
                Title = book.Title,
                Category = book.Category,
            };

            await _bookContext.SaveChangesAsync();

            return updateModel;
        }
    }
}
