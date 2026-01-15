using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.FreebodyDiagramQuestion.ViewModels
{
    public class FreebodyDiagramQuestionViewModel : QuestionBaseViewModel
    {
        public string QuestionText { get; set; }
        public int? ArrowLength { get; set; }

        public List<FreebodyDiagramQuestion_FBDViewModel> ObjectBodies { get; set; }
          = new List<FreebodyDiagramQuestion_FBDViewModel >();
    }
}
