using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class KeyboardVariableKeyViewModel : BaseEntityViewModel
    {
        public string Code { get; set; }

        public string TextPresentation { get; set; }
        public string ImagePresentation { get; set; }

        public int Width { get; set; }
        public int Height { get; set; }

        public string KeySimpleForm { get; set; } // example A, B, C, D .... etc in the Keybaord 
                                                  // for simplicity of evaluation in Keyboard Questions

        //Variables 
        public List<VariableKeyVariableCharViewModel> VariablesChars { get; set; }
        = new List<VariableKeyVariableCharViewModel>();

        //Valid Values
        //public List<VariableKeyVariableCharValidValuesGroupViewModel> ValidValuesGroups { get; set; }
        //= new List<VariableKeyVariableCharValidValuesGroupViewModel>();

        public List<string> Images = new List<string>();

        public List<VariableKeyVariableCharValidValuesGroupChoiceImageViewModel> VImages =
            new List<VariableKeyVariableCharValidValuesGroupChoiceImageViewModel>();

        public int? KeysListId { get; set; }




    }
}
