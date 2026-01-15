using QuizAPI.Models.Questions.QuestionSeries.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireSeriesRelationViewModel : BaseEntityViewModel
    {
        public QuestionSeriesViewModel Series { get; set; }
        public int SeriesId { get; set; }

        public QuestionnaireViewModel Questionnaire { get; set; }
        public int QuestionnaireId { get; set; }

        public bool IsRepeatable { get; set; }
    }
}
