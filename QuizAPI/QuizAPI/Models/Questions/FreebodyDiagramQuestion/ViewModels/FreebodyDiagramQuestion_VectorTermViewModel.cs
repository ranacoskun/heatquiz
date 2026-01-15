using QuizAPI.Models.DefaultValues.Keyboard.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.FreebodyDiagramQuestion.ViewModels
{
    public class FreebodyDiagramQuestion_VectorTermViewModel : BaseEntityViewModel
    {
        public FreebodyDiagramQuestion_FBDViewModel BodyObject { get; set; }
        public int BodyObjectId { get; set; }
        public string ArrowColor { get; set; }

        public string Code { get; set; }
        public string Latex { get; set; }
        public string LatexText { get; set; }

        public KeyboardViewModel Keyboard { get; set; }
        public int? KeyboardId { get; set; }
        public bool Linear { get; set; }

        public float Angle { get; set; }
        public bool Clockwise { get; set; }
        public string Comment { get; set; }

        public List<FreebodyDiagramQuestion_GeneralAnswerViewModel> Answers { get; set; }
           = new List<FreebodyDiagramQuestion_GeneralAnswerViewModel>();
    }
}

