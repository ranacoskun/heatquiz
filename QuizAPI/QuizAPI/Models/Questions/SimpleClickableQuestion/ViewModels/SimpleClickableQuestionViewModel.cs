using System.Collections.Generic;

namespace QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels
{
    public class SimpleClickableQuestionViewModel : QuestionBaseViewModel
    {
        public string Latex { get; set; }

        //Background Image
        public string BackgroundImageURL { get; set; }
        public int BackgroundImageSize { get; set; }
        public int BackgroundImageWidth { get; set; }
        public int BackgroundImageHeight { get; set; }

        //Clickable Images
        public List<ClickImageViewModel> ClickImages { get; set; }
        = new List<ClickImageViewModel>();

        //Clickable Charts
        public List<ClickChartViewModel> ClickCharts { get; set; }
        = new List<ClickChartViewModel>();

        //Clickable Equations
        public List<ClickEquationViewModel> ClickEquations { get; set; }
        = new List<ClickEquationViewModel>();
    }
}