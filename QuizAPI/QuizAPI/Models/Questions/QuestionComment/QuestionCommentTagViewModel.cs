using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionComment
{
    public class QuestionCommentTagViewModel : BaseEntityViewModel
    {
        public QuestionCommentViewModel Comment { get; set; }
        public int CommentId { get; set; }
        public string UserName { get; set; }
    }
}
