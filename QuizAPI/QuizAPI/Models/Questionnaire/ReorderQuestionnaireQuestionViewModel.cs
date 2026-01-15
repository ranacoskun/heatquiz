using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class ReorderQuestionnaireQuestionViewModel
    {
        public int SurveyId { get; set; }

        public List<QuestionnaireQuestionViewModel> ReorderedQuestions { get; set; } 
            = new List<QuestionnaireQuestionViewModel>();
    }
}
