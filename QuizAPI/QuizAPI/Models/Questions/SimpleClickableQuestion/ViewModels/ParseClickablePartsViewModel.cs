using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels
{
    public class ParseClickablePartsViewModel
    {
        //Clickable Images
        public List<ClickImageViewModel> ClickImages { get; set; }
        = new List<ClickImageViewModel>();

        //Clickable Charts
        public List<ClickChartViewModel> ClickCharts { get; set; }
        = new List<ClickChartViewModel>();
    }
}
