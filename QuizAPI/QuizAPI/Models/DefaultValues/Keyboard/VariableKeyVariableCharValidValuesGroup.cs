using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class VariableKeyVariableCharValidValuesGroup : BaseEntity
    {
        //Key Relation
        //public VariableKeyVariableChar Char { get; set; }
        //public int CharId { get; set; }

        public string Code { get; set; }

        //Valid Values
        public List<VariableKeyVariableCharValidValues> ValidValues { get; set; }
         = new List<VariableKeyVariableCharValidValues>();

        //Valid Values
        public List<VariableKeyVariableCharValidValuesGroupChoiceImage> Images { get; set; }
         = new List<VariableKeyVariableCharValidValuesGroupChoiceImage>();
    }
}
