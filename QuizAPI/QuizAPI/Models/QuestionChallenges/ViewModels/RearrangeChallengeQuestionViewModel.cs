using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionChallenges.ViewModels
{
    public class RearrangeChallengeQuestionViewModel : BaseEntityViewModel
    {
        public bool Forward { get; set; }

        public List<QuestionChallengeQuestionViewModel> Questions { get; set; } = new List<QuestionChallengeQuestionViewModel>();

    }
}
