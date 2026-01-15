using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionChallenges.ViewModels
{
    public class QuestionChallengeTemplateViewModel : BaseEntityViewModel
    {
        public string Code { get; set; }

        //Time
        public int TimeInMinutes { get; set; }

        //Questions
        public List<QuestionChallengeQuestionViewModel> Questions { get; set; } = new List<QuestionChallengeQuestionViewModel>();
    }
}
