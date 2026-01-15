using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class SearchCourseViewModel
    {
        public List<int> Ids { get; set; } = new List<int>();

        public string Code { get; set; }

        public string AddedBy { get; set; }

        public int DataPoolId { get; set; }
    }
}

