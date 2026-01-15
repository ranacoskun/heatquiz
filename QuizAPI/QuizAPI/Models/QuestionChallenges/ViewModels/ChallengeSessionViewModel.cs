using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionChallenges.ViewModels
{
    public class ChallengeSessionViewModel : BaseEntityViewModel
    {
        //Relation
        public QuestionChallengeTemplateViewModel Template { get; set; }
        public int TemplateId { get; set; }

        //Players
        public List<ChallengePlayerViewModel> Players { get; set; }

        //Results
        public List<QuestionChallengeSingleResultViewModel> Results { get; set; } = new List<QuestionChallengeSingleResultViewModel>();

        public bool Active { get; set; }
    }
}
