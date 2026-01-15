using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireQuestionChoiceTextInput : QuestionnaireQuestionChoice
    {
        public int MaxCharacterCount { get; set; }
    }
}
