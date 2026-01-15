using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated
{
    public class EnergyBalanceQuestion_EBTerm : BaseEntity
    {
        public EnergyBalanceQuestionUpdated Question { get; set; }
        public int QuestionId { get; set; }

        public string Code { get; set; }
        public string Latex { get; set; }
        public string LatexText { get; set; }

        public bool West { get; set; }
        public bool North { get; set; }
        public bool East { get; set; }
        public bool South { get; set; }
        public bool Center { get; set; }
        public bool IsDummy { get; set; }

        public List<EnergyBalanceQuestion_EBTerm_Question> Questions { get; set; } 
            = new List<EnergyBalanceQuestion_EBTerm_Question>();

        public string Comment { get; set; }

    }
}
