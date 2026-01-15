using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class KeyboardNumericKeyRelationViewModeL : BaseEntityViewModel
    {
        public int KeyboardId { get; set; }

        public KeyboardNumericKeyViewModel NumericKey { get; set; }

        public int NumericKeyId { get; set; }

        public string KeySimpleForm { get; set; } // example A, B, C, D .... etc in the Keybaord 
                                                  // for simplicity of evaluation in Keyboard Questions

        public int Order { get; set; }

        public List<KeyboardQuestionAnswerElementViewModel> AnswerElements { get; set; }
            = new List<KeyboardQuestionAnswerElementViewModel>();

    }
}
