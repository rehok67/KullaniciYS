using System.Linq;
using System.Web.Http;
using KullaniciYS.Data;
using KullaniciYS.Models.DTOs;

namespace KullaniciYS.Controllers
{
    [RoutePrefix("api/dashboard")]
    public class DashboardController : ApiController
    {
        // GET: api/dashboard/stats
        [HttpGet]
        [Route("stats")]
        public IHttpActionResult GetDashboardStats()
        {
            using (var db = new AppDbContext())
            {
                var stats = new DashboardStatsDto
                {
                    TotalUsers = db.Users.Count(),
                    ActiveUsers = db.Users.Count(u => u.IsActive),
                    AdminCount = db.Users.Count(u => u.Roles.Any(r => r.Name == "Admin")),
                    TotalRoles = db.Roles.Count()
                };

                return Ok(stats);
            }
        }

        // GET: api/dashboard/recent-users
        [HttpGet]
        [Route("recent-users")]
        public IHttpActionResult GetRecentUsers([FromUri] int count = 10)
        {
            using (var db = new AppDbContext())
            {
                var recentUsers = db.Users
                    .Include("Roles")
                    .OrderByDescending(u => u.CreatedDate)
                    .Take(count)
                    .ToList()
                    .Select(u => new UserDto
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

                return Ok(recentUsers);
            }
        }
    }
}
