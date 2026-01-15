using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionComment
{
    public class QuestionCommentSectionViewModel : BaseEntityViewModel
    {
        public QuestionBaseViewModel Question { get; set; }
        public int QuestionId { get; set; }

        public List<QuestionCommentSectionTagViewModel> Tages { get; set; } = new List<QuestionCommentSectionTagViewModel>();

        public List<QuestionCommentViewModel> Comments { get; set; } = new List<QuestionCommentViewModel>();


    }
}
