using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.DiagramsQuestion
{
    public class DiagramQuestion : QuestionBase
    {
        public string QuestionText { get; set; }

        public List<DiagramQuestion_Plot> Plots { get; set; } = new List<DiagramQuestion_Plot>();
       
    }
}
