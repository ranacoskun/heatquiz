using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Feedback
{
    public class FeedbackQuestionEventViewModel : BaseEntityViewModel
    {
        public string EventHolderName { get; set; }

        public int QuestionId { get; set; }

        public int RecordsCount { get; set; }
    }
}
