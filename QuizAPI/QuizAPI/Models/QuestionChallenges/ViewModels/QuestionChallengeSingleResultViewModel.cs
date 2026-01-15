using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionChallenges.ViewModels
{
    public class QuestionChallengeSingleResultViewModel : BaseEntityViewModel
    {
        //Relation
        public int SessionId { get; set; }

        public int PlayerId { get; set; }

        //Result
        public string Result { get; set; }
    }
}
