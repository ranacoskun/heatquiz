using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireQuestionChoice : BaseEntity
    {
        public QuestionnaireQuestion Question { get; set; }
        public int QuestionId { get; set; }

        public QuestionnaireQuestionChoiceType? Type { get; set; }

        public int Order { get; set; }

        public string LaTex { get; set; }

        public string ImageURL { get; set; }

        public long ImageSize { get; set; }

        //Range input
        public float? Start { get; set; }
        public float? End { get; set; }
        public float? Step { get; set; }

        //Text input
        public int? MaxCharacterCount { get; set; }


        public List<QuestionnaireQuestionChoiceStatistic> Statistics { get; set; } = new List<QuestionnaireQuestionChoiceStatistic>();

    }

    public enum QuestionnaireQuestionChoiceType
    {
        NORMAL = 2,
        TXT = 4,
        RANGE = 8,
    }
}
