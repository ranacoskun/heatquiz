using QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionGroupsSubgroup.ViewModels
{
    public class ClickableQuestionSubgroupRelationViewModel : BaseEntityViewModel
    {
        public QuestionSubgroupViewModel Subgroup { get; set; }
        public int SubgroupId { get; set; }

        public SimpleClickableQuestionViewModel Question { get; set; }
        public int QuestionId { get; set; }
    }
}
