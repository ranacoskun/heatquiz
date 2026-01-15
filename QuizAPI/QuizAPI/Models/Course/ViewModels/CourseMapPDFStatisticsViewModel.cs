using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class CourseMapPDFStatisticsViewModel : BaseEntity
    {
        public string Player { get; set; }

        public bool OnMobile { get; set; }

    }
}
