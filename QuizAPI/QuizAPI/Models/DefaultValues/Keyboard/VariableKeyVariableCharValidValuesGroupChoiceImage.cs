using QuizAPI.Models.Questions.KeyboardQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class VariableKeyVariableCharValidValuesGroupChoiceImage : BaseEntity
    {
       // public VariableKeyVariableCharValidValuesGroup Group { get; set; }
       // public int GroupId { get; set; }

        public KeyboardVariableKey Key { get; set; }
        public int KeyId { get; set; }

        public string URL { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        public string TextPresentation { get; set; }

        public List<KeyboardQuestionAnswerElement> AnswerElements { get; set; } = new List<KeyboardQuestionAnswerElement>();

    }
}
