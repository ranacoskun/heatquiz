using QuizAPI.Models.Questions.KeyboardQuestion;
using QuizAPI.Models.Questions.SimpleClickableQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Statistics
{
    public class QuestionStatistic : BaseEntity
    {
        public long Duration { get; set; }

        public int Score { get; set; }

        public int? TotalTime { get; set; }

        //Player
        public ApplicationUser Player { get; set; }
        public int PlayerId { get; set; }

        //Relations
        public KeyboardQuestion KeyboardQuestion { get; set; }
        public int? KeyboardQuestionId { get; set; }

        public SimpleClickableQuestion SimpleClickableQuestion { get; set; }
        public int? SimpleClickableQuestionId { get; set; }


    }
}
