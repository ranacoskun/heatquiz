using QuizAPI.Models.DefaultValues.Keyboard.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated.ViewModels
{
    public class EnergyBalanceQuestionUpdatedViewModel : QuestionBaseViewModel
    {
        public string QuestionText { get; set; }

        public List<EnergyBalanceQuestion_ControlVolumeViewModel> ControlVolumes { get; set; }
           = new List<EnergyBalanceQuestion_ControlVolumeViewModel>();

        public List<EnergyBalanceQuestion_EBTermViewModel> EnergyBalanceTerms { get; set; }
            = new List<EnergyBalanceQuestion_EBTermViewModel>();

        public List<EnergyBalanceQuestion_BCViewModel> BoundaryConditions { get; set; }
            = new List<EnergyBalanceQuestion_BCViewModel>();

        public KeyboardViewModel BoundryConditionKeyboard { get; set; }
        public int? BoundryConditionKeyboardId { get; set; }

        public List<EnergyBalanceQuestion_GeneralAnswerViewModel> BoundaryConditionLines { get; set; } 
            = new List<EnergyBalanceQuestion_GeneralAnswerViewModel>();

        public KeyboardViewModel InitialConditionKeyboard { get; set; }
        public int? InitialConditionKeyboardId { get; set; }

        public List<EnergyBalanceQuestion_GeneralAnswerViewModel> InitialConditionLines { get; set; } 
            = new List<EnergyBalanceQuestion_GeneralAnswerViewModel>();
    }
}
