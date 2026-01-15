using QuizAPI.Models.DefaultValues.Keyboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class EB_AnswerElement : BaseEntity
    {
        public KeyboardNumericKeyRelation NumericKey { get; set; }
        public int? NumericKeyId { get; set; }

        public KeyboardVariableKeyImageRelation Image { get; set; }
        public int? ImageId { get; set; }

        public string Value { get; set; }

        public EB_Answer Answer { get; set; }
        public int AnswerId { get; set; }
    }
}
