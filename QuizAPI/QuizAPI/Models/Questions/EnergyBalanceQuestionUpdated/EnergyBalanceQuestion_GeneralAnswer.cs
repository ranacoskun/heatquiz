using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated
{
    public class EnergyBalanceQuestion_GeneralAnswer : BaseEntity
    {
        public List<EnergyBalanceQuestion_GeneralAnswerElement> AnswerElements { get; set; } 
            = new List<EnergyBalanceQuestion_GeneralAnswerElement>();

        public EnergyBalanceQuestion_EBTerm_Question Question { get; set; }
        public int? QuestionId { get; set; }

        public EnergyBalanceQuestion_BC EnergyBalanceQuestion_BC { get; set; }
        public int? EnergyBalanceQuestion_BCId { get; set; }

        public string Comment { get; set; }
    }
}
