using QuizAPI.Models.DefaultValues.Keyboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class EB_Question : BaseEntity
    {

        public EnergyBalanceQuestion Question { get; set; }
        public int QuestionId { get; set; }

        public string Code { get; set; }

        public string Latex { get; set; }

        public bool? Ingoing { get; set; }

        

        public Keyboard Keyboard { get; set; }
        public int? KeyboardId { get; set; }

        public List<EB_Answer> Answers { get; set; } = new List<EB_Answer>();



    }
}
