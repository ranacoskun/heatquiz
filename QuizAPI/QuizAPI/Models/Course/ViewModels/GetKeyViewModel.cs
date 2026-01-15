using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class GetKeyViewModel
    {
        [Required]
        public string Formula { get; set; }
    }
}
