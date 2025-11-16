using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KullaniciYS.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string UserName { get; set; }

        [Required]
        [StringLength(255)]
        public string Email { get; set; }

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; }

        [StringLength(100)]
        public string FullName { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        [StringLength(100)]
        public string Department { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? LastLoginDate { get; set; }

        public int? ManagerId { get; set; }

        [ForeignKey("ManagerId")]
        public virtual User Manager { get; set; }

        // Navigation property
        public virtual ICollection<Role> Roles { get; set; }
        public virtual ICollection<UserTaskAssignment> TaskAssignments { get; set; }
        public virtual ICollection<User> ManagedUsers { get; set; }

        public User()
        {
            IsActive = true;
            CreatedDate = DateTime.Now;
            Roles = new HashSet<Role>();
            TaskAssignments = new HashSet<UserTaskAssignment>();
            ManagedUsers = new HashSet<User>();
        }
    }
}
