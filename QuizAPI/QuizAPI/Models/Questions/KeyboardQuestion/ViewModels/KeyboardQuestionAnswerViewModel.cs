using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.KeyboardQuestion.ViewModels
{
    public class KeyboardQuestionAnswerViewModel : BaseEntityViewModel
    {
        public int QuestionId { get; set; }


        public List<KeyboardQuestionAnswerElementViewModel> AnswerElements { get; set; }
            = new List<KeyboardQuestionAnswerElementViewModel>();
    }
}
