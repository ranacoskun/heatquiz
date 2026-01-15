using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class VariableKeyVariableCharValidValuesGroupChoiceImageViewModel : BaseEntityViewModel
    {
        public string URL { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        [Required]
        public string TextPresentation { get; set; }

        public int AnswerElements { get; set; }

        public int KeyId { get; set; }

        public string KeySimpleForm { get; set; } // example A, B, C, D .... etc in the Keybaord 


    }
}
