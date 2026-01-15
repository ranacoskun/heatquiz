using QuizAPI.Models.DefaultValues.Keyboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Ownership
{
    public class KeyboardOwner : BaseEntity
    {
        public Keyboard Keyboard { get; set; }
        public int KeyboardId { get; set; }

        public BaseUser Owner { get; set; }
        public string OwnerId { get; set; }
    }
}
