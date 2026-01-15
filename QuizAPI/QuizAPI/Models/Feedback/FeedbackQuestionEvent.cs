using QuizAPI.Models.Questions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Feedback
{
    public class FeedbackQuestionEvent : BaseEntity
    {
        public BaseUser EventHolder { get; set; }
        public string EventHolderId { get; set; }

        public QuestionBase Question { get; set; }
        public int QuestionId { get; set; }

        public int RecordsCount { get; set; }
    }
}
