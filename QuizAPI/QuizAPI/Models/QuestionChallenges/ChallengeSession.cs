using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionChallenges
{
    public class ChallengeSession : BaseEntity
    {
        //Relation
        public QuestionChallengeTemplate Template { get; set; }
        public int TemplateId { get; set; }

        public List<ChallengePlayer> Players { get; set; }

        //Results
        public List<QuestionChallengeSingleResult> Results { get; set; } = new List<QuestionChallengeSingleResult>();

        public bool Active { get; set; }
    }
}
