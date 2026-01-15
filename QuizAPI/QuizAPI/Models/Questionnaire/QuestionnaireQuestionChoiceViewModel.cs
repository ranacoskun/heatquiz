using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireQuestionChoiceViewModel : BaseEntityViewModel
    {
        public QuestionnaireQuestionViewModel Question { get; set; }
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

        //public List<QuestionnaireQuestionChoiceStatisticViewModel> Statistics { get; set; } = new List<QuestionnaireQuestionChoiceStatisticViewModel>();

    }
}
