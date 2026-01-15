using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class AddCourseMapBadgeGroupSingleStepViewModel
    {
        public int MapId { get; set; }

        [Required]
        public string Title { get; set; }

        public List<IFormFile> Pictures { get; set; } = new List<IFormFile>();

        public List<int> ProgressList { get; set; } = new List<int>();
    }
}
