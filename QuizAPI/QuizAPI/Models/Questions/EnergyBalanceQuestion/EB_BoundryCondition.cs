using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class EB_BoundryCondition : BaseEntity
    {
        public string Code { get; set; }
        public List<EB_Answer> Answers { get; set; } = new List<EB_Answer>();


    }
}
