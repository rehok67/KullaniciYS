using System;
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
        public DbSet<UserTask> UserTasks { get; set; }
        public DbSet<UserTaskAssignment> UserTaskAssignments { get; set; }

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

            modelBuilder.Entity<User>()
                .HasOptional(u => u.Manager)
                .WithMany(m => m.ManagedUsers)
                .HasForeignKey(u => u.ManagerId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<UserTask>()
                .HasRequired(t => t.AssignedByManager)
                .WithMany()
                .HasForeignKey(t => t.AssignedByManagerId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<UserTaskAssignment>()
                .HasRequired(a => a.Task)
                .WithMany(t => t.Assignments)
                .HasForeignKey(a => a.TaskId)
                .WillCascadeOnDelete(true);

            modelBuilder.Entity<UserTaskAssignment>()
                .HasRequired(a => a.User)
                .WithMany(u => u.TaskAssignments)
                .HasForeignKey(a => a.UserId)
                .WillCascadeOnDelete(false);
        }
    }

    // Database initializer with seed data
    public class AppDbInitializer : DropCreateDatabaseIfModelChanges<AppDbContext>
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

            var managerUser = new User
            {
                UserName = "manager",
                Email = "manager@example.com",
                PasswordHash = HashPassword("manager123"),
                FullName = "Manager User",
                Phone = "555-0100",
                Department = "Operasyon",
                IsActive = true
            };
            managerUser.Roles.Add(managerRole);

            var firstSupportUser = new User
            {
                UserName = "employee",
                Email = "employee@example.com",
                PasswordHash = HashPassword("user123"),
                FullName = "Destek Uzmanı",
                Phone = "555-0200",
                Department = "Destek",
                IsActive = true,
                Manager = managerUser
            };
            firstSupportUser.Roles.Add(userRole);

            var secondSupportUser = new User
            {
                UserName = "employee2",
                Email = "employee2@example.com",
                PasswordHash = HashPassword("user123"),
                FullName = "Destek Uzmanı 2",
                Phone = "555-0300",
                Department = "Destek",
                IsActive = true,
                Manager = managerUser
            };
            secondSupportUser.Roles.Add(userRole);

            context.Users.Add(adminUser);
            context.Users.Add(managerUser);
            context.Users.Add(firstSupportUser);
            context.Users.Add(secondSupportUser);
            context.SaveChanges();

            var upcomingReportTask = new UserTask
            {
                Title = "Haftalık raporu gönder",
                Description = "Pazartesi toplantısı için müşteri geri bildirim raporunu paylaşın.",
                Priority = TaskPriority.High,
                AssignedByManagerId = managerUser.Id,
                DueDate = DateTime.Now.AddDays(2)
            };
            upcomingReportTask.Assignments.Add(new UserTaskAssignment
            {
                UserId = firstSupportUser.Id,
                Status = TaskAssignmentStatus.Pending
            });

            var backlogReviewTask = new UserTask
            {
                Title = "Destek taleplerini gözden geçir",
                Description = "Açık destek taleplerini kontrol edin ve önceliklendirin.",
                Priority = TaskPriority.Medium,
                AssignedByManagerId = managerUser.Id,
                DueDate = DateTime.Now.AddDays(4)
            };
            backlogReviewTask.Assignments.Add(new UserTaskAssignment
            {
                UserId = firstSupportUser.Id,
                Status = TaskAssignmentStatus.InProgress
            });
            backlogReviewTask.Assignments.Add(new UserTaskAssignment
            {
                UserId = secondSupportUser.Id,
                Status = TaskAssignmentStatus.Pending
            });

            var onboardingTask = new UserTask
            {
                Title = "Yeni ekip üyelerini bilgilendir",
                Description = "Yeni başlayanlar için hoşgeldin paketini hazırlayın.",
                Priority = TaskPriority.Low,
                AssignedByManagerId = managerUser.Id,
                CreatedDate = DateTime.Now.AddDays(-5),
                DueDate = DateTime.Now.AddDays(-1)
            };
            onboardingTask.Assignments.Add(new UserTaskAssignment
            {
                UserId = secondSupportUser.Id,
                Status = TaskAssignmentStatus.Completed,
                CompletedDate = DateTime.Now.AddDays(-1)
            });

            context.UserTasks.Add(upcomingReportTask);
            context.UserTasks.Add(backlogReviewTask);
            context.UserTasks.Add(onboardingTask);
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
