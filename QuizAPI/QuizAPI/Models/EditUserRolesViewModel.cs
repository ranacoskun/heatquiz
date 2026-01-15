using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class EditUserRolesViewModel
    {
        [Required]
        public string Username { get; set; }

        public List<string> Roles { get; set; } = new List<string>();
    }
}
