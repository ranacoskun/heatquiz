using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class KeysListSearchViewModel
    {
        public string Code { get; set; }

        public int Page { get; set; }
        public int QperPage { get; set; }

        public int? ListId { get; set; }

        public bool GetNumeric { get; set; }

        public bool Assigned { get; set; }

        public int DataPoolId { get; set; }
    }
}
