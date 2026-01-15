using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class VariableKeyVariableCharValidValuesViewModel : BaseEntityViewModel
    {
        //Value
        public string Value { get; set; }

        public bool IsLatex { get; set; }
    }
}
