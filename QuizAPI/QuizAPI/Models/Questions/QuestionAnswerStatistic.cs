using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions
{
    public class QuestionAnswerStatistic : BaseEntity
    {
        public QuestionBase Question { get; set; }
        public int QuestionId { get; set; }


    }
}
