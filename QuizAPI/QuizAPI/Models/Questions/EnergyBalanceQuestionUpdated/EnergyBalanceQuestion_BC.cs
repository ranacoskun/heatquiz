using QuizAPI.Models.DefaultValues.Keyboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated
{
    public class EnergyBalanceQuestion_BC : BaseEntity
    {
        public EnergyBalanceQuestionUpdated Question { get; set; }
        public int QuestionId { get; set; }

        public string Code { get; set; }
        public string Latex { get; set; }
        public string LatexText { get; set; }

        public Keyboard Keyboard { get; set; }
        public int KeyboardId { get; set; }

        public List<EnergyBalanceQuestion_GeneralAnswer> Answers { get; set; }
           = new List<EnergyBalanceQuestion_GeneralAnswer>();
    }
}
