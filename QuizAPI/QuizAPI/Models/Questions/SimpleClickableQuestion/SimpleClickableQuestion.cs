using QuizAPI.Models.QuestionGroupsSubgroup;
using QuizAPI.Models.Questions.QuestionSeries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.SimpleClickableQuestion
{
    public class SimpleClickableQuestion : QuestionBase
    {
        public string Latex { get; set; }

        //Background Image
        public string BackgroundImageURL { get; set; }
        public int BackgroundImageSize { get; set; }

        public int BackgroundImageWidth { get; set; }
        public int BackgroundImageHeight { get; set; }


        //Clickable Images
        public List<ClickImage> ClickImages { get; set; }
        = new List<ClickImage>();

        //Clickable Charts
        public List<ClickChart> ClickCharts { get; set; }
        = new List<ClickChart>();

        //Clickable Equations
        public List<ClickEquation> ClickEquations { get; set; }
        = new List<ClickEquation>();

        public List<ClickableQuestionSubgroupRelation> ClickableSubgroupRelations { get; set; } = new List<ClickableQuestionSubgroupRelation>();

        public List<QuestionSeriesElement> SeriesElements { get; set; } = new List<QuestionSeriesElement>();
    
    }
}
