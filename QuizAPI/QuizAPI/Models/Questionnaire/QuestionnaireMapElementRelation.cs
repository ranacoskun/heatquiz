using QuizAPI.Models.Course;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireMapElementRelation : BaseEntity
    {
        public CourseMapElement MapElement { get; set; }
        public int MapElementId { get; set; }

        public Questionnaire Questionnaire { get; set; }
        public int QuestionnaireId { get; set; }

        public bool IsRepeatable { get; set; }
    }
}
