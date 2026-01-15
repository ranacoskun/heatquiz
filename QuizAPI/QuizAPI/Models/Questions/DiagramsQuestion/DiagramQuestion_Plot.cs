using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.DiagramsQuestion
{
    public class DiagramQuestion_Plot : BaseEntity
    {
        public DiagramQuestion Question { get; set; }
        public int QuestionId { get; set; }

        public string Code { get; set; }
        public string Title { get; set; }

        public int Height { get; set; }
        public int OriginX { get; set; }
        public int OriginY { get; set; }

        public int x1 { get; set; }
        public int y1 { get; set; }
        public int x2 { get; set; }
        public int y2 { get; set; }

        public List<DiagramQuestion_Section> Sections { get; set; }
           = new List<DiagramQuestion_Section>();

        public List<DiagramQuestion_SectionRelations> Relations { get; set; }
           = new List<DiagramQuestion_SectionRelations>();

    }
}
