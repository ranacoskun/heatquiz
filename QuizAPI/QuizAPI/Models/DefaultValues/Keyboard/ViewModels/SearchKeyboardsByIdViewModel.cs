using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Controllers.QuestionsController.SimpleClickableController;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class SearchKeyboardsByIdViewModel
    {
        public List<int> Ids { get; set; } = new List<int>();

        public List<Code_Number> Codes { get; set; } = new List<Code_Number>();
        public int NumberOfKeyboards { get; set; }
        public List<int> KeyboardIds { get; set; } = new List<int>();
    }
}
