using QuizAPI.Models.DefaultValues.Keyboard.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.KeyboardQuestion.ViewModels
{
    public class KeyboardQuestionViewModel : QuestionBaseViewModel
    {
        //Answer For In Latex
        public string AnswerForLatex { get; set; }
        public string Latex { get; set; }

        public string AdditionalInfo { get; set; }

        public bool IsEnergyBalance {get;set;}
        public bool? DisableDevision { get; set; }

        public int LatexWidth { get; set; }
        public int LatexHeight { get; set; }
        //Image
        public string ImageURL { get; set; }
        public long ImageSize { get; set; }

        //Keyboard
        public KeyboardViewModel Keyboard { get; set; }
        public int KeyboardId { get; set; }

        //Answers
        public List<KeyboardQuestionAnswerViewModel> Answers { get; set; }
        = new List<KeyboardQuestionAnswerViewModel>();

        public List<KeyboardQuestionAnswerStatistic> AnswerStatistics { get; set; }
        = new List<KeyboardQuestionAnswerStatistic>();
    }
}
