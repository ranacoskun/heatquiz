using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class ReorderQuestionnaireQuestionChoiceViewModel
    {
        public int QuestionId { get; set; }

        public List<QuestionnaireQuestionChoiceViewModel> ReorderedChoices { get; set; } 
            = new List<QuestionnaireQuestionChoiceViewModel>();
    }
}
