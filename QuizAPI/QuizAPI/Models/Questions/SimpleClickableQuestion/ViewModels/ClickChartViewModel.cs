using QuizAPI.Models.DefaultValues.InterpretedImages.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels
{
    public class ClickChartViewModel : ClickablePartViewModel
    {
        public InterpretedImageViewModel Answer { get; set; }
        public int AnswerId { get; set; }

        public InterpretedImageGroupViewModel AnswerGroup { get; set; }
        public int AnswerGroupId { get; set; }


    }
}
