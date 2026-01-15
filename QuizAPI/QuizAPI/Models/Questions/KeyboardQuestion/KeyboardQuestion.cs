using QuizAPI.Models.DefaultValues.Keyboard;
using QuizAPI.Models.Questions.QuestionSeries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.KeyboardQuestion
{
    public class KeyboardQuestion : QuestionBase
    {
        //Answer For In Latex
        public string AnswerForLatex { get; set; }
        public string Latex { get; set; }

        public string AdditionalInfo { get; set; }

        public bool IsEnergyBalance { get; set; }

        public bool? DisableDevision { get; set; }

        public int LatexWidth { get; set; }
        public int LatexHeight { get; set; }

        //Image
        public string ImageURL { get; set; }
        public long ImageSize { get; set; }

        //Keyboard
        public Keyboard Keyboard { get; set; }
        public int KeyboardId { get; set; }

        //Answers
        public List<KeyboardQuestionAnswer> Answers { get; set; }
        = new List<KeyboardQuestionAnswer>();

        public List<QuestionSeriesElement> SeriesElements { get; set; } = new List<QuestionSeriesElement>();

        public List<KeyboardQuestionAnswerStatistic> AnswerStatistics { get; set; }
        = new List<KeyboardQuestionAnswerStatistic>();


    }
}
