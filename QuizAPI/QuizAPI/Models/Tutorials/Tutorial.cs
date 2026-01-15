using QuizAPI.Models.Topic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Tutorials
{
    public class Tutorial : BaseEntity
    {
        public string Name { get; set; }

        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        //Group
        public Subtopic Subtopic { get; set; }
        public int SubtopicId { get; set; }

        //Thumbnail
        public string URL { get; set; }
        public long Size { get; set; }

        //Tags
        public List<TutorialTag> Tags { get; set; }
        = new List<TutorialTag>();

        public int Reviews { get; set; }

        //PDF
        public List<TutorialPDF> PDFs { get; set; } = new List<TutorialPDF>();

        //Video
        public List<TutorialVideo> Videos { get; set; } = new List<TutorialVideo>();

        //Steps
        public List<TutorialStep> TutorialSteps { get; set; }
        = new List<TutorialStep>();


    }
}
