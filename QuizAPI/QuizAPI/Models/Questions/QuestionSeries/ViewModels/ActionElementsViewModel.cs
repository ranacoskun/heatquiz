using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionSeries.ViewModels
{
    public class ActionElementsViewModel
    {
        public int FirstId { get; set; }
        public int SecondId { get; set; }

        public bool Swap { get; set; }
        public bool MoveAfter { get; set; }
        public bool MoveBefore { get; set; }

    }
}
