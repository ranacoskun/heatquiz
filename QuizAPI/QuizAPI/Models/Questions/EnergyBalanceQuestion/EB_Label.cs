using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class EB_Label : BaseEntity
    {
        public EnergyBalanceQuestion Question { get; set; }
        public int QuestionId { get; set; }

        public string Name { get; set; }
    }
}
