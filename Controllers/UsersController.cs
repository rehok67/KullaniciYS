using System;
using System.Linq;
using System.Web.Http;
using KullaniciYS.Data;
using KullaniciYS.Models;
using KullaniciYS.Models.DTOs;
using KullaniciYS.Services;

namespace KullaniciYS.Controllers
{
    [RoutePrefix("api/users")]
    public class UsersController : ApiController
    {
        // GET: api/users
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAllUsers([FromUri] string search = null, [FromUri] string role = null, [FromUri] bool? isActive = null)
        {
            using (var db = new AppDbContext())
            {
                var query = db.Users.Include("Roles").AsQueryable();

                // Search filter
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(u =>
                        u.UserName.Contains(search) ||
                        u.Email.Contains(search) ||
                        u.FullName.Contains(search));
                }

                // Role filter
                if (!string.IsNullOrEmpty(role))
                {
                    query = query.Where(u => u.Roles.Any(r => r.Name == role));
                }

                // Active status filter
                if (isActive.HasValue)
                {
                    query = query.Where(u => u.IsActive == isActive.Value);
                }

                var users = query.ToList().Select(u => new UserDto
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                    FullName = u.FullName,
                    Phone = u.Phone,
                    Department = u.Department,
                    IsActive = u.IsActive,
                    CreatedDate = u.CreatedDate,
                    LastLoginDate = u.LastLoginDate,
                    Roles = u.Roles.Select(r => new RoleDto
                    {
                        Id = r.Id,
                        Name = r.Name,
                        Description = r.Description
                    }).ToList()
                }).ToList();

                return Ok(users);
            }
        }

        // GET: api/users/5
        [HttpGet]
        [Route("{id:int}")]
        public IHttpActionResult GetUser(int id)
        {
            using (var db = new AppDbContext())
            {
                var user = db.Users.Include("Roles").FirstOrDefault(u => u.Id == id);

                if (user == null)
                {
                    return NotFound();
                }

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

                return Ok(userDto);
            }
        }

        // POST: api/users
        [HttpPost]
        [Route("")]
        public IHttpActionResult CreateUser([FromBody] RegisterDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var db = new AppDbContext())
            {
                if (db.Users.Any(u => u.UserName == userDto.UserName))
                {
                    return BadRequest("Kullanıcı adı zaten kullanılıyor");
                }

                if (db.Users.Any(u => u.Email == userDto.Email))
                {
                    return BadRequest("Email zaten kullanılıyor");
                }

                var user = new User
                {
                    UserName = userDto.UserName,
                    Email = userDto.Email,
                    PasswordHash = AuthService.HashPassword(userDto.Password),
                    FullName = userDto.FullName,
                    Phone = userDto.Phone,
                    Department = userDto.Department,
                    IsActive = true
                };

                db.Users.Add(user);
                db.SaveChanges();

                return Ok(new { Success = true, Message = "Kullanıcı başarıyla oluşturuldu", UserId = user.Id });
            }
        }

        // PUT: api/users/5
        [HttpPut]
        [Route("{id:int}")]
        public IHttpActionResult UpdateUser(int id, [FromBody] UpdateUserDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var db = new AppDbContext())
            {
                var user = db.Users.Include("Roles").FirstOrDefault(u => u.Id == id);

                if (user == null)
                {
                    return NotFound();
                }

                // Update user properties
                user.FullName = updateDto.FullName ?? user.FullName;
                user.Email = updateDto.Email ?? user.Email;
                user.Phone = updateDto.Phone ?? user.Phone;
                user.Department = updateDto.Department ?? user.Department;
                user.IsActive = updateDto.IsActive;

                // Update roles if provided
                if (updateDto.RoleIds != null && updateDto.RoleIds.Count > 0)
                {
                    user.Roles.Clear();
                    var roles = db.Roles.Where(r => updateDto.RoleIds.Contains(r.Id)).ToList();
                    foreach (var role in roles)
                    {
                        user.Roles.Add(role);
                    }
                }

                db.SaveChanges();

                return Ok(new { Success = true, Message = "Kullanıcı başarıyla güncellendi" });
            }
        }

        // DELETE: api/users/5
        [HttpDelete]
        [Route("{id:int}")]
        public IHttpActionResult DeleteUser(int id)
        {
            using (var db = new AppDbContext())
            {
                var user = db.Users.Find(id);

                if (user == null)
                {
                    return NotFound();
                }

                db.Users.Remove(user);
                db.SaveChanges();

                return Ok(new { Success = true, Message = "Kullanıcı başarıyla silindi" });
            }
        }

        // POST: api/users/5/toggle-status
        [HttpPost]
        [Route("{id:int}/toggle-status")]
        public IHttpActionResult ToggleUserStatus(int id)
        {
            using (var db = new AppDbContext())
            {
                var user = db.Users.Find(id);

                if (user == null)
                {
                    return NotFound();
                }

                user.IsActive = !user.IsActive;
                db.SaveChanges();

                return Ok(new { Success = true, Message = "Kullanıcı durumu değiştirildi", IsActive = user.IsActive });
            }
        }
    }
}
