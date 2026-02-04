using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireQuestionChoiceRangeInputViewModel : QuestionnaireQuestionChoiceViewModel
    {
        public new double Start { get; set; }
        public new double End { get; set; }
        public new double Step { get; set; }
    }
}
