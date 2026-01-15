using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionComment
{
    public class QuestionCommentTag : BaseEntity
    {
        public QuestionComment Comment { get; set; }
        public int CommentId { get; set; }

        public BaseUser User { get; set; }
        public string UserId { get; set; }
    }
}
