using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class MapElementLink : BaseEntity
    {
        public CourseMapElement Element { get; set; }
        public int ElementId { get; set; }

        public CourseMap Map { get; set; }
        public int MapId { get; set; }
    }
}
