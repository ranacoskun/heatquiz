using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class CourseMapRequiredElementRelationViewModel : BaseEntityViewModel
    {
        public CourseMapElementViewModel BaseElement { get; set; }
        public int BaseElementId { get; set; }

        public CourseMapElementViewModel RequiredElement { get; set; }
        public int RequiredElementId { get; set; }

        public int Threshold { get; set; }
    }
}
