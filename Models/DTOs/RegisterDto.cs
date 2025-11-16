using System.ComponentModel.DataAnnotations;

namespace KullaniciYS.Models.DTOs
{
    public class RegisterDto
    {
        [Required]
        [StringLength(100)]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        [StringLength(100)]
        public string FullName { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        [StringLength(100)]
        public string Department { get; set; }

        public int? ManagerId { get; set; }
    }
}
