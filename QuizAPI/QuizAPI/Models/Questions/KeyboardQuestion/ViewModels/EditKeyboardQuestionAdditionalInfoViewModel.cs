using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.KeyboardQuestion.ViewModels
{
    public class EditKeyboardQuestionAdditionalInfoViewModel
    {
        [Required]
        public int Id { get; set; }

        public string AdditionalInfo { get; set; }
    }
}
