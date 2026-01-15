using QuizAPI.Models.Ownership.ViewModels;
using QuizAPI.Models.QuestionGroupsSubgroup.ViewModels;
using QuizAPI.Models.Tutorials.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class CourseViewModel : BaseEntityViewModel
    {
        //Basic Properties
        public string Name { get; set; }

        public string Code { get; set; }

        //Thumbnail
        public string URL { get; set; }

        public long Size { get; set; }

        public string AddedByName { get; set; }


        //Question Groups
        public List<QuestionGroupViewModel> QuestionGroups { get; set; }
        = new List<QuestionGroupViewModel>();

        //Tutorial Groups
        public List<TutorialsGroupViewModel> TutorialsGroups { get; set; }
        = new List<TutorialsGroupViewModel>();

        public List<OwnerInfoViewModel> Owners { get; set; } = new List<OwnerInfoViewModel>();

        public List<CourseMapViewModel> CourseMaps { get; set; } = new List<CourseMapViewModel>();

        public int DataPoolId { get; set; }

    }
}
