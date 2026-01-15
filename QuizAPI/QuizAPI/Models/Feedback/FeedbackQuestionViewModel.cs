using QuizAPI.Models.Questions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Feedback
{
    public class FeedbackQuestionViewModel : BaseEntityViewModel
    {
        public QuestionBaseViewModel Question { get; set; }
        public int QuestionId { get; set; }

        public string Player { get; set; }
        public string FeedbackContent { get; set; }

        public bool IsArchived { get; set; }

    }
}
