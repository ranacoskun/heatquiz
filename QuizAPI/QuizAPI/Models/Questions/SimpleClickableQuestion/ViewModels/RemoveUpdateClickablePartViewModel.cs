using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels
{
    public class RemoveUpdateClickablePartViewModel
    {
        public int Id { get; set; }
        public bool IsImage { get; set; }

        public int AnswerId { get; set; }

        public int X { get; set; }
        public int Y { get; set; }

    }
}
