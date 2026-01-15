using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionComment
{
    public class GetCommentsViewModel
    {
        public string From { get; set; }

        public string To { get; set; }

        public bool GetUnseen { get; set; }
    }
}
