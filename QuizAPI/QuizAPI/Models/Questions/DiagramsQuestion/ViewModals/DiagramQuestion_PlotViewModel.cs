using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.DiagramsQuestion.ViewModals
{
    public class DiagramQuestion_PlotViewModel : BaseEntityViewModel
    {
        public string Code { get; set; }
        public string Title { get; set; }
        public int Height { get; set; }

        public int OriginX { get; set; }
        public int OriginY { get; set; }

        public int x1 { get; set; }
        public int y1 { get; set; }
        public int x2 { get; set; }
        public int y2 { get; set; }

        public List<DiagramQuestion_SectionViewModel> Sections { get; set; }
           = new List<DiagramQuestion_SectionViewModel>();

        public List<DiagramQuestion_SectionRelationsViewModel> Relations { get; set; }
           = new List<DiagramQuestion_SectionRelationsViewModel>();
    }
}
