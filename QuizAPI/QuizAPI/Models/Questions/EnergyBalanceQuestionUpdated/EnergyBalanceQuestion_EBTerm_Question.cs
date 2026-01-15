using QuizAPI.Models.DefaultValues.Keyboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated
{
    public class EnergyBalanceQuestion_EBTerm_Question : BaseEntity
    {
        public string LatexCode { get; set; }

        public bool Inflow { get; set; }

        public Keyboard Keyboard { get; set; }
        public int KeyboardId { get; set; }

        public List<EnergyBalanceQuestion_GeneralAnswer> Answers { get; set; } 
            = new List<EnergyBalanceQuestion_GeneralAnswer>();


    }
}
