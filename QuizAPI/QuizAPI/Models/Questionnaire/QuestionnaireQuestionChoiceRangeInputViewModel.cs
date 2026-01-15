using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireQuestionChoiceRangeInputViewModel : QuestionnaireQuestionChoiceViewModel
    {
        public double Start { get; set; }
        public double End { get; set; }
        public double Step { get; set; }
    }
}
