using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class SwabKeyboardKeysViewModel
    {
        public int KeyboardId { get; set; }

        public int FirstKeyId { get; set; }

        public bool IsFirstNumeric { get; set; }

        public int SecondKeyId { get; set; }

        public bool IsSecondNumeric { get; set; }

    }
}
