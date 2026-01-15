using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class CourseMapArrow : BaseEntity
    {
        public CourseMap Map { get; set; }
        public int MapId { get; set; }

        public int X1 { get; set; }
        public int Y1 { get; set; }
        public int X2 { get; set; }
        public int Y2 { get; set; }

        public string Color { get; set; }

        public bool Dashed { get; set; }
    }
}
