using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireQuestionFile : BaseEntity
    {
        public QuestionnaireQuestion Question { get; set; }
        public int QuestionId { get; set; }

        public string URL { get; set; }
        public long FileSize { get; set; }

    }
}
