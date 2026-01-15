using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using QuizAPI.Models.Questions.MultipleChoiceQuestion.ViewModels;
using QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionSeries.ViewModels
{
    public class QuestionSeriesElementViewModel : BaseEntityViewModel
    {
        public int Order { get; set; }

        public SimpleClickableQuestionViewModel ClickableQuestion { get; set; }
        public int? ClickableQuestionId { get; set; }

        public KeyboardQuestionViewModel KeyboardQuestion { get; set; }
        public int? KeyboardQuestionId { get; set; }

        public MultipleChoiceQuestionViewModel MultipleChoiceQuestion { get; set; }
        public int? MultipleChoiceQuestionId { get; set; }

        public QuestionBaseViewModel Question { get; set; }
        public int QuestionId { get; set; }

        public int PoolNumber { get; set; }

    }
}
