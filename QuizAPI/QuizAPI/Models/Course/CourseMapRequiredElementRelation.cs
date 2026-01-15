using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class CourseMapRequiredElementRelation : BaseEntity
    {
        public CourseMapElement BaseElement { get; set; }
        public int BaseElementId { get; set; }

        public CourseMapElement RequiredElement { get; set; }
        public int RequiredElementId { get; set; }

        public int Threshold { get; set; }
    }
}
