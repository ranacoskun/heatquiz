using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireStatisticInstanceViewModel : BaseEntityViewModel
    {
        public int BaseId { get; set; }

        public int QuestionId { get; set; }

        public List<QuestionnaireQuestionChoiceStatisticViewModel> Statistics { get; set; } = new List<QuestionnaireQuestionChoiceStatisticViewModel>();

        public int RemovedChoicesCount { get; set; }
    }
}
