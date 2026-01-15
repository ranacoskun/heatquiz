using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class Questionnaire : BaseEntity
    {
        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        public string Code { get; set; }

        public string Explanation { get; set; }

        public string FinalText { get; set; }
        public string ImageURL { get; set; }
        public long ImageSize { get; set; }

        public List<QuestionnaireQuestion> Questions { get; set; } = new List<QuestionnaireQuestion>();

        public List<QuestionnaireStatisticInstanceBase> ParticipationStatistics { get; set; } = new List<QuestionnaireStatisticInstanceBase>();

        public List<QuestionnaireSeriesRelation> Relations { get; set; } = new List<QuestionnaireSeriesRelation>();
        public List<QuestionnaireMapElementRelation> MapElementRelations { get; set; } = new List<QuestionnaireMapElementRelation>();
    }
}
