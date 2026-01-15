using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.KeyboardQuestion.ViewModels
{
    public class AddKeyboardQuestionAnswerElementViewModel
    {
        public string Image { get; set; }
        public int? ImageId { get; set; }

        public string NumericKeyImage { get; set; }
        public int? NumericKeyId { get; set; }

        public string Value { get; set; }

        public int Order { get; set; }

    }
}
