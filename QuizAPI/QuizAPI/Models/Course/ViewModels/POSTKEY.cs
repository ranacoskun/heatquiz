using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class POSTKEY
    {
        [Required]
        public string Key { get; set; }

        [Required]
        public string PlayerId { get; set; }

        [Required]
        public int MapId { get; set; }
    }
}
