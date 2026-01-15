using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.PVDiagramQuestion
{
    public class PVDiagramQuestion_Relation : BaseEntity
    {
        public PVDiagramQuestion_Group Group { get; set; }
        public int GroupId { get; set; }

        public PVDiagramQuestion_Point FirstPoint { get; set; }
        public int FirstPointId { get; set; }

        public PVDiagramQuestion_Point SecondPoint { get; set; }
        public int SecondPointId { get; set; }

        public string Value { get; set; }

        public PV_RELATION_TYPE Type { get; set; }

        public string Comment { get; set; }

    }

    public enum PV_RELATION_TYPE
    {
        X_POSITION = 0,
        Y_POSITION = 2,
        GRADIENT = 4,
    }
}
