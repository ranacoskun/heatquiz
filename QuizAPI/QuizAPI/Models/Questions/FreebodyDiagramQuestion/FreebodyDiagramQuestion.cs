using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.FreebodyDiagramQuestion
{
    public class FreebodyDiagramQuestion : QuestionBase
    {
        public string QuestionText { get; set; }

        public int? ArrowLength { get; set; }

        public List<FreebodyDiagramQuestion_FBD> ObjectBodies { get; set; }
          = new List<FreebodyDiagramQuestion_FBD>();

    }
}
