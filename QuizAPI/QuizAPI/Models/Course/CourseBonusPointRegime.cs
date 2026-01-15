using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class CourseBonusPointRegime : BaseEntity
    {
        public Course Course { get; set; }
        public int CourseId { get; set; }

        public string Name { get; set; }

        public List<CourseBonusPointRegimeRelation> Relations { get; set; } = new List<CourseBonusPointRegimeRelation>();

    }
}
