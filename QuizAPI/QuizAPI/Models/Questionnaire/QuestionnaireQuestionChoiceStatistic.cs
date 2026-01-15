using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireQuestionChoiceStatistic : BaseEntity
    {
        public QuestionnaireStatisticInstance Instance { get; set; }
        public int InstanceeId { get; set; }

        public QuestionnaireQuestionChoice Choice { get; set; }
        public int ChoiceId { get; set; }

        public string Value { get; set; }
    }
}
