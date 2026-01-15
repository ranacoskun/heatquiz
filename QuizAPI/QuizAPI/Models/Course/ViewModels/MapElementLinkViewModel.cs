using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class MapElementLinkViewModel : BaseEntityViewModel
    {
        public CourseMapElementViewModel Element { get; set; }
        public int ElementId { get; set; }

        public CourseMapViewModel Map { get; set; }
        public int MapId { get; set; }
    }
}
