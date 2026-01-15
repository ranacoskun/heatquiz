using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions
{
    public class QuestionStatistic : BaseEntity
    {
        public QuestionBase Question { get; set; }
        public int QuestionId { get; set; }

        public string Score { get; set; }
        public int? TotalTime { get; set; }

        public bool Correct {get; set;}

        public string Key { get; set; }

        public string Player { get; set; }
    }
}
