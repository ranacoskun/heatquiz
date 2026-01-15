using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.KeyboardQuestion.ViewModels
{
    public class AddKeyboardQuestionAnswerViewModel
    {
        public int Id { get; set; }

        public int? AnswerId { get; set; }

        public int? QuestionId { get; set; }

        public List<AddKeyboardQuestionAnswerElementViewModel> Answer { get; set; } = new List<AddKeyboardQuestionAnswerElementViewModel>();
    }
}
