using QuizAPI.Models.Questions.SimpleClickableQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionGroupsSubgroup
{
    public class ClickableQuestionSubgroupRelation : BaseEntity
    {
        public QuestionSubgroup Subgroup { get; set; }
        public int SubgroupId { get; set; }

        public SimpleClickableQuestion Question { get; set; }
        public int QuestionId { get; set; }
    }
}
