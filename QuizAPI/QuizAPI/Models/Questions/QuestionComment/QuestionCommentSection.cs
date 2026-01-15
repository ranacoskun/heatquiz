using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionComment
{
    public class QuestionCommentSection : BaseEntity
    {
        public QuestionBase Question { get; set; }
        public int QuestionId { get; set; }

        public List<QuestionCommentSectionTag> Tages { get; set; } = new List<QuestionCommentSectionTag>();

        public List<QuestionComment> Comments { get; set; } = new List<QuestionComment>();


    }
}
