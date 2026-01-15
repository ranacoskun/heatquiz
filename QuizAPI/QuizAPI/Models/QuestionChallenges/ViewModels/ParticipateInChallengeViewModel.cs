using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionChallenges.ViewModels
{
    public class ParticipateInChallengeViewModel
    {
        public int SessionId { get; set; }

        public string Name { get; set; }
    }

    public class ChallengePlayerSubmit
    {
        public int PlayerId { get; set; }

        public List<ChallengeQuestionScore> Scores { get; set; }
    }

    public class ChallengeQuestionScore
    {
        public int Order { get; set; }

        public int Score { get; set; }
    }
}
