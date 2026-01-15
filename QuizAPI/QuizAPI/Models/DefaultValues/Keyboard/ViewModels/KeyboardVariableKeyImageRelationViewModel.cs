using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class KeyboardVariableKeyImageRelationViewModel : BaseEntityViewModel
    {
        public int ImageId { get; set; }

        public VariableKeyVariableCharValidValuesGroupChoiceImageViewModel Image { get; set; }

        public string ReplacementCharacter { get; set; }

        public List<KeyboardQuestionAnswerElementViewModel> AnswerElements { get; set; }
            = new List<KeyboardQuestionAnswerElementViewModel>();
    }
}
