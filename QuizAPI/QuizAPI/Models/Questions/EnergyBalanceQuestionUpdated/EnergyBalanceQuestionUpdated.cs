using QuizAPI.Models.DefaultValues.Keyboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated
{
    public class EnergyBalanceQuestionUpdated : QuestionBase
    {
        public string QuestionText { get; set; }

        public List<EnergyBalanceQuestion_ControlVolume> ControlVolumes { get; set; }
           = new List<EnergyBalanceQuestion_ControlVolume>();

        public List<EnergyBalanceQuestion_EBTerm> EnergyBalanceTerms { get; set; }
            = new List<EnergyBalanceQuestion_EBTerm>();

        public List<EnergyBalanceQuestion_BC> BoundaryConditions { get; set; }
            = new List<EnergyBalanceQuestion_BC>();

        public Keyboard BoundryConditionKeyboard { get; set; }
        public int? BoundryConditionKeyboardId { get; set; }

        public List<EnergyBalanceQuestion_GeneralAnswer> BoundaryConditionLines { get; set; } = new List<EnergyBalanceQuestion_GeneralAnswer>();

        public Keyboard InitialConditionKeyboard { get; set; }
        public int? InitialConditionKeyboardId { get; set; }

        public List<EnergyBalanceQuestion_GeneralAnswer> InitialConditionLines { get; set; } = new List<EnergyBalanceQuestion_GeneralAnswer>();
    }
}
