using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class EditUserUsernameViewModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string NewUsername { get; set; }

    }
}
