using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionGroupsSubgroup.ViewModels
{
    public class KeyboardQuestionSubgroupRelationViewModel
    {
        public QuestionSubgroupViewModel Subgroup { get; set; }
        public int SubgroupId { get; set; }

        public KeyboardQuestionViewModel Question { get; set; }

        public int QuestionId { get; set; }
    }
}
