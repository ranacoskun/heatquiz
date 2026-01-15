using QuizAPI.Models.Ownership;
using QuizAPI.Models.Questions.KeyboardQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class Keyboard : BaseEntity
    {
        public string Name { get; set; }

        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        //Numeric Keys
        public List<KeyboardNumericKeyRelation> NumericKeys { get; set; }
        = new List<KeyboardNumericKeyRelation>();

        //Variable Keys
        public List<KeyboardVariableKeyRelation> VariableKeys { get; set; }
        = new List<KeyboardVariableKeyRelation>();

        public List<KeyboardVariableKeyImageRelation> VariableKeyImages { get; set; }
       = new List<KeyboardVariableKeyImageRelation>();

        public List<KeyboardOwner> Owners { get; set; } = new List<KeyboardOwner>();

        public int KeysPerRow { get; set; }

        public List<KeyboardQuestion> KeyboardQuestions { get; set; } = new List<KeyboardQuestion>();

    }
}
