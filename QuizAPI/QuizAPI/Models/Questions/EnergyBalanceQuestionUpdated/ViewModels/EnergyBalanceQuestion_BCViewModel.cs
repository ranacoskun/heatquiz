using QuizAPI.Models.DefaultValues.Keyboard.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated.ViewModels
{
    public class EnergyBalanceQuestion_BCViewModel : BaseEntityViewModel
    {
        public EnergyBalanceQuestionUpdatedViewModel Question { get; set; }
        public int QuestionId { get; set; }

        public string Code { get; set; }
        public string Latex { get; set; }
        public string LatexText { get; set; }

        public KeyboardViewModel Keyboard { get; set; }
        public int KeyboardId { get; set; }

        public List<EnergyBalanceQuestion_GeneralAnswerViewModel> Answers { get; set; }
           = new List<EnergyBalanceQuestion_GeneralAnswerViewModel>();
    }
}
