using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class CourseMapKeyViewModel : BaseEntityViewModel
    {
        public CourseMapViewModel Map { get; set; }
        public int MapId { get; set; }

        public string Key { get; set; }
    }
}
