using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireQuestionLink : BaseEntity
    {
        public QuestionnaireQuestion Question { get; set; }
        public int QuestionId { get; set; }

        public string URL { get; set; }
    }
}
