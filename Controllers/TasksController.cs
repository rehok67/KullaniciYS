using System;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using KullaniciYS.Data;
using KullaniciYS.Models;
using KullaniciYS.Models.DTOs;

namespace KullaniciYS.Controllers
{
    [RoutePrefix("api/tasks")]
    public class TasksController : ApiController
    {
        private static string ResolveUserDisplayName(User user)
        {
            if (user == null)
            {
                return null;
            }

            return !string.IsNullOrWhiteSpace(user.FullName) ? user.FullName : user.UserName;
        }

        private static UserTaskDto MapTaskToDto(UserTask task, int? forUserId = null)
        {
            return new UserTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Priority = task.Priority.ToString(),
                CreatedDate = task.CreatedDate,
                DueDate = task.DueDate,
                AssignedByManagerId = task.AssignedByManagerId,
                AssignedByManagerName = ResolveUserDisplayName(task.AssignedByManager),
                Assignments = task.Assignments
                    .Where(a => !forUserId.HasValue || a.UserId == forUserId.Value)
                    .Select(a => new TaskAssignmentDto
                    {
                        AssignmentId = a.Id,
                        TaskId = a.TaskId,
                        UserId = a.UserId,
                        UserName = ResolveUserDisplayName(a.User),
                        Status = a.Status.ToString(),
                        AssignedDate = a.AssignedDate,
                        CompletedDate = a.CompletedDate
                    })
                    .ToList()
            };
        }

        [HttpGet]
        [Route("user/{userId:int}")]
        public IHttpActionResult GetUserTasks(int userId)
        {
            using (var db = new AppDbContext())
            {
                var user = db.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null)
                {
                    return NotFound();
                }

                var tasks = db.UserTasks
                    .Include(t => t.AssignedByManager)
                    .Include(t => t.Assignments.Select(a => a.User))
                    .Where(t => t.Assignments.Any(a => a.UserId == userId))
                    .ToList()
                    .Select(t => new
                    {
                        Task = t,
                        PrimaryAssignment = t.Assignments.First(a => a.UserId == userId)
                    })
                    .OrderBy(x => x.PrimaryAssignment.Status)
                    .ThenBy(x => x.Task.DueDate ?? DateTime.MaxValue)
                    .ThenByDescending(x => x.Task.CreatedDate)
                    .Select(x => MapTaskToDto(x.Task, userId))
                    .ToList();

                return Ok(tasks);
            }
        }

        [HttpGet]
        [Route("manager/{managerId:int}")]
        public IHttpActionResult GetTasksForManager(int managerId)
        {
            using (var db = new AppDbContext())
            {
                var manager = db.Users
                    .Include(u => u.Roles)
                    .FirstOrDefault(u => u.Id == managerId);

                if (manager == null)
                {
                    return NotFound();
                }

                var isManager = manager.Roles.Any(r => r.Name == "Manager" || r.Name == "Admin");
                if (!isManager)
                {
                    return BadRequest("Bu kullanıcı yönetici yetkisine sahip değildir.");
                }

                var tasks = db.UserTasks
                    .Include(t => t.AssignedByManager)
                    .Include(t => t.Assignments.Select(a => a.User))
                    .Where(t => t.AssignedByManagerId == managerId)
                    .ToList()
                    .OrderByDescending(t => t.Priority)
                    .ThenBy(t => t.DueDate ?? DateTime.MaxValue)
                    .ThenByDescending(t => t.CreatedDate)
                    .Select(t => MapTaskToDto(t))
                    .ToList();

                return Ok(tasks);
            }
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult CreateTask([FromBody] CreateTaskRequestDto request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest("Geçersiz istek.");
            }

            if (request.UserIds == null || request.UserIds.Count == 0)
            {
                return BadRequest("En az bir kullanıcı seçmelisiniz.");
            }

            using (var db = new AppDbContext())
            {
                var manager = db.Users
                    .Include(u => u.Roles)
                    .FirstOrDefault(u => u.Id == request.ManagerId);

                if (manager == null)
                {
                    return BadRequest("Yönetici bulunamadı.");
                }

                var isManager = manager.Roles.Any(r => r.Name == "Manager" || r.Name == "Admin");
                if (!isManager)
                {
                    return BadRequest("Görev oluşturmak için yönetici yetkisine sahip olmalısınız.");
                }

                var distinctUserIds = request.UserIds.Distinct().ToList();

                var targetUsers = db.Users
                    .Where(u => distinctUserIds.Contains(u.Id))
                    .ToList();

                if (targetUsers.Count != distinctUserIds.Count)
                {
                    return BadRequest("Seçilen kullanıcıların bazıları bulunamadı.");
                }

                var isAdmin = manager.Roles.Any(r => r.Name == "Admin");
                if (!isAdmin)
                {
                    var unauthorizedUser = targetUsers.FirstOrDefault(u => u.ManagerId != manager.Id);
                    if (unauthorizedUser != null)
                    {
                        return BadRequest("Yalnızca size bağlı kullanıcılara görev atayabilirsiniz.");
                    }
                }

                var task = new UserTask
                {
                    Title = request.Title,
                    Description = request.Description,
                    Priority = request.Priority,
                    DueDate = request.DueDate,
                    AssignedByManagerId = manager.Id
                };

                foreach (var targetUser in targetUsers)
                {
                    task.Assignments.Add(new UserTaskAssignment
                    {
                        UserId = targetUser.Id,
                        Status = TaskAssignmentStatus.Pending
                    });
                }

                db.UserTasks.Add(task);
                db.SaveChanges();

                db.Entry(task).Reference(t => t.AssignedByManager).Load();
                db.Entry(task).Collection(t => t.Assignments).Query().Include(a => a.User).Load();

                var taskDto = MapTaskToDto(task);

                return Ok(new
                {
                    Success = true,
                    Message = "Görev oluşturuldu.",
                    Task = taskDto
                });
            }
        }

        [HttpPost]
        [Route("{taskId:int}/complete")]
        public IHttpActionResult CompleteTask(int taskId, [FromBody] CompleteTaskRequestDto request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest("Geçersiz istek.");
            }

            using (var db = new AppDbContext())
            {
                var assignment = db.UserTaskAssignments
                    .Include(a => a.Task)
                    .Include(a => a.Task.AssignedByManager)
                    .Include(a => a.User)
                    .FirstOrDefault(a => a.TaskId == taskId && a.UserId == request.UserId);

                if (assignment == null)
                {
                    return BadRequest("Görev ya da kullanıcı bulunamadı.");
                }

                if (assignment.Status == TaskAssignmentStatus.Completed)
                {
                    return Ok(new
                    {
                        Success = true,
                        Message = "Görev zaten tamamlandı.",
                        Assignment = new
                        {
                            assignment.Id,
                            assignment.TaskId,
                            assignment.Status,
                            assignment.CompletedDate
                        }
                    });
                }

                assignment.Status = TaskAssignmentStatus.Completed;
                assignment.CompletedDate = DateTime.Now;
                db.SaveChanges();

                return Ok(new
                {
                    Success = true,
                    Message = "Görev tamamlandı.",
                    Assignment = new
                    {
                        assignment.Id,
                        assignment.TaskId,
                        assignment.Status,
                        assignment.CompletedDate
                    }
                });
            }
        }
    }
}
