using QuizAPI.Models.Ownership;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class KeyboardVariableKey : BaseEntity
    {
        public string Code { get; set; }

        public string TextPresentation { get; set; }
        public string ImagePresentation { get; set; }

        public int Width { get; set; }
        public int Height { get; set; }

        //Variables 
        public List<VariableKeyVariableChar> VariablesChars { get; set; } = new List<VariableKeyVariableChar>();

        //Relations
        public List<KeyboardVariableKeyRelation> Relations { get; set; }
        = new List<KeyboardVariableKeyRelation>();


       /* public List<VariableKeyVariableCharValidValuesGroup> ValidValuesGroups { get; set; }
         = new List<VariableKeyVariableCharValidValuesGroup>();*/

        //Valid Values
        public List<VariableKeyVariableCharValidValuesGroupChoiceImage> Images { get; set; } = new List<VariableKeyVariableCharValidValuesGroupChoiceImage>();

        public List<VariableKeyOwner> Owners { get; set; } = new List<VariableKeyOwner>();

        public KeysList KeysList { get; set; }
        public int? KeysListId { get; set; }

    }
}
