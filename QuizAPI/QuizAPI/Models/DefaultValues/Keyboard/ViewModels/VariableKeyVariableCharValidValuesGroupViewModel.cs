using QuizAPI.Models.DefaultValues.Keyboard.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class VariableKeyVariableCharValidValuesGroupViewModel : BaseEntityViewModel
    {
        public string Code { get; set; }

        //Valid Values
        /*public List<VariableKeyVariableCharValidValuesViewModel> ValidValues { get; set; }
         = new List<VariableKeyVariableCharValidValuesViewModel>();*/

        //Valid Values
        public List<string> Images { get; set; }
         = new List<string>();


    }
}
