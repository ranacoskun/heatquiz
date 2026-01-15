using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.DiagramsQuestion
{
    public class DiagramQuestion_SectionRelations : BaseEntity
    {
        public DiagramQuestion_Plot Plot { get; set; }
        public int PlotId { get; set; }

        public DiagramQuestion_Section First { get; set; }
        public int FirstId { get; set; }

        public DiagramQuestion_Section Other { get; set; }
        public int OtherId { get; set; }

        public DIAGRAM_SECTION_RELATION_TYPE RelationType { get; set; }
        public string RelationValue { get; set; } // '=' '>' '<' 'inverse'
        public string RelationValue2 { get; set; } // Start end
        public string RelationValue3 { get; set; } // Start end
    }

    public enum DIAGRAM_SECTION_RELATION_TYPE
    {
        POSITION = 0,
        SLOPE = 2,
        INVERSE_SLOPE = 4,
    }
}
