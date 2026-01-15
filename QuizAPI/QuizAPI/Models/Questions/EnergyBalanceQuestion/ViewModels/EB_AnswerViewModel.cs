using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion.ViewModels
{
    public class EB_AnswerViewModel : BaseEntityViewModel
    {
        public int Type { get; set; }

        public List<EB_AnswerElementViewModel> AnswerElements { get; set; }
            = new List<EB_AnswerElementViewModel>();
    }
}
