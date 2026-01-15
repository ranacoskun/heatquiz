using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated.ViewModels
{
    public class EnergyBalanceQuestion_GeneralAnswerViewModel : BaseEntityViewModel
    {
        public List<EnergyBalanceQuestion_GeneralAnswerElementViewModel> AnswerElements { get; set; }
            = new List<EnergyBalanceQuestion_GeneralAnswerElementViewModel>();

        public EnergyBalanceQuestion_EBTerm_QuestionViewModel Question { get; set; }
        public int? QuestionId { get; set; }

        public string Comment { get; set; }
    }
}
