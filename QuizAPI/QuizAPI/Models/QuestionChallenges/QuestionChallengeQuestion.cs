using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QuizAPI.Models.Questions.SimpleClickableQuestion;
using QuizAPI.Models.Questions.KeyboardQuestion;

namespace QuizAPI.Models.QuestionChallenges
{
    public class QuestionChallengeQuestion : BaseEntity
    {
        public int Order { get; set; }

        //Relation
        public QuestionChallengeTemplate ChallengeTemplate { get; set; }
        public int ChallengeTemplateId { get; set; }

        //Clickable Question 
        public SimpleClickableQuestion ClickableQuestion { get; set; }
        public int? ClickableQuestionId { get; set; }

        //Keyboard Question 
        public KeyboardQuestion KeyboardQuestion { get; set; }
        public int? KeyboardQuestionId { get; set; }
    }
}
