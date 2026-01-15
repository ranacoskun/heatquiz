using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class KeysList : BaseEntity
    {
        public string Code { get; set; }

        public bool IsDefault { get; set; }

        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        public List<KeyboardNumericKey> NumericKeys { get; set; } = new List<KeyboardNumericKey>();

        public List<KeyboardVariableKey> VariableKeys { get; set; } = new List<KeyboardVariableKey>();

    }
}
