using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionSeries.ViewModels
{
    public class AssignElementsToPoolViewModel
    {
        public List<int> SelectedElements { get; set; } = new List<int>();
        public int Pool { get; set; }
    }
}
