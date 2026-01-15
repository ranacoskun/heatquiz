using QuizAPI.Models.DefaultValues.Keyboard.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated.ViewModels
{
    public class EnergyBalanceQuestion_EBTerm_QuestionViewModel : BaseEntityViewModel
    {
        public string LatexCode { get; set; }

        public bool Inflow { get; set; }

        public KeyboardViewModel Keyboard { get; set; }
        public int KeyboardId { get; set; }

        public List<EnergyBalanceQuestion_GeneralAnswerViewModel> Answers { get; set; }
            = new List<EnergyBalanceQuestion_GeneralAnswerViewModel>();
    }
}
