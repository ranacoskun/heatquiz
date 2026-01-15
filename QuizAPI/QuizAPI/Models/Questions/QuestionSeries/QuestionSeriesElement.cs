using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionSeries
{
    public class QuestionSeriesElement : BaseEntity
    {
        public QuestionSeries Series { get; set; }
        public int SeriesId { get; set; }

        public int Order { get; set; }

        public SimpleClickableQuestion.SimpleClickableQuestion ClickableQuestion { get; set; }
        public int? ClickableQuestionId { get; set; }

        public KeyboardQuestion.KeyboardQuestion KeyboardQuestion { get; set; }
        public int? KeyboardQuestionId { get; set; }

        public MultipleChoiceQuestion.MultipleChoiceQuestion MultipleChoiceQuestion { get; set; }
        public int? MultipleChoiceQuestionId { get; set; }

        public QuestionBase Question {get;set;}
        public int? QuestionId { get; set; }

        public int PoolNumber { get; set; }

    }
}
