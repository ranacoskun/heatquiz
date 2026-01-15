using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.FreebodyDiagramQuestion.ViewModels
{
    public class FreebodyDiagramQuestion_GeneralAnswerViewModel : BaseEntityViewModel
    {
        public List<FreebodyDiagramQuestion_GeneralAnswerElementViewModel> AnswerElements { get; set; }
            = new List<FreebodyDiagramQuestion_GeneralAnswerElementViewModel>();

        public FreebodyDiagramQuestion_VectorTermViewModel VectorTerm { get; set; }
        public int VectorTermId { get; set; }
    }
}
