using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireQuestionChoiceWithStatisticsViewModel
    {
        public QuestionnaireQuestionViewModel Question { get; set; }
        public int QuestionId { get; set; }

        public string LaTex { get; set; }

        public string ImageURL { get; set; }

        public long ImageSize { get; set; }

        public int TotalClicks { get; set; }
    }
}
