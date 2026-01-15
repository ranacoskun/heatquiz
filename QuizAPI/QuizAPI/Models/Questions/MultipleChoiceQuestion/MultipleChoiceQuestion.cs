using QuizAPI.Models.Questions.QuestionSeries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.MultipleChoiceQuestion
{
    public class MultipleChoiceQuestion : QuestionBase
    {
        public int ChoicesPerRow { get; set; }

        //Answer For In Latex
        public string AnswerForLatex { get; set; }
        public string Latex { get; set; }

        public string AdditionalInfo { get; set; }

        public bool IsEnergyBalance { get; set; }

        public int LatexWidth { get; set; }
        public int LatexHeight { get; set; }

        //Image
        public string ImageURL { get; set; }
        public long ImageSize { get; set; }

        //
        public List<MultipleChoiceQuestionChoice> Choices { get; set; } = new List<MultipleChoiceQuestionChoice>();

        public List<QuestionSeriesElement> SeriesElements { get; set; } = new List<QuestionSeriesElement>();

    }
}
