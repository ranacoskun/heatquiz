using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class CourseMapLinkStatisticsViewModel : BaseEntityViewModel
    {
        public int ElementId { get; set; }

        public string Player { get; set; }

        public string CurrentLink { get; set; }
    }
}
