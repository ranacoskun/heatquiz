using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionGroupsSubgroup.ViewModels
{
    public class AssignQuestionsToSubgroupViewModel
    {
        public int SubgroupId { get; set; }

        public int? ClickableQuestionId { get; set; }

        public int? KeyboardQuestionId { get; set; }

        public List<int> ClickableQuestionIds { get; set; } = new List<int>();
        public List<int> KeyboardQuestionIds { get; set; } = new List<int>();

    }
}
