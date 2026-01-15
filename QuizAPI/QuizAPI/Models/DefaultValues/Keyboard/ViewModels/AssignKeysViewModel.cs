using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class AssignKeysViewModel
    {
        public int KeyboardId { get; set; }

        public List<int> Keys { get; set; }
        = new List<int>();
    }
}
