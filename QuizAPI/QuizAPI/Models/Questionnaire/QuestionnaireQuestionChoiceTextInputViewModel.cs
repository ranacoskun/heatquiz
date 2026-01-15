using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireQuestionChoiceTextInputViewModel : QuestionnaireQuestionChoiceViewModel
    {
        public int MaxCharacterCount { get; set; }
    }
}
