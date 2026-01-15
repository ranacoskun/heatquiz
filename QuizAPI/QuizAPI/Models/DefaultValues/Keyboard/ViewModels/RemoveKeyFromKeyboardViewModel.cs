using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class RemoveKeyFromKeyboardViewModel
    {
        public int KeyboardId { get; set; }

        public int KeyId { get; set; }

        public bool IsNumeric { get; set; }
    }
}
