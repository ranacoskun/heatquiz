using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.FreebodyDiagramQuestion
{
    public class FreebodyDiagramQuestion_FBD : BaseEntity
    {
        public FreebodyDiagramQuestion Question { get; set; }
        public int QuestionId { get; set; }

        public string Color { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        public int Width { get; set; }
        public int Height { get; set; }

        public string Comment { get; set; }

        public List<FreebodyDiagramQuestion_VectorTerm> VectorTerms { get; set; } = new List<FreebodyDiagramQuestion_VectorTerm>();
    }
}
