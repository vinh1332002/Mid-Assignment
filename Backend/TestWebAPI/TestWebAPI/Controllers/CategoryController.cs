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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpGet("category")]
        public async Task<IActionResult> GetCategory()
        {
            var result = await _categoryService.Get();
            return Ok(result);
        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetCategory(int categoryId)
        {
            var result = await _categoryService.Get(categoryId);

            return Ok(result);
        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpPost("category")]
        public async Task<IActionResult> CreateCategory([FromBody] AddCategoryModel category)
        {
            try
            {
                var result = await _categoryService.CreateCategory(category);

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
        [HttpPut("category/{categoryId}")]
        public async Task<IActionResult> UpdateCategory(int categoryId, [FromBody] AddCategoryModel updateModel)
        {
            if (updateModel == null) return BadRequest();

            try
            {
                var updatedCategory = await _categoryService.UpdateCategory(categoryId, updateModel);

                return updatedCategory != null ? Ok(updatedCategory) : StatusCode(500);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Unexpected Error!" + ex);
            }
        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpDelete("category/{categoryId}")]
        public async Task<IActionResult> DeleteCategory(int categoryId)
        {
            var result = await _categoryService.DeleteCategory(categoryId);
            return Ok(result);
        }
    }
}
