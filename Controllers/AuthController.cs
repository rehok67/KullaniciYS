using System.Linq;
using System.Web.Http;
using KullaniciYS.Data;
using KullaniciYS.Models;
using KullaniciYS.Models.DTOs;
using KullaniciYS.Services;

namespace KullaniciYS.Controllers
{
    [RoutePrefix("api/auth")]
    public class AuthController : ApiController
    {
        [HttpPost]
        [Route("login")]
        public IHttpActionResult Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = AuthService.AuthenticateUser(loginDto.UserName, loginDto.Password);

            if (user == null)
            {
                return Ok(new LoginResponseDto
                {
                    Success = false,
                    Message = "Kullanıcı adı veya şifre hatalı"
                });
            }

            var token = AuthService.GenerateToken();

            var userDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FullName = user.FullName,
                Phone = user.Phone,
                Department = user.Department,
                IsActive = user.IsActive,
                CreatedDate = user.CreatedDate,
                LastLoginDate = user.LastLoginDate,
                Roles = user.Roles.Select(r => new RoleDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Description = r.Description
                }).ToList()
            };

            return Ok(new LoginResponseDto
            {
                Success = true,
                Message = "Giriş başarılı",
                Token = token,
                User = userDto
            });
        }

        [HttpPost]
        [Route("register")]
        public IHttpActionResult Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var db = new AppDbContext())
            {
                // Check if username or email already exists
                if (db.Users.Any(u => u.UserName == registerDto.UserName))
                {
                    return BadRequest("Kullanıcı adı zaten kullanılıyor");
                }

                if (db.Users.Any(u => u.Email == registerDto.Email))
                {
                    return BadRequest("Email zaten kullanılıyor");
                }

                var user = new User
                {
                    UserName = registerDto.UserName,
                    Email = registerDto.Email,
                    PasswordHash = AuthService.HashPassword(registerDto.Password),
                    FullName = registerDto.FullName,
                    Phone = registerDto.Phone,
                    Department = registerDto.Department,
                    IsActive = true
                };

                // Assign default "User" role
                var userRole = db.Roles.FirstOrDefault(r => r.Name == "User");
                if (userRole != null)
                {
                    user.Roles.Add(userRole);
                }

                db.Users.Add(user);
                db.SaveChanges();

                return Ok(new { Success = true, Message = "Kullanıcı başarıyla oluşturuldu" });
            }
        }
    }
}
