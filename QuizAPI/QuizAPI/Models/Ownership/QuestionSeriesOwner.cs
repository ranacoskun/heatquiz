using QuizAPI.Models.Questions.QuestionSeries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Ownership
{
    public class QuestionSeriesOwner : BaseEntity
    {
        public QuestionSeries QuestionSeries { get; set; }
        public int QuestionSeriesId { get; set; }

        public BaseUser Owner { get; set; }
        public string OwnerId { get; set; }
    }
}
