using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class ApplicationUserViewModel : BaseEntityViewModel
    {
        public string Code { get; set; }

        [Required]
        public string NickName { get; set; }


        public string Password { get; set; }
    }
}
