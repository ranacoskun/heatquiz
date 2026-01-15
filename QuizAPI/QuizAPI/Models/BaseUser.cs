using Microsoft.AspNetCore.Identity;
using QuizAPI.Models.Course;
using QuizAPI.Models.Ownership;
using QuizAPI.Models.Ownership.ClickTrees;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class BaseUser : IdentityUser
    {
        public string Name { get; set; }

        public DateTime RegisteredOn { get; set; }

        public bool Active { get; set; }

        public string ProfilePicture { get; set; }

        //Click Tree
        public List<ClickTreeOwner> OwnedClickTree { get; set; } = new List<ClickTreeOwner>();
        
        public List<InterpretedTreeOwner> OwnedInterprtedTree { get; set; } = new List<InterpretedTreeOwner>();
        
        public List<KeyboardOwner> OwnedKeyboards { get; set; } = new List<KeyboardOwner>();
        
        public List<NumericKeyOwner> OwnedNumericKeys { get; set; } = new List<NumericKeyOwner>();
        public List<VariableKeyOwner> OwnedVariableKeys { get; set; } = new List<VariableKeyOwner>();
        
        public List<QuestionOwner> OwnedQuestions { get; set; } = new List<QuestionOwner>();
        
        public List<CourseOwner> OwnedCourses { get; set; } = new List<CourseOwner>();
        public List<TopicOwner> OwnedTopics { get; set; } = new List<TopicOwner>();

        public List<UserLinkedPlayerKey> LinkedKeys = new List<UserLinkedPlayerKey>();

        public List<DatapoolNotificationSubscription> notificationSubscriptions = new List<DatapoolNotificationSubscription>();

    }
}
