using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Ownership
{
    public class TopicOwner : BaseEntity
    {
        public Topic.Topic Topic { get; set; }
        public int TopicId { get; set; }

        public BaseUser Owner { get; set; }
        public string OwnerId { get; set; }
    }
}
