using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionChallenges
{
    public class ChallengePlayer : BaseEntity
    {
        public string Name { get; set; }

        //Relation
        public ChallengeSession Session { get; set; }
        public int SessionId { get; set; }

        public string Score { get; set; }
    }
}
