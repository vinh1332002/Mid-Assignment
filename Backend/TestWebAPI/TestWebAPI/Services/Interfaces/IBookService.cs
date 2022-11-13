using Test.Data.Entities;
using TestWebAPI.Models;
using TestWebAPI.Models.Requests;

namespace TestWebAPI.Services.Interfaces
{
    public interface IBookService
    {
        Task<IEnumerable<Book>> Get();
        Task<Book?> Get(int id);
        Task InitData();
        Task<BookPagination> GetPaginationAsync(BookQueryModel queryModel);
        Task<Book?> DeleteBook(int id);
        Task<Book> CreateBook(AddBookModel book);
        Task<Book> UpdateBook(int id, AddBookModel book);
    }
}
