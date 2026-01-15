using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.KeyboardQuestion.ViewModels
{
    public class KeyboardQuestionAnswerElementViewModel : BaseEntityViewModel
    {
        public string Image { get; set; }
        public int? ImageId { get; set; }

        public string NumericKeyImage { get; set; }
        public int? NumericKeyId { get; set; }

        public bool IsInteger { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        public string TextPresentation { get; set; }

        public string Value { get; set; }

        public int AnswerId { get; set; }

        public int? Order { get; set; }
    }
}
