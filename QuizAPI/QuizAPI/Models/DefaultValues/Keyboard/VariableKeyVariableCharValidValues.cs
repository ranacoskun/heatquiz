using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class VariableKeyVariableCharValidValues : BaseEntity
    {
        public VariableKeyVariableCharValidValuesGroup Group { get; set; }
        public int GroupId { get; set; }
        
        //Value
        public string Value { get; set; }

        public bool IsLatex { get; set; }
    }
}
