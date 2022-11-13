using Common.Enums;

namespace TestWebAPI.Models.Requests
{
    public class AddUserModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public UserRolesEnum Role { get; set; }
    }
}
