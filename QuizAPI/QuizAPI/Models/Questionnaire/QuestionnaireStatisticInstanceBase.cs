using QuizAPI.Models.Course;
using QuizAPI.Models.Questions.QuestionSeries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireStatisticInstanceBase : BaseEntity
    {
        public Questionnaire Questionnaire { get; set; }
        public int QuestionnaireId { get; set; }

        public string Player { get; set; }
        public string Key { get; set; }

        public int TotalTime { get; set; }

        public List<QuestionnaireStatisticInstance> Instances { get; set; } = new List<QuestionnaireStatisticInstance>();

        public QuestionSeries Series { get; set; }
        public int? SeriesId { get; set; }

        public CourseMapElement MapElement { get; set; }
        public int? MapElementId { get; set; }

        public int RemovedQuestionsCount { get; set; }

    }
}
