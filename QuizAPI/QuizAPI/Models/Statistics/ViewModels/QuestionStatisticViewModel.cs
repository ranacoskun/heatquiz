using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Statistics.ViewModels
{
    public class QuestionStatisticViewModel : BaseEntityViewModel
    {
        public long Duration { get; set; }

        public int Score { get; set; }
        public int? TotalTime { get; set; }

        //Player
        public string Player { get; set; }

        //Relations
        public KeyboardQuestionViewModel KeyboardQuestion { get; set; }
        public int? KeyboardQuestionId { get; set; }

        public SimpleClickableQuestionViewModel SimpleClickableQuestion { get; set; }
        public int? SimpleClickableQuestionId { get; set; }
    }
}
