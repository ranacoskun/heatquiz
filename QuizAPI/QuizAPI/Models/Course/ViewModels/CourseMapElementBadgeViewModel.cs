using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class CourseMapElementBadgeViewModel : BaseEntityViewModel
    {
        public int Progress { get; set; }

        public string URL { get; set; }
    }
}
