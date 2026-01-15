using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions
{
    public class ApproveQuestionViewModel
    {
        public int QuestionId { get; set; }

        public bool Approve { get; set; }

    }
}
