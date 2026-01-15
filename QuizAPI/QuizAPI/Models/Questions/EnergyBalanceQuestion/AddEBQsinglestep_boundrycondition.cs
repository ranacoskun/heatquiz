using QuizAPI.Models.Questions.EnergyBalanceQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class AddEBQsinglestep_boundrycondition
    {
        public string Code { get; set; }

        public List<EB_AnswerViewModel> Answers { get; set; } = new List<EB_AnswerViewModel>();
    }
}
