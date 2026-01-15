using QuizAPI.Models.Questions.KeyboardQuestion;
using QuizAPI.Models.Questions.SimpleClickableQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionGroupsSubgroup
{
    public class QuestionSubgroup : BaseEntity
    {
        public string Name { get; set; }

        //Group
        public QuestionGroup Group { get; set; }
        public int GroupId { get; set; }

        //Clickable Questions 
        public List<ClickableQuestionSubgroupRelation> ClickableSubgroupRelations { get; set; } = new List<ClickableQuestionSubgroupRelation>();
        public List<KeyboardQuestionSubgroupRelation> KeyboardSubgroupRelations { get; set; } = new List<KeyboardQuestionSubgroupRelation>();

        //Keyboard Questions
        //public List<KeyboardQuestionSubgroupRelation> KeyboardQuestionsRe { get; set; } = new List<KeyboardQuestionSubgroupRelation>();

    }
}
