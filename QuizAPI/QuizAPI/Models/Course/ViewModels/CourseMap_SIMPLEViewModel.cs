using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class CourseMap_SIMPLEViewModel : BaseEntityViewModel
    {

        public string Title { get; set; }

        public bool IsSeriesMap { get; set; }

        public string LargeMapURL { get; set; }
        public int LargeMapWidth { get; set; }
        public int LargeMapLength { get; set; }

    }
}
