using QuizAPI.Models.Questions.KeyboardQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class KeyboardVariableKeyImageRelation : BaseEntity
    {
        public VariableKeyVariableCharValidValuesGroupChoiceImage Image { get; set; }
        public int ImageId { get; set; }

        public Keyboard Keyboard { get; set; }
        public int KeyboardId { get; set; }
    
        public string ReplacementCharacter { get; set; }

        public List<KeyboardQuestionAnswerElement> AnswerElements { get; set; } = new List<KeyboardQuestionAnswerElement>();

    }
}
