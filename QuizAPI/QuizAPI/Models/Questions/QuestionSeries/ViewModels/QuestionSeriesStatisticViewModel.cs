using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionSeries.ViewModels
{
    public class QuestionSeriesStatisticViewModel
    {
        public QuestionSeriesViewModel Series { get; set; }
        public int SeriesId { get; set; }

        public string Player { get; set; }
        public int TotalTime { get; set; }
        public bool OnMobile { get; set; }
    }

    
}
