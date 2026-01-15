using QuizAPI.Models.DefaultValues.ImageAnswers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.SimpleClickableQuestion
{
    public class ClickImage : ClickablePart
    {
        //Answer
        public ImageAnswer Answer { get; set; }
        public int AnswerId { get; set; }

        //Group
        public ImageAnswerGroup AnswerGroup { get; set; }
        public int AnswerGroupId { get; set; }

        //Question
        public SimpleClickableQuestion Question { get; set; }
        public int QuestionId { get; set; }

    }
}
