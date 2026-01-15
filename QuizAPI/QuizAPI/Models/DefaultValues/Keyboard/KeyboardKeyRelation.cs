using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class KeyboardKeyRelation : BaseEntity
    {
        public Keyboard Keyboard { get; set; }
        public int KeyboardId { get; set; }

        public int Order { get; set; }
    }
}
