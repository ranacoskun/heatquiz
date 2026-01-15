using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.KeyboardQuestion
{
    public class KeyboardQuestionAnswer : BaseEntity
    {
        //public string TextAnswer { get; set; }
        //public string ImageIdsAnswer { get; set; }

        public KeyboardQuestion Question { get; set; }
        public int QuestionId { get; set; }

        public List<KeyboardQuestionAnswerElement> AnswerElements { get; set; } 
            = new List<KeyboardQuestionAnswerElement>();
    }
}
