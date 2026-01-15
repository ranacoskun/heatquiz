using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.PVDiagramQuestion
{
    public class PVDiagramQuestion_GroupViewModel : BaseEntityViewModel
    {
        public PVDiagramQuestion Question { get; set; }
        public int QuestionId { get; set; }

        public string Code { get; set; }

        public string LineColor { get; set; }
        public int LineWidth { get; set; }

        public bool IsPointsOnly { get; set; }
        public bool IsClosedLoop { get; set; }

        //Points
        public List<PVDiagramQuestion_PointViewModel> Points { get; set; } = new List<PVDiagramQuestion_PointViewModel>();

        //Relations
        public List<PVDiagramQuestion_RelationViewModel> Relations { get; set; } = new List<PVDiagramQuestion_RelationViewModel>();
    }
}
