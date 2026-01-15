using QuizAPI.Models.Questions.QuestionSeries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireSeriesRelation : BaseEntity
    {
        public QuestionSeries Series { get; set; }
        public int SeriesId { get; set; }

        public Questionnaire Questionnaire { get; set; }
        public int QuestionnaireId { get; set; }

        public bool IsRepeatable { get; set; }
    }
}
