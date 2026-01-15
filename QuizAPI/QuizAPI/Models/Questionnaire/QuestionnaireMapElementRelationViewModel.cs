using QuizAPI.Models.Course.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireMapElementRelationViewModel : BaseEntityViewModel
    {
        public CourseMapElementViewModel MapElement { get; set; }
        public int MapElementId { get; set; }

        public QuestionnaireViewModel Questionnaire { get; set; }
        public int QuestionnaireId { get; set; }

        public bool IsRepeatable { get; set; }
    }
}
