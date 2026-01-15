using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionChallenges
{
    public class QuestionChallengeSingleResult : BaseEntity
    {
        //Relation
        public ChallengeSession Session { get; set; }
        public int SessionId { get; set; }

        public ChallengePlayer Player { get; set; }
        public int PlayerId { get; set; }

        //Result
        public string Result { get; set; }
    }
}
