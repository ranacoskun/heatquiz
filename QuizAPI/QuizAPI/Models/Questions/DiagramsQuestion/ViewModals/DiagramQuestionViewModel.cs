using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.DiagramsQuestion.ViewModals
{
    public class DiagramQuestionViewModel : QuestionBaseViewModel
    {
        public string QuestionText { get; set; }
        public List<DiagramQuestion_PlotViewModel> Plots { get; set; } = new List<DiagramQuestion_PlotViewModel>();

    }
}
