using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Tutorials.ViewModels
{
    public class QueryTutorialsViewModel
    {
        public int GroupId { get; set; }

        public string Name { get; set; }

        public List<string> Tags { get; set; }

        public int Reviews { get; set; }

        public string Publisher { get; set; }


    }
}
