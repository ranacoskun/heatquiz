using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class KeyboardNumericKeyViewModel : BaseEntityViewModel
    {
        public string Code { get; set; }

        public string TextPresentation { get; set; }

        public bool IsInteger { get; set; }

        public string URL { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        public string KeySimpleForm { get; set; } // example A, B, C, D .... etc in the Keybaord 
                                                  // for simplicity of evaluation in Keyboard Questions

        public int? KeysListId { get; set; }

    }
}
