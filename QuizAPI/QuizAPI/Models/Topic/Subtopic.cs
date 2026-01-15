using QuizAPI.Models.Questions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Topic
{
    public class Subtopic : BaseEntity
    {
        public string Name { get; set; }

        public bool Active { get; set; }

        public Topic Topic { get; set; }
        public int TopicId { get; set; }

        //Questions 
        public List<QuestionBase> Questions { get; set; } = new List<QuestionBase>();
    }
}
