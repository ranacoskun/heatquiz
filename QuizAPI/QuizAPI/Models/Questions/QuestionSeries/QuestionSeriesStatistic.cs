using QuizAPI.Models.Course;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionSeries
{
    public class QuestionSeriesStatistic : BaseEntity
    {
        public QuestionSeries Series { get; set; }
        public int SeriesId { get; set; }

        public string Player { get; set; }
        public string MapKey { get; set; }

        public string MapName { get; set; }
        public string MapElementName { get; set; }

        public string SuccessRate { get; set; }

        public int TotalTime { get; set; }
        public bool OnMobile { get; set; }
    }
}
