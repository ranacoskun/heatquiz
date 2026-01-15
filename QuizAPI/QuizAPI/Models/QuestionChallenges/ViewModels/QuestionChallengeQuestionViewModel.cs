using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionChallenges.ViewModels
{
    public class QuestionChallengeQuestionViewModel : BaseEntityViewModel
    {
        public int Order { get; set; }

        public int ChallengeTemplateId { get; set; }

        public SimpleClickableQuestionViewModel ClickableQuestion { get; set; }
        public int? ClickableQuestionId { get; set; }

        //Keyboard Question 
        public KeyboardQuestionViewModel KeyboardQuestion { get; set; }
        public int? KeyboardQuestionId { get; set; }
    }
}
