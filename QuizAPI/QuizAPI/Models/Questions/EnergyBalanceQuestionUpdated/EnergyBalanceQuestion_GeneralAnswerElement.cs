using QuizAPI.Models.DefaultValues.Keyboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated
{
    public class EnergyBalanceQuestion_GeneralAnswerElement : BaseEntity
    {
        public KeyboardNumericKeyRelation NumericKey { get; set; }
        public int? NumericKeyId { get; set; }

        public KeyboardVariableKeyImageRelation Image { get; set; }
        public int? ImageId { get; set; }

        public string Value { get; set; }

        public EnergyBalanceQuestion_GeneralAnswer Answer { get; set; }
        public int AnswerId { get; set; }
    }
}
