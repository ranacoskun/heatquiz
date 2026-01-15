using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class CourseMapElementBadge : BaseEntity
    {
        public CourseMapElement CourseMapElement { get; set; }
        public int CourseMapElementId { get; set; }


        public int Progress { get; set; }

        public string URL { get; set; }
    }
}
