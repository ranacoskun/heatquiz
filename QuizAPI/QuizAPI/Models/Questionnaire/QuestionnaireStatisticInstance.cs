using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireStatisticInstance : BaseEntity
    {

        public QuestionnaireStatisticInstanceBase Base { get; set; }
        public int BaseId { get; set; }

        public QuestionnaireQuestion Question { get; set; }
        public int QuestionId { get; set; }

        public List<QuestionnaireQuestionChoiceStatistic> Statistics { get; set; } = new List<QuestionnaireQuestionChoiceStatistic>();

        public int RemovedChoicesCount { get; set; }

    }
}
