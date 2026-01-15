using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class CourseBonusPointRegimeRelation : BaseEntity
    {
        public CourseBonusPointRegime Regime { get; set; }
        public int RegimeId { get; set; }

        public CourseMap Map { get; set; }
        public int MapId { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int Percentage { get; set; }
    }
}
