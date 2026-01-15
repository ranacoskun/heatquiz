using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Controllers.QuestionsController.SimpleClickableController;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class SearchKeysByIdViewModel
    {
        public int NumberOfKeys { get; set; }
        public List<Code_Number> Codes { get; set; } = new List<Code_Number>();

        public List<int> KeyIds { get; set; } = new List<int>();
        public List<int> Ids { get; set; } = new List<int>();

        public int Type { get; set; }

    }
}
