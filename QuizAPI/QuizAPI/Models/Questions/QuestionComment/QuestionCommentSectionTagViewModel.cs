using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionComment
{
    public class QuestionCommentSectionTagViewModel
    {
        public QuestionCommentSectionViewModel Section { get; set; }
        public int SectionId { get; set; }

        public string UserName { get; set; }
    }
}
