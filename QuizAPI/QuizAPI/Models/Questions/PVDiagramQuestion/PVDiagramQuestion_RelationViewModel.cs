using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.PVDiagramQuestion
{
    public class PVDiagramQuestion_RelationViewModel : BaseEntityViewModel
    {
        public PVDiagramQuestion_PointViewModel FirstPoint { get; set; }
        public int FirstPointId { get; set; }

        public PVDiagramQuestion_PointViewModel SecondPoint { get; set; }
        public int SecondPointId { get; set; }

        public string Value { get; set; }

        public PV_RELATION_TYPE Type { get; set; }

        public string Comment { get; set; }
    }
}
