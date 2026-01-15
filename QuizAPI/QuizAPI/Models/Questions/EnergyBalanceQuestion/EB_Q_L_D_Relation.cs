using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class EB_Q_L_D_Relation : BaseEntity
    {
        public EB_Question EB_Question{get;set;}

        public int? EB_QuestionId { get; set; }

        public EB_ClickablePart ClickablePart { get; set; }
        public int ClickablePartId { get; set; }

        public EB_Label Label { get; set; }
        public int LabelId { get; set; }

        public int Direction { get; set; }

        public bool Correct { get; set; }

        public bool IsDummy { get; set; }
    }

    public enum Q_L_D_RELATION_DIRECTION
    {
        NORTH = 0,
        SOUTH = 2,
        EAST = 4,
        WEST = 8,
        CENTER = 16,
    }
}
