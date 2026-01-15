using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionComment
{
    public class QuestionCommentViewModel : BaseEntityViewModel
    {
        public QuestionCommentSectionViewModel CommentSection { get; set; }
        public int CommentSectionId { get; set; }

        public string Text { get; set; }
        public bool IsLatex { get; set; }

        public string AddedByName { get; set; }
        public string AddedByProfilePicture { get; set; }

        public List<QuestionCommentTagViewModel> Tages { get; set; } = new List<QuestionCommentTagViewModel>();
    }
}
