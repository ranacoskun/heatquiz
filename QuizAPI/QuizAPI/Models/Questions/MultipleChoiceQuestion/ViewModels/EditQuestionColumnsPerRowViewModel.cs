using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.MultipleChoiceQuestion.ViewModels
{
    public class EditQuestionColumnsPerRowViewModel
    {
        [Required]
        public int Id { get; set; }

        public int ChoicesPerRow { get; set; }
    }
}
