using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class CourseMapBadgeSystem : BaseEntity
    {
        public CourseMap Map { get; set; }
        public int MapId { get; set; }

        public string Title { get; set; }

        public List<CourseMapBadgeSystemEntity> Entities { get; set; } = new List<CourseMapBadgeSystemEntity>();



    }
}
