using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireHistoryViewModel
    {
        public int SurveyId { get; set; }
        public string Key { get; set; }

        public string From { get; set; }

        public string To { get; set; }
    }
}
