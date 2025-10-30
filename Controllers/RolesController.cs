using System.Linq;
using System.Web.Http;
using KullaniciYS.Data;
using KullaniciYS.Models;
using KullaniciYS.Models.DTOs;

namespace KullaniciYS.Controllers
{
    [RoutePrefix("api/roles")]
    public class RolesController : ApiController
    {
        // GET: api/roles
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAllRoles()
        {
            using (var db = new AppDbContext())
            {
                var roles = db.Roles.Include("Users").ToList().Select(r => new
                {
                    Id = r.Id,
                    Name = r.Name,
                    Description = r.Description,
                    UserCount = r.Users.Count
                }).ToList();

                return Ok(roles);
            }
        }

        // GET: api/roles/5
        [HttpGet]
        [Route("{id:int}")]
        public IHttpActionResult GetRole(int id)
        {
            using (var db = new AppDbContext())
            {
                var role = db.Roles.Include("Users").FirstOrDefault(r => r.Id == id);

                if (role == null)
                {
                    return NotFound();
                }

                var roleDto = new
                {
                    Id = role.Id,
                    Name = role.Name,
                    Description = role.Description,
                    UserCount = role.Users.Count,
                    Users = role.Users.Select(u => new
                    {
                        u.Id,
                        u.UserName,
                        u.Email,
                        u.FullName
                    }).ToList()
                };

                return Ok(roleDto);
            }
        }

        // POST: api/roles
        [HttpPost]
        [Route("")]
        public IHttpActionResult CreateRole([FromBody] RoleDto roleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var db = new AppDbContext())
            {
                if (db.Roles.Any(r => r.Name == roleDto.Name))
                {
                    return BadRequest("Bu rol adı zaten kullanılıyor");
                }

                var role = new Role
                {
                    Name = roleDto.Name,
                    Description = roleDto.Description
                };

                db.Roles.Add(role);
                db.SaveChanges();

                return Ok(new { Success = true, Message = "Rol başarıyla oluşturuldu", RoleId = role.Id });
            }
        }

        // PUT: api/roles/5
        [HttpPut]
        [Route("{id:int}")]
        public IHttpActionResult UpdateRole(int id, [FromBody] RoleDto roleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var db = new AppDbContext())
            {
                var role = db.Roles.Find(id);

                if (role == null)
                {
                    return NotFound();
                }

                role.Name = roleDto.Name;
                role.Description = roleDto.Description;

                db.SaveChanges();

                return Ok(new { Success = true, Message = "Rol başarıyla güncellendi" });
            }
        }

        // DELETE: api/roles/5
        [HttpDelete]
        [Route("{id:int}")]
        public IHttpActionResult DeleteRole(int id)
        {
            using (var db = new AppDbContext())
            {
                var role = db.Roles.Find(id);

                if (role == null)
                {
                    return NotFound();
                }

                // Check if role is assigned to any users
                if (role.Users.Count > 0)
                {
                    return BadRequest("Bu rol kullanıcılara atanmış durumda. Önce rol atamasını kaldırın.");
                }

                db.Roles.Remove(role);
                db.SaveChanges();

                return Ok(new { Success = true, Message = "Rol başarıyla silindi" });
            }
        }
    }
}
