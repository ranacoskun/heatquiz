using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionChallenges
{
    public class QuestionChallengeTemplate : BaseEntity
    {
        public string Code { get; set; }

        //Time
        public int TimeInMinutes { get; set; }

        //Questions
        public List<QuestionChallengeQuestion> Questions { get; set; } = new List<QuestionChallengeQuestion>();  
    }
}
