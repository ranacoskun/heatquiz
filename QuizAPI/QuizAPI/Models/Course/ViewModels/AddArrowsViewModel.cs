using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class AddArrowsViewModel
    {
        public int MapId { get; set; }
        public List<AddCourseMapArrowViewModel> Arrows { get; set; } = new List<AddCourseMapArrowViewModel>();
    }
}
