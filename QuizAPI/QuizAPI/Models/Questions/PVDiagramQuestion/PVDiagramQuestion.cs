using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.PVDiagramQuestion
{
    public class PVDiagramQuestion : QuestionBase
    {
        public string QuestionText { get; set; }

        public bool IsPermutableScoreEvaluation { get; set; }

        public List<PVDiagramQuestion_Group> Groups { get; set; } = new List<PVDiagramQuestion_Group>();
    }
}
