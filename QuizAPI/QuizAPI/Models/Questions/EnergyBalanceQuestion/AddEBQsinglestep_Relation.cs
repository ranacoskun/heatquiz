using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class AddEBQsinglestep_Relation
    {
        public List<string> Questions { get; set; } 
        public string Label { get; set; }
        public List<int> Directions { get; set; }
        public bool Correct { get; set; }
        public bool IsDummy { get; set; }


    }
}
