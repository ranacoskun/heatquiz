using QuizAPI.Models.DefaultValues.Keyboard.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion.ViewModels
{
    public class EnergyBalanceQuestionViewModel : QuestionBaseViewModel
    {
        public string EBLatex { get; set; }

        public string EBFLatex { get; set; }

        public int? ArrowRadius { get; set; }

        public bool? ShowBorders { get; set; }

        public KeyboardViewModel BoundryConditionKeyboard { get; set; }
        public int? BoundryConditionKeyboardId { get; set; }

        public List<EB_BoundryConditionViewModel> BoundryConditions { get; set; } = new List<EB_BoundryConditionViewModel>();

        public List<EB_ClickablePartViewModel> ClickableParts { get; set; } = new List<EB_ClickablePartViewModel>();

        public List<EB_QuestionViewModel> Questions { get; set; } = new List<EB_QuestionViewModel>();

        public List<EB_LabelViewModel> Labels { get; set; } = new List<EB_LabelViewModel>();

    }
}
