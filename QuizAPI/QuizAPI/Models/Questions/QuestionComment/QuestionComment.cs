using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionComment
{
    public class QuestionComment : BaseEntity
    {
        public QuestionCommentSection CommentSection { get; set; }
        public int CommentSectionId { get; set; }

        public string Text { get; set; }
        public bool IsLatex { get; set; }

        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        public List<QuestionCommentTag> Tages { get; set; }  = new List<QuestionCommentTag>();
    }
}
