using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class GetKeyboardKeyRelationsViewModel
    {
        public int KeyRelationId { get; set; }
        public int KeyboardId { get; set; }
        public bool IsNumericKey { get; set; }
        
    }
}
