using Test.Data;
using Test.Data.Entities;
using Microsoft.EntityFrameworkCore;
using TestWebAPI.Services.Interfaces;
using TestWebAPI.Models.Requests;

namespace TestWebAPI.Services.Implements
{
    public class UsersService : IUsersService
    {
        private readonly TestContext _userContext;
        public UsersService(TestContext userContext)
        {
            _userContext = userContext;
        }
        public async Task<User?> LoginUser(string username, string password)
        {
            return await _userContext.Users.SingleOrDefaultAsync(x => x.UserName == username && x.Password == password);
        }
        public async Task<IEnumerable<User>> Get()
        {
            return await _userContext.Users.ToListAsync();
        }

        public async Task<User> CreateUser(AddUserModel user)
        {
            var addUser = new User
            {
                UserName = user.UserName,
                Password = user.Password,
                Role = user.Role
            };

            var newCategory = await _userContext.Users.AddAsync(addUser);
            _userContext.SaveChanges();

            return addUser;
        }

        public async Task<User> UpdateUser(Guid id, AddUserModel updateUser)
        {
            var user = await _userContext.Users.FindAsync(id);

            if (user == null) return null;

            user.UserName = updateUser.UserName;
            user.Password = updateUser.Password;
            user.Role = updateUser.Role;

            var update = _userContext.Users.Update(user);

            if (update == null) return null;

            var updateModel = new User
            {
                UserName = user.UserName,
                Password = user.Password,
                Role = user.Role
            };

            _userContext.SaveChanges();

            return updateModel;
        }

        public async Task<User?> DeleteUser(Guid id)
        {
            var user = await _userContext.Users.FindAsync(id);
            if (user == null) throw new ArgumentNullException("User Id must not be null", nameof(user));

            _userContext.Users.Remove(user);

            await _userContext.SaveChangesAsync();
            return user;
        }

        public async Task<User?> GetUsersById(Guid id)
        {
            return await _userContext.Users.FirstOrDefaultAsync(b => b.UserId == id);
        }
    }
}
