using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionComment
{
    public class QuestionCommentSectionTag : BaseEntity
    {
        public QuestionCommentSection Section { get; set; }
        public int SectionId { get; set; }

        public BaseUser User { get; set; }
        public string UserId { get; set; }  

        public DateTime? LastSeen { get; set; }
    }
}
