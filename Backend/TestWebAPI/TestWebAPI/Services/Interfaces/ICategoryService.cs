using Test.Data.Entities;
using TestWebAPI.Models.Requests;

namespace TestWebAPI.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<Category?> Get(int id);
        Task<IEnumerable<Category>> Get();
        Task<Category> CreateCategory(AddCategoryModel book);
        Task<Category> UpdateCategory(int id, AddCategoryModel updateCategory);
        Task<Category?> DeleteCategory(int id);
    }
}
