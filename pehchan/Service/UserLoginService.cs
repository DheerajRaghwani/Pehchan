using pehchan.CommandModel;
using pehchan.Interface;
using pehchan.Models;
using pehchan.QueryModel;

namespace pehchan.Service
{
    public class UserLoginService : IUserLogin
    {
        private readonly PenchanContext _context;

        public UserLoginService(PenchanContext context)
        {
            _context = context;
        }

        public void Add(UserloginCommandModel model)
        {
            int nextSno = _context.Userlogins.Any()
            ? _context.Userlogins.Max(x => x.Id) + 1
       : 1;
            var data = new Userlogin
            {
                Id = nextSno,
                UserName = model.UserName,
                Password = model.Password,
                LoginRole = model.LoginRole,
 
            };

            _context.Userlogins.Add(data);
            _context.SaveChanges();
        }

        public void Update(int id, UserloginCommandModel model)
        {
            var x = _context.Userlogins.FirstOrDefault(a => a.Id == id);
            if (x == null) return;

            x.UserName = model.UserName;
            x.Password = model.Password;
            x.LoginRole = model.LoginRole;
            

            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var x = _context.Userlogins.FirstOrDefault(a => a.Id == id);
            if (x == null) return;

            _context.Userlogins.Remove(x);
            _context.SaveChanges();
        }

        public UserloginQueryModel Get(int id)
        {
            var x = _context.Userlogins.FirstOrDefault(a => a.Id == id);
            if (x == null) return null;

            return new UserloginQueryModel
            {
                Id = x.Id,
                UserName = x.UserName,
                Password=x.Password,
                LoginRole = x.LoginRole,
                 
            };
        }

        public List<UserloginQueryModel> GetAll()
        {
            return _context.Userlogins
                .Select(x => new UserloginQueryModel
                {
                    Id = x.Id,
                    UserName = x.UserName,
                    Password=x.Password,
                    LoginRole = x.LoginRole,
                    
                }).ToList();
        }

        // 🔐 LOGIN LOGIC
        public UserloginQueryModel Login(string username, string password)
        {
            var user = _context.Userlogins
                .FirstOrDefault(x => x.UserName == username && x.Password == password);

            if (user == null) return null;

            return new UserloginQueryModel
            {
                Id = user.Id,
                UserName = user.UserName,
                LoginRole = user.LoginRole?.Trim().ToUpper()

            };
        }
    }
}
