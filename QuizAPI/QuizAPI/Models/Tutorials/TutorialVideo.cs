using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Tutorials
{
    public class TutorialVideo : BaseEntity
    {
        public Tutorial Tutorial { get; set; }
        public int TutorialId { get; set; }

        public string Title { get; set; }

        public string Discription { get; set; }

        public string VideoURL { get; set; }
        public long VideoSize { get; set; }
    }
}
