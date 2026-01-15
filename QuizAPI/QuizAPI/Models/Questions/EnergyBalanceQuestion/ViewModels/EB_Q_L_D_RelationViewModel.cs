using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion.ViewModels
{
    public class EB_Q_L_D_RelationViewModel : BaseEntityViewModel
    {
        public EB_QuestionViewModel EB_Question { get; set; }

        public int EB_QuestionId { get; set; }

        public EB_LabelViewModel Label { get; set; }
        public int LabelId { get; set; }

        public int Direction { get; set; }

        public bool Correct { get; set; }
        public bool IsDummy { get; set; }


    }
}
