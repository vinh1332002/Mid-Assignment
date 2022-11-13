using Test.Data.Entities;
using TestWebAPI.Models.Requests;

namespace TestWebAPI.Services.Interfaces
{
    public interface IUsersService
    {
        Task<User?> LoginUser(string username, string password);
        Task<IEnumerable<User>> Get();
        Task<User> CreateUser(AddUserModel user);
        Task<User> UpdateUser(Guid id, AddUserModel updateUser);
        Task<User?> DeleteUser(Guid id);
        Task<User?> GetUsersById(Guid id);
    }
}
