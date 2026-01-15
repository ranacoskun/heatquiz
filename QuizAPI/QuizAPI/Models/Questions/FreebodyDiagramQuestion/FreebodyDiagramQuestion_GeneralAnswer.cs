using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.FreebodyDiagramQuestion
{
    public class FreebodyDiagramQuestion_GeneralAnswer : BaseEntity
    {
        public List<FreebodyDiagramQuestion_GeneralAnswerElement> AnswerElements { get; set; }
            = new List<FreebodyDiagramQuestion_GeneralAnswerElement>();

        public FreebodyDiagramQuestion_VectorTerm VectorTerm { get; set; }
        public int VectorTermId { get; set; }
    }
}
