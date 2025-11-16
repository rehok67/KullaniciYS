using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using KullaniciYS.Models;

namespace KullaniciYS.Models.DTOs
{
    public class TaskAssignmentDto
    {
        public int AssignmentId { get; set; }
        public int TaskId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Status { get; set; }
        public DateTime AssignedDate { get; set; }
        public DateTime? CompletedDate { get; set; }
    }

    public class UserTaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public int AssignedByManagerId { get; set; }
        public string AssignedByManagerName { get; set; }
        public List<TaskAssignmentDto> Assignments { get; set; }
    }

    public class CompleteTaskRequestDto
    {
        [Required]
        public int UserId { get; set; }
    }

    public class CreateTaskRequestDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [StringLength(2000)]
        public string Description { get; set; }

        [Required]
        public TaskPriority Priority { get; set; }

        public DateTime? DueDate { get; set; }

        [Required]
        public int ManagerId { get; set; }

        [Required]
        public List<int> UserIds { get; set; }
    }
}
