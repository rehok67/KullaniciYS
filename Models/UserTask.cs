using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace KullaniciYS.Models
{
    public enum TaskPriority
    {
        Low = 0,
        Medium = 1,
        High = 2
    }

    public enum TaskAssignmentStatus
    {
        Pending = 0,
        InProgress = 1,
        Completed = 2
    }

    public class UserTask
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [StringLength(2000)]
        public string Description { get; set; }

        [Required]
        public TaskPriority Priority { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? DueDate { get; set; }

        public int AssignedByManagerId { get; set; }

        public virtual User AssignedByManager { get; set; }

        public virtual ICollection<UserTaskAssignment> Assignments { get; set; }

        public UserTask()
        {
            CreatedDate = DateTime.Now;
            Priority = TaskPriority.Medium;
            Assignments = new HashSet<UserTaskAssignment>();
        }
    }

    public class UserTaskAssignment
    {
        [Key]
        public int Id { get; set; }

        public int TaskId { get; set; }

        public virtual UserTask Task { get; set; }

        public int UserId { get; set; }

        public virtual User User { get; set; }

        public TaskAssignmentStatus Status { get; set; }

        public DateTime AssignedDate { get; set; }

        public DateTime? CompletedDate { get; set; }

        public UserTaskAssignment()
        {
            AssignedDate = DateTime.Now;
            Status = TaskAssignmentStatus.Pending;
        }
    }
}
