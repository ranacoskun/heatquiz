using QuizAPI.Models.Course.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Tutorials.ViewModels
{
    public class TutorialsGroupViewModel : BaseEntityViewModel
    {
        public string Name { get; set; }

        //Tutorials
        public List<TutorialViewModel> Tutorials { get; set; }
        = new List<TutorialViewModel>();
    }
}
