using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class CourseMapBadgeSystemViewModel : BaseEntityViewModel
    {
        public int MapId { get; set; }

        public string Title { get; set; }

        public List<CourseMapBadgeSystemEntityViewModel> Entities { get; set; } = new List<CourseMapBadgeSystemEntityViewModel>();
    }
}
