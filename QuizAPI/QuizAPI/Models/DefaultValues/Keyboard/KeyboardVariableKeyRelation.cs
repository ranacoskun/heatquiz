using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class KeyboardVariableKeyRelation : BaseEntity
    {
        public Keyboard Keyboard { get; set; }
        public int KeyboardId { get; set; }

        public int Order { get; set; }

        public KeyboardVariableKey VariableKey { get; set; }
        public int VariableKeyId { get; set; }

        public string KeySimpleForm { get; set; } // example A, B, C, D .... etc in the Keybaord 
                                                  // for simplicity of evaluation in Keyboard Questions
    }
}
