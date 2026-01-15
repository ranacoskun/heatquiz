using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireQuestion : BaseEntity
    {
        public Questionnaire Questionnaire { get; set; }
        public int QuestionnaireId { get; set; }

        public int Order { get; set; }

        public QuestionnaireQuestionType? Type { get; set; }

        public string Title { get; set; }
        public string Body { get; set; }

        public bool IsSingleChoice { get; set; }

        public string ImageURL { get; set; }
        public long ImageSize { get; set; }

        public List<QuestionnaireQuestionChoice> Choices { get; set; } = new List<QuestionnaireQuestionChoice>();
        //public List<QuestionnaireQuestionChoiceTextInput> TextEntryChoices { get; set; } = new List<QuestionnaireQuestionChoiceTextInput>();
        //public List<QuestionnaireQuestionChoiceRangeInput> RangeEntryChoices { get; set; } = new List<QuestionnaireQuestionChoiceRangeInput>();
        public List<QuestionnaireQuestionFile> Files { get; set; } = new List<QuestionnaireQuestionFile>();
        public List<QuestionnaireQuestionLink> Links { get; set; } = new List<QuestionnaireQuestionLink>();

        public List<QuestionnaireStatisticInstance> StatisticInstances { get; set; } = new List<QuestionnaireStatisticInstance>();
    }

    public enum QuestionnaireQuestionType
    {
        MC = 0,
        DI = 2
    }
}
