using QuizAPI.Models.Questions.EnergyBalanceQuestion.ViewModels;
using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class AddEBQsinglestep_question
    {
        public string Code { get; set; }

        public string Latex { get; set; }

        public int KeyboardId { get; set; }
        public bool? Ingoing { get; set; }

        public List<EB_AnswerViewModel> Answers { get; set; } = new List<EB_AnswerViewModel>();

    }
}
