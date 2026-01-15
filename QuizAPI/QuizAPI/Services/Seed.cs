using Microsoft.AspNetCore.Identity;
using QuizAPI.Data;
using QuizAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Services
{
    public class Seed
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<BaseUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public Seed(
            ApplicationDbContext context,
            UserManager<BaseUser> userManager,
            RoleManager<IdentityRole> roleManager
            )
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public void SeedAdminAndRoles()
        {
            var Roles = new List<string>() { "admin","question_editor", "course_editor" };

            foreach(var Role in Roles)
            {
                _roleManager.CreateAsync(new IdentityRole()
                {
                    Name = Role.ToLower(),
                    NormalizedName = Role.ToUpper()
                }).Wait();
            }

            var Admin = new BaseUser()
            {
                Name = "Admin",
                UserName = "admin",
                NormalizedUserName = "admin".ToUpper(),
                Email = "admin@rwth-aachen.de",
                NormalizedEmail = "admin@rwth-aachen.de".ToUpper(),
                RegisteredOn = DateTime.UtcNow
            };

            _userManager.CreateAsync(Admin, "123456").Wait();

            _userManager.AddToRoleAsync(Admin, Roles[0].ToLower()).Wait();

        }
    }
}
