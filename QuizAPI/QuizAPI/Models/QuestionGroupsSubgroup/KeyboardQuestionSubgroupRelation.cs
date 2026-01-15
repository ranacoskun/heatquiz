using QuizAPI.Models.Questions.KeyboardQuestion;
using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionGroupsSubgroup
{
    public class KeyboardQuestionSubgroupRelation : BaseEntity
    {
        public QuestionSubgroup Subgroup { get; set; }
        public int SubgroupId { get; set; }

        public KeyboardQuestion Question { get; set; }

        public int QuestionId { get; set; }
    }
}
