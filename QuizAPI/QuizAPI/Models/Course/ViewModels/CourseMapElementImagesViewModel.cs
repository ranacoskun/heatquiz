using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class CourseMapElementImagesViewModel : BaseEntityViewModel
    {
        public string Code { get; set; }

        public string AddedByName { get; set; }
        public string Play { get; set; }
        public string PDF { get; set; }
        public string Video { get; set; }
        public string Link { get; set; }
    }
}
