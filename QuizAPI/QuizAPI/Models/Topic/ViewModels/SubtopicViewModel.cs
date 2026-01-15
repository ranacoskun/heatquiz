using QuizAPI.Models.Questions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Topic.ViewModels
{
    public class SubtopicViewModel : BaseEntityViewModel
    {
        public string Name { get; set; }
        public bool Active { get; set; }

        public int TopicId { get; set; }
        public TopicViewModel Topic { get; set; }

        public List<QuestionBaseViewModel> Questions { get; set; } = new List<QuestionBaseViewModel>();

    }
}
