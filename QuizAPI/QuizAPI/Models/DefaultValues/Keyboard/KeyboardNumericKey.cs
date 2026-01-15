using QuizAPI.Models.Ownership;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard
{
    public class KeyboardNumericKey : BaseEntity
    {

        public string Code { get; set; }

        public string TextPresentation { get; set; }

        public bool IsInteger { get; set; }

        public string URL { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }


        //Relations
        public List<KeyboardNumericKeyRelation> Relations { get; set; }
        = new List<KeyboardNumericKeyRelation>();

        public List<NumericKeyOwner> Owners { get; set; } = new List<NumericKeyOwner>();

        public KeysList KeysList { get; set; }
        public int? KeysListId { get; set; }

    }
}
