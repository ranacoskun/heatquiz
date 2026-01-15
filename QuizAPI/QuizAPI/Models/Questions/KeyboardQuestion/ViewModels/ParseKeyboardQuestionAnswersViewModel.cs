using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.KeyboardQuestion.ViewModels
{
    public class ParseKeyboardQuestionAnswersViewModel
    {
        public List<AddKeyboardQuestionAnswerViewModel> Answers { get; set; } = new List<AddKeyboardQuestionAnswerViewModel>();
    }
}
