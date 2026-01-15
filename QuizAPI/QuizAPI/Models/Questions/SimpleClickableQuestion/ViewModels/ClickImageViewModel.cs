using QuizAPI.Models.DefaultValues.ImageAnswers.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels
{
    public class ClickImageViewModel : ClickablePartViewModel
    {
        //Answer
        public ImageAnswerViewModel Answer { get; set; }
        public int AnswerId { get; set; }

        //Group
        public ImageAnswerGroupViewModel AnswerGroup { get; set; }
        public int AnswerGroupId { get; set; }

        //Question
        /*public SimpleClickableQuestionViewModel Question { get; set; }*/
        public int QuestionId { get; set; }

    }
}
