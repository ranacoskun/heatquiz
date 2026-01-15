using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class SearchMapsViewModel
    {
        public string Title { get; set; }

        public int? CourseId { get; set; }

        public int Page { get; set; }
        public int QperPage { get; set; }

        public int NumberOfMaps { get; set; }

        public int? DataPoolId { get; set; }


    }
}
