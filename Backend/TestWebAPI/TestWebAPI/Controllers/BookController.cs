using Common.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestWebAPI.Models.Requests;
using TestWebAPI.Services.Interfaces;

namespace TestWebAPI.Controllers
{
    [Authorize]
    [Route("api")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [AllowAnonymous]
        [HttpGet("test")]
        public async Task<ActionResult> Index()
        {
            //await _bookService.InitData();
            return Ok("Test");
        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpGet("book")]
        public async Task<ActionResult> GetBook()
        {
            var result = await _bookService.Get();
            return Ok(result);
        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpGet("book/detail/{bookId}")]
        public async Task<ActionResult> GetBookById(int bookId)
        {
            var result = await _bookService.Get(bookId);
            return Ok(result);
        }


        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpGet("book/{bookId}")]
        public async Task<ActionResult> GetBookQueryAsync(int pageNumber, int pageSize,
            string? name, int? categoryId, BookSortEnum? sortOption)
        {
            var queryModel = new BookQueryModel
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Name = name,
                CategoryID = categoryId,
                SortOption = sortOption
            };

            var result = await _bookService.GetPaginationAsync(queryModel);
            return Ok(result);

        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpDelete("book/{bookId}")]
        public async Task<ActionResult> DeleteBook  (int bookId)
        {
            var result = await _bookService.DeleteBook(bookId);
            return Ok(result);
        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpPost("book")]
        public async Task<IActionResult> CreateBook([FromBody] AddBookModel book)
        {
            try
            {
                var result = await _bookService.CreateBook(book);

                if (result == null) return NotFound();

                return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(500, "Unexpected Error!" + ex);
            }
        }


        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpPut("book/{bookId}")]
        public async Task<IActionResult> UpdateBook(int bookId, [FromBody] AddBookModel updateModel)
        {
            if (updateModel == null) return BadRequest();

            try
            {
                var updatedBook = await _bookService.UpdateBook(bookId, updateModel);

                return updatedBook != null ? Ok(updatedBook) : StatusCode(500);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Unexpected Error!" + ex);
            }
        }
    }
}
