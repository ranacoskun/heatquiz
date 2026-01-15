using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionGroupsSubgroup
{
    public class QuestionGroup : BaseEntity
    {
        public string Name { get; set; }

        //Thumbnail
        public string URL { get; set; }

        public long Size { get; set; }

        //Course Relation
        public Course.Course Course { get; set; }
        public int CourseId { get; set; }

        //Subgroups
        public List<QuestionSubgroup> Subgroups { get; set; }
        = new List<QuestionSubgroup>();

    }
}
