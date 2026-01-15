using QuizAPI.Models.DefaultValues.InterpretedImages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.SimpleClickableQuestion
{
    public class ClickChart : ClickablePart
    {
        public InterpretedImage Answer { get; set; }
        public int AnswerId { get; set; }

        public InterpretedImageGroup AnswerGroup { get; set; }
        public int AnswerGroupId { get; set; }
        //Question
        public SimpleClickableQuestion Question { get; set; }
        public int QuestionId { get; set; }
    }
}
