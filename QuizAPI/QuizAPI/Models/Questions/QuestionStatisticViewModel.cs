using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions
{
    public class QuestionStatisticViewModel : BaseEntityViewModel
    {
        public int QuestionId { get; set; }

        public string Score { get; set; }
        public int? TotalTime { get; set; }

        public bool Correct { get; set; }

        public string Key { get; set; }
        public string Player { get; set; }

        public string Latex { get; set; }
        public List<int> ChoicesId { get; set; } = new List<int>();



    }
}
