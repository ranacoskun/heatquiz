using QuizAPI.Models.DefaultValues.Keyboard.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion.ViewModels
{
    public class EB_QuestionViewModel : BaseEntityViewModel
    {
        public string Code { get; set; }
        public string Latex { get; set; }

        public KeyboardViewModel Keyboard { get; set; }
        public int? KeyboardId { get; set; }
        public bool? Ingoing { get; set; }

        public List<EB_AnswerViewModel> Answers { get; set; } = new List<EB_AnswerViewModel>();
    }
}
