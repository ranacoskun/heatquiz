using QuizAPI.Models.Questions.KeyboardQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class KeyboardNumericKeyRelation : BaseEntity
    {
        public Keyboard Keyboard { get; set; }
        public int KeyboardId { get; set; }

        public int Order { get; set; }

        public KeyboardNumericKey NumericKey { get; set; }

        public int NumericKeyId { get; set; }

        public string KeySimpleForm { get; set; } // example A, B, C, D .... etc in the Keybaord 
                                                  // for simplicity of evaluation in Keyboard Questions

        public List<KeyboardQuestionAnswerElement> AnswerElements { get; set; } = new List<KeyboardQuestionAnswerElement>();
    }
}
