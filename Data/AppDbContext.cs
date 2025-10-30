using System.Data.Entity;
using KullaniciYS.Models;

namespace KullaniciYS.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext() : base("DefaultConnection")
        {
            // Code First Migration stratejisi
            Database.SetInitializer(new AppDbInitializer());
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-Many relationship between User and Role
            modelBuilder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithMany(r => r.Users)
                .Map(m =>
                {
                    m.ToTable("UserRoles");
                    m.MapLeftKey("UserId");
                    m.MapRightKey("RoleId");
                });

            // Unique constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserName)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }

    // Database initializer with seed data
    public class AppDbInitializer : CreateDatabaseIfNotExists<AppDbContext>
    {
        protected override void Seed(AppDbContext context)
        {
            // Seed Roles
            var adminRole = new Role { Name = "Admin", Description = "Sistem yöneticisi" };
            var userRole = new Role { Name = "User", Description = "Normal kullanıcı" };
            var managerRole = new Role { Name = "Manager", Description = "Yönetici" };

            context.Roles.Add(adminRole);
            context.Roles.Add(userRole);
            context.Roles.Add(managerRole);
            context.SaveChanges();

            // Seed default admin user (password: admin123)
            var adminUser = new User
            {
                UserName = "admin",
                Email = "admin@example.com",
                PasswordHash = HashPassword("admin123"), // Basit hash
                FullName = "Admin User",
                Phone = "555-0000",
                Department = "IT",
                IsActive = true
            };
            adminUser.Roles.Add(adminRole);

            context.Users.Add(adminUser);
            context.SaveChanges();

            base.Seed(context);
        }

        private string HashPassword(string password)
        {
            // Basit hash - Production'da BCrypt veya PBKDF2 kullan
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return System.BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
    }
}
