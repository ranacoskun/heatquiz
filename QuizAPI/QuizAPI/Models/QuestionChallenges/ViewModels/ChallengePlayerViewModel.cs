using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionChallenges.ViewModels
{
    public class ChallengePlayerViewModel : BaseEntityViewModel
    {
        public string Name { get; set; }

        //Relation
        public ChallengeSessionViewModel Session { get; set; }
        public int SessionId { get; set; }

        public string Score { get; set; }

    }
}
