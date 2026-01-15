using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Controllers.QuestionsController.SimpleClickableController;

namespace QuizAPI.Models.Questions.QuestionSeries.ViewModels
{
    public class SearchSeriesByIdViewModel
    {
        public List<int> Ids { get; set; } = new List<int>();

        public List<Code_Number> Codes { get; set; } = new List<Code_Number>();
        public int NumberOfSeries { get; set; }
        public List<int> SeriesIds { get; set; } = new List<int>();
    }
}
