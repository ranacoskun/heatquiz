using QuizAPI.Models.Ownership.ViewModels;
using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class KeyboardListAdvancedViewModel : BaseEntityViewModel
    {
        [Required]
        public string Name { get; set; }
        public string AddedByName { get; set; }
        public int KeysPerRow { get; set; }

        //Numeric Keys
        public List<KeyboardNumericKeyRelationViewModeL> NumericKeys { get; set; }
        = new List<KeyboardNumericKeyRelationViewModeL>();

        //Variable Keys
        public List<KeyboardVariableKeyRelationViewModel> VariableKeys { get; set; }
        = new List<KeyboardVariableKeyRelationViewModel>();

        public List<KeyboardVariableKeyImageRelationViewModel> VariableKeyImages { get; set; }
       = new List<KeyboardVariableKeyImageRelationViewModel>();

        public List<OwnerInfoViewModel> Owners { get; set; } = new List<OwnerInfoViewModel>();

        public List<KeyboardQuestionKeyboardListViewModel> KeyboardQuestions { get; set; }
            = new List<KeyboardQuestionKeyboardListViewModel>();

    }
}
