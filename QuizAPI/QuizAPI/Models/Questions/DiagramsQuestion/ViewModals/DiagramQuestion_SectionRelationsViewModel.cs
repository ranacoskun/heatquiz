using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.DiagramsQuestion.ViewModals
{
    public class DiagramQuestion_SectionRelationsViewModel : BaseEntityViewModel
    {
        public DiagramQuestion_SectionViewModel First { get; set; }
        public int FirstId { get; set; }

        public DiagramQuestion_SectionViewModel Other { get; set; }
        public int OtherId { get; set; }

        public DIAGRAM_SECTION_RELATION_TYPE RelationType { get; set; }
        public string RelationValue { get; set; } // '=' '>' '<' 'inverse'
        public string RelationValue2 { get; set; } // Start stop
        public string RelationValue3 { get; set; } // Start end

    }
}
