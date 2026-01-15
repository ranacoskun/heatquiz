using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class KeyboardVariableKeyRelationViewModel : BaseEntityViewModel
    {
        public int KeyboardId { get; set; }
        public int Order { get; set; }

        public KeyboardVariableKeyViewModel VariableKey { get; set; }
        public int VariableKeyId { get; set; }

        public string KeySimpleForm { get; set; } // example A, B, C, D .... etc in the Keybaord 
                                                  // for simplicity of evaluation in Keyboard Questions
    }
}
