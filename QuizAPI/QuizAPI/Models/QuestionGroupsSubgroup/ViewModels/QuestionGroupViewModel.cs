using QuizAPI.Models.Course.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionGroupsSubgroup.ViewModels
{
    public class QuestionGroupViewModel : BaseEntityViewModel
    {
        public string Name { get; set; }

        //Thumbnail
        public string URL { get; set; }

        public long Size { get; set; }

        //Course Relation
        public CourseViewModel Course { get; set; }
        public int CourseId { get; set; }

        //Subgroups
        public List<QuestionSubgroupViewModel> Subgroups { get; set; }
        = new List<QuestionSubgroupViewModel>();
    }
}
