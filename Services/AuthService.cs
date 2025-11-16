using System;
using System.Data.Entity;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using KullaniciYS.Data;
using KullaniciYS.Models;

namespace KullaniciYS.Services
{
    public class AuthService
    {
        public static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput.Equals(hashedPassword);
        }

        public static string GenerateToken()
        {
            // Basit token generator - Production'da JWT kullan
            return Guid.NewGuid().ToString() + DateTime.Now.Ticks.ToString();
        }

        public static User AuthenticateUser(string username, string password)
        {
            using (var db = new AppDbContext())
            {
                var user = db.Users
                    .Include(u => u.Roles)
                    .Include(u => u.Manager)
                    .FirstOrDefault(u => u.UserName == username);

                if (user != null && VerifyPassword(password, user.PasswordHash) && user.IsActive)
                {
                    user.LastLoginDate = DateTime.Now;
                    db.SaveChanges();
                    return user;
                }

                return null;
            }
        }
    }
}
