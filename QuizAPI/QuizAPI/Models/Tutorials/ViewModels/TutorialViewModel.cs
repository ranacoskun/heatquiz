using QuizAPI.Models.Topic.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Tutorials.ViewModels
{
    public class TutorialViewModel : BaseEntityViewModel
    {
        public string Name { get; set; }

        public string AddedBy { get; set; }

        //Group
        public SubtopicViewModel Subtopic { get; set; }
        public int SubtopicId { get; set; }

        //Thumbnail
        public string URL { get; set; }
        public long Size { get; set; }

        //Tags
        public List<string> Tags { get; set; }
        = new List<string>();

        //PDF
        //PDF
        public List<TutorialPDFViewModel> PDFs { get; set; } = new List<TutorialPDFViewModel>();

        //Video
        public List<TutorialVideoViewModel> Videos { get; set; } = new List<TutorialVideoViewModel>();

        //Steps
        public List<TutorialStepViewModel> TutorialSteps { get; set; }
        = new List<TutorialStepViewModel>();
    }
}
