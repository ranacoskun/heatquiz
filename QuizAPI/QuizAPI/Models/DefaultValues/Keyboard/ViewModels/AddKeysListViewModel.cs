using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.Keyboard.ViewModels
{
    public class AddKeysListViewModel
    {
        public int Id { get; set; }
        
        public string Code { get; set; }

        public List<int> NumericKeys = new List<int>();

        public List<int> VariableKeys = new List<int>();

        public int DataPoolId { get; set; }

    }
}
