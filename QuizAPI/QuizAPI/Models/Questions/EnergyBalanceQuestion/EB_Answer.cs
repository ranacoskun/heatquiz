using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class EB_Answer : BaseEntity
    {
      public EB_ClickablePart Part { get; set; }
      public int? PartId { get; set; }

     public EB_Question Questioneer { get; set; }
     public int? QuestioneerId { get; set; }

     public EB_BoundryCondition EB_BoundryCondition { get; set; }
     public int? EB_BoundryConditionId { get; set; }

     public int Type { get; set; }

     public List<EB_AnswerElement> AnswerElements { get; set; }
            = new List<EB_AnswerElement>();
    }

    public enum EB_ANSWER_TYPE
    {
        CONDUCTION = 0,

        CONVECTION = 2,

        SOURCES = 4
    }
}
