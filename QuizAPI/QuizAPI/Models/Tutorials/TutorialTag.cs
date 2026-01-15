using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Tutorials
{
    public class TutorialTag : BaseEntity
    {
        public string Tag { get; set; }

        //Tutorial
        public Tutorial Tutorial { get; set; }
        public int TutorialId { get; set; }
    }
}
