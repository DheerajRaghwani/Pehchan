using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pehchan.CommandModel;
using pehchan.Interface;

namespace pehchan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserLoginController : ControllerBase
    {
        private readonly IUserLogin _service;
        private readonly ITokenService _tokenService;

        public UserLoginController(IUserLogin service, ITokenService tokenService)
        {
            _service = service;
            _tokenService = tokenService;
        }

        // 1️⃣ Add
        [HttpPost("Add")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult Add(UserloginCommandModel model)
        {
            try
            {
                _service.Add(model);
                return Ok("User created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding user: {ex.Message}");
            }
        }

        // 2️⃣ Update
        [HttpPut("Update/{id}")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult Update(int id, UserloginCommandModel model)
        {
            try
            {
                _service.Update(id, model);
                return Ok("User updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating user: {ex.Message}");
            }
        }

        // 3️⃣ Delete
        [HttpDelete("Delete/{id}")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult Delete(int id)
        {
            try
            {
                _service.Delete(id);
                return Ok("User deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting user: {ex.Message}");
            }
        }

        // 4️⃣ Get by ID
        [HttpGet("GetByID{id}")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult Get(int id)
        {
            try
            {
                var data = _service.Get(id);
                if (data == null)
                    return NotFound("User not found");

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving user: {ex.Message}");
            }
        }

        // 5️⃣ Get All
        [HttpGet("GetAll")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult GetAll()
        {
            try
            {
                return Ok(_service.GetAll());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving users: {ex.Message}");
            }
        }

        // 6️⃣ LOGIN with exception handling
        [HttpPost("login")]
        
        public IActionResult Login([FromBody] LoginRequest req)
        {
            try
            {
                var user = _service.Login(req.UserName, req.Password);
                if (user == null)
                    return Unauthorized("Invalid username or password");

                // generate jwt
                var token = _tokenService.GenerateToken(user.Id, user.UserName, user.LoginRole);

                return Ok(new
                {
                    token,
                    user = new
                    {
                        user.Id,
                        user.UserName,
                        user.LoginRole,
                       
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error during login: {ex.Message}");
            }
        }

        // Login Request DTO
        public class LoginRequest
        {
            public string UserName { get; set; }
            public string Password { get; set; }
        }
    }
}