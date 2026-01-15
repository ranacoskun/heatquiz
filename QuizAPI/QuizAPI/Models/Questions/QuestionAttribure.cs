using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions
{
    public class QuestionAttribure : BaseEntity
    {
        public string Name { get; set; }

        //Question
        public QuestionBase QuestionBase { get; set; }
        public int QuestionBaseId { get; set; }
    }
}
