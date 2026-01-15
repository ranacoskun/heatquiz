using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class VariableKeyVariableChar : BaseEntity
    {
        //Key Relation
        public KeyboardVariableKey Key { get; set; }
        public int KeyId { get; set; }

        public string VariableChar { get; set; }
        //Valid Values
    }
}
