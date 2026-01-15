using QuizAPI.Models.Ownership;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Topic
{
    public class Topic : BaseEntity
    {
        public string Name { get; set; }

        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        public bool Active { get; set; }

        //Subtopics
        public List<Subtopic> Subtopics { get; set; } = new List<Subtopic>();

        public List<TopicOwner> Owners { get; set; } = new List<TopicOwner>();

    }
}
