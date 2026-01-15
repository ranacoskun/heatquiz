using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Information.ViewModels
{
    public class InformationSearchViewModel
    {
        public string Code { get; set; }
        public int Page { get; set; }
        public int QperPage { get; set; }

        public int NumberOfSeries { get; set; }

        public int InformationId { get; set; }

        public bool Assigned { get; set; }

        public int DataPoolId { get; set; }
    }
}
