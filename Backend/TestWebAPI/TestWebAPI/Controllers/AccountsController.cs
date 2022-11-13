using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TestWebAPI.Models.Requests;
using TestWebAPI.Services.Interfaces;
using Common.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Common.Enums;

namespace TestWebAPI.Controllers
{
    [Authorize]
    [Route("api")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IUsersService _usersService;

        public AccountsController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        [AllowAnonymous]
        [HttpPost("user/login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _usersService.LoginUser(request.UserName, request.Password);

            if (user == null) return BadRequest();

            var claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim("UserId", user.UserId.ToString()),
                new Claim("UserName", user.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtConstant.Key));

            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expired = DateTime.UtcNow.AddMinutes(JwtConstant.ExpiredTime);

            var token = new JwtSecurityToken(issuer: JwtConstant.Issuer,
                audience: JwtConstant.Audience, claims: claims,
                expires: expired, signingCredentials: signIn);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(tokenString);
        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpPost("user")]
        public async Task<IActionResult> CreateUser([FromBody] AddUserModel user)
        {
            try
            {
                var result = await _usersService.CreateUser(user);

                if (result == null) return BadRequest();

                return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(500, "Unexpected Error!" + ex);
            }
        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpGet("user/{id}")]
        public async Task<ActionResult> GetUsersById(Guid id)
        {
            var result = await _usersService.GetUsersById(id);
            return Ok(result);
        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpGet("user")]
        public async Task<ActionResult> GetUsers()
        {
            var result = await _usersService.Get();
            return Ok(result);
        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpDelete("user/{userId}")]
        public async Task<ActionResult> DeleteBook(Guid userId)
        {
            var result = await _usersService.DeleteUser(userId);
            return Ok(result);
        }

        [AllowAnonymous]
        //[Authorize(Roles = UserRoles.SuperAdmin)]
        [HttpPut("user/{userId}")]
        public async Task<IActionResult> UpdateBook(Guid userId, [FromBody] AddUserModel updateModel)
        {
            if (updateModel == null) return BadRequest();

            try
            {
                var updatedUser = await _usersService.UpdateUser(userId, updateModel);

                return updatedUser != null ? Ok(updatedUser) : StatusCode(500);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Unexpected Error!" + ex);
            }
        }

        [AllowAnonymous]
        [HttpGet("user/test-extension")]
        public async Task<IActionResult> UserTestExtension()
        {
            var userId = this.GetCurrentLoginUserId();
            if (userId == null) return BadRequest();

            return Ok(userId);
        }
    }
}
