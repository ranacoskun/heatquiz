using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Ownership
{
    public class CourseOwner : BaseEntity
    {
        public Course.Course Course { get; set; }
        public int CourseId { get; set; }

        public BaseUser Owner { get; set; }
        public string OwnerId { get; set; }
    }
}
