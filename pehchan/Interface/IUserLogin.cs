using pehchan.CommandModel;
using pehchan.QueryModel;

namespace pehchan.Interface
{
    public interface IUserLogin
    {
        void Add(UserloginCommandModel model);
        void Update(int id, UserloginCommandModel model);
        void Delete(int id);
        UserloginQueryModel Get(int id);
        List<UserloginQueryModel> GetAll();

        // 🔐 Login Authentication
        UserloginQueryModel Login(string username, string password);
    }
}
