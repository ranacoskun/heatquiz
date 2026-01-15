using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class CourseMapBadgeSystemEntity : BaseEntity
    {
        public CourseMapBadgeSystem System { get; set; }
        public int SystemId { get; set; }

        public string URL { get; set; }

        public int Progress { get; set; }

    }
}
