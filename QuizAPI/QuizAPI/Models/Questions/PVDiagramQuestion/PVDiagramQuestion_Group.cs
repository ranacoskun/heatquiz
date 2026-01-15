using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.PVDiagramQuestion
{
    public class PVDiagramQuestion_Group : BaseEntity
    {
        public PVDiagramQuestion Question { get; set; }
        public int QuestionId { get; set; }

        public string Code { get; set; }

        public string LineColor { get; set; }
        public int LineWidth { get; set; }

        public bool IsPointsOnly { get; set; }
        public bool IsClosedLoop { get; set; }

        //Points
        public List<PVDiagramQuestion_Point> Points { get; set; } = new List<PVDiagramQuestion_Point>();

        //Relations
        public List<PVDiagramQuestion_Relation> Relations { get; set; } = new List<PVDiagramQuestion_Relation>();
    }
}
