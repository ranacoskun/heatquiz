using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class CourseMapElementImages : BaseEntity
    {
        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        public string Code { get; set; }

        public string Play { get; set; }
        public string PDF { get; set; }
        public string Video { get; set; }
        public string Link { get; set; }

        
    }
}
