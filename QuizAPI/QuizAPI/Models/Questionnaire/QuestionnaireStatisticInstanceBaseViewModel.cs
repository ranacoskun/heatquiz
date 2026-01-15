using QuizAPI.Models.Course.ViewModels;
using QuizAPI.Models.Questions.QuestionSeries.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireStatisticInstanceBaseViewModel : BaseEntityViewModel
    {
        public int QuestionnaireId { get; set; }

        public string Player { get; set; }
        public string Key { get; set; }
        public int TotalTime { get; set; }

        public List<QuestionnaireStatisticInstanceViewModel> Instances { get; set; } = new List<QuestionnaireStatisticInstanceViewModel>();

        public QuestionSeriesViewModel Series { get; set; }
        public int? SeriesId { get; set; }

        public CourseMapElementViewModel MapElement { get; set; }
        public int? MapElementId { get; set; }

        public int RemovedQuestionsCount { get; set; }
    }
}
