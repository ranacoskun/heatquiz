using QuizAPI.Models.DefaultValues.Keyboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.FreebodyDiagramQuestion
{
    public class FreebodyDiagramQuestion_VectorTerm : BaseEntity
    {
        public FreebodyDiagramQuestion_FBD BodyObject { get; set; }
        public int BodyObjectId { get; set; }

        public string ArrowColor { get; set; }
        public string Code { get; set; }
        public string Latex { get; set; }
        public string LatexText { get; set; }

        public Keyboard Keyboard { get; set; }
        public int? KeyboardId { get; set; }

        public bool Linear { get; set; }

        public float Angle { get; set; }
        public bool Clockwise { get; set; }

        public string Comment { get; set; }

        public List<FreebodyDiagramQuestion_GeneralAnswer> Answers { get; set; }
           = new List<FreebodyDiagramQuestion_GeneralAnswer>();
    }
}
