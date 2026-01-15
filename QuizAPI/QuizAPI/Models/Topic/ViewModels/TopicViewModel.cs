using QuizAPI.Models.Ownership.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Topic.ViewModels
{
    public class TopicViewModel : BaseEntityViewModel
    {

        public string Name { get; set; }

        public string AddedByName { get; set; }

        public bool Active { get; set; }

        //Subtopics
        public List<SubtopicViewModel> Subtopics { get; set; } = new List<SubtopicViewModel>();

        public List<OwnerInfoViewModel> Owners { get; set; } = new List<OwnerInfoViewModel>();

    }
}
