using QuizAPI.Models.DefaultValues.LevelsOfDifficulty;
using QuizAPI.Models.Ownership.ViewModels;
using QuizAPI.Models.QuestionGroupsSubgroup.ViewModels;
using QuizAPI.Models.Questions.QuestionComment;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions
{
    public class QuestionBaseCommentsViewModel : BaseEntityViewModel
    {
        public int Type { get; set; }

        [Required]
        public string Code { get; set; }

        //Added By
        public string AddedByName { get; set; }
        public string EditedByName { get; set; }

        public QuestionCommentSectionViewModel CommentSection { get; set; }
        public int CommentSectionId { get; set; }


    }
}
