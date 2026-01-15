using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Controllers.QuestionsController.SimpleClickableController;

namespace QuizAPI.Models.Questions
{
    public class SearchQuestionsByIdViewModel
    {
        public List<int> Ids { get; set; } = new List<int>();

        public List<Code_Number> Codes { get; set; } = new List<Code_Number>();
        public int NumberOfQuestions { get; set; }
        public List<KeyValuePair<int, int>> QuestionsIdsTypes { get; set; } = new List<KeyValuePair<int, int>>();
    
    
    }
}
