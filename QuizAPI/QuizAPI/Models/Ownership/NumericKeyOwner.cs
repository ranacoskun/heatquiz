using QuizAPI.Models.DefaultValues.Keyboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Ownership
{
    public class NumericKeyOwner : BaseEntity
    {
        public KeyboardNumericKey Key { get; set; }
        public int KeyId { get; set; }

        public BaseUser Owner { get; set; }
        public string OwnerId { get; set; }
    }
}
