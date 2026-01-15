using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class KeysListViewModel : BaseEntityViewModel
    {
        public string Code { get; set; }

        public bool IsDefault { get; set; }

        public string AddedByName { get; set; }

        public List<KeyboardNumericKeyViewModel> NumericKeys { get; set; } = new List<KeyboardNumericKeyViewModel>();

        public List<KeyboardVariableKeyViewModel> VariableKeys { get; set; } = new List<KeyboardVariableKeyViewModel>();
    }
}
