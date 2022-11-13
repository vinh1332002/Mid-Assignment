using Microsoft.EntityFrameworkCore;
using Test.Data;
using Test.Data.Entities;
using TestWebAPI.Models.Requests;
using TestWebAPI.Services.Interfaces;

namespace TestWebAPI.Services.Implements
{
    public class CategoryService : ICategoryService
    {
        private readonly TestContext _categoryContext;
        public CategoryService(TestContext categoryContext)
        {
            _categoryContext = categoryContext;
        }
        public async Task<IEnumerable<Category>> Get()
        {
            return await _categoryContext.Categories.ToListAsync();
        }

        public async Task<Category?> Get(int id)
        {
            return await _categoryContext.Categories.FirstOrDefaultAsync(b => b.CategoryId == id);
        }

        public async Task<Category> CreateCategory (AddCategoryModel category)
        {
            var addCategory = new Category
            {
                Name = category.Name
            };

            var newCategory = await _categoryContext.Categories.AddAsync(addCategory);
            _categoryContext.SaveChanges();

            return addCategory;
        }

        public async Task<Category> UpdateCategory (int id, AddCategoryModel updateCategory)
        {
            var category = await _categoryContext.Categories.FindAsync(id);

            if (category == null) return null;

            category.Name = updateCategory.Name;

            var update = _categoryContext.Categories.Update(category);

            if (update == null) return null;

            var updateModel = new Category
            {
                Name = category.Name,
            };

            _categoryContext.SaveChanges();

            return updateModel;
        }

        public async Task<Category?> DeleteCategory(int id)
        {
            var category = await _categoryContext.Categories.FindAsync(id);
            if (category == null) throw new ArgumentNullException("Category Id must not be null", nameof(category));

            _categoryContext.Categories.Remove(category);

            await _categoryContext.SaveChangesAsync();
            return category;
        }
    }
}
