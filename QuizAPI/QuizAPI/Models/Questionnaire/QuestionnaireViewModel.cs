using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireViewModel : BaseEntityViewModel
    {
        public string AddedByName { get; set; }

        public string Code { get; set; }
        public string Explanation { get; set; }

        public string FinalText { get; set; }
        public string ImageURL { get; set; }
        public long ImageSize { get; set; }

        public List<QuestionnaireQuestionViewModel> Questions { get; set; } = new List<QuestionnaireQuestionViewModel>();
        public List<QuestionnaireSeriesRelationViewModel> Relations { get; set; } = new List<QuestionnaireSeriesRelationViewModel>();

        //public List<QuestionnaireStatisticInstanceBaseViewModel> ParticipationStatistics { get; set; } = new List<QuestionnaireStatisticInstanceBaseViewModel>();

    }
}
