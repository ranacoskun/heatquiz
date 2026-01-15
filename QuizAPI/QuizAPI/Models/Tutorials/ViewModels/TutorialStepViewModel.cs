using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Tutorials.ViewModels
{
    public class TutorialStepViewModel : BaseEntityViewModel
    {
        public int Order { get; set; }

        //Tutorial
        public TutorialViewModel Tutorial { get; set; }
        public int TutorialId { get; set; }

        //Info
        public string Info { get; set; }

        //Image
        public string URL { get; set; }

        public long Size { get; set; }
    }
}
