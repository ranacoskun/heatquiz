using QuizAPI.Models.DefaultValues.Keyboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class EnergyBalanceQuestion : QuestionBase
    {
        public string EBLatex { get; set; }
        public string EBFLatex { get; set; }

        public int? ArrowRadius { get; set; }

        public bool? ShowBorders { get; set; }
        public List<EB_ClickablePart> ClickableParts { get; set; } = new List<EB_ClickablePart>();
        public List<EB_Question> Questions { get; set; } = new List<EB_Question>();

        public List<EB_Label> Labels { get; set; } = new List<EB_Label>();

        public Keyboard BoundryConditionKeyboard { get; set; }
        public int? BoundryConditionKeyboardId { get; set; }

        public List<EB_BoundryCondition> BoundryConditions { get; set; } = new List<EB_BoundryCondition>();

    }
}
