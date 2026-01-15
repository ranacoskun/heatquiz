using QuizAPI.Models.Course;
using QuizAPI.Models.DefaultValues.SeriesButtonImage;
using QuizAPI.Models.Ownership;
using QuizAPI.Models.Questionnaire;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionSeries
{
    public class QuestionSeries : BaseEntity
    {
        public string Code { get; set; }

        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        public bool IsRandom { get; set; }
        public int RandomSize { get; set; }

        public SeriesButtonImage ButtonImages { get; set; }
        public int? ButtonImagesId { get; set; }

        public QuestionnaireSeriesRelation QuestionnaireRelation { get; set; }
        public int? QuestionnaireRelationId { get; set; }

        public List<QuestionSeriesElement> Elements { get; set; } = new List<QuestionSeriesElement>();

        public List<QuestionSeriesOwner> Owners { get; set; } = new List<QuestionSeriesOwner>();

        public List<CourseMapElement> MapElements { get; set; } = new List<CourseMapElement>(); 
        public List<QuestionSeriesStatistic> Statistics { get; set; } = new List<QuestionSeriesStatistic>(); 

        public int NumberOfPools { get; set; }

    }
}
