using QuizAPI.Models.Ownership;
using QuizAPI.Models.QuestionGroupsSubgroup;
using QuizAPI.Models.Tutorials;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class Course : BaseEntity
    {
        //Basic Properties
        public string Name { get; set; }

        public string Code { get; set; }

        //Thumbnail
        public string URL { get; set; }

        public long Size { get; set; }

        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        //Question Groups
        public List<QuestionGroup> QuestionGroups { get; set; }
        = new List<QuestionGroup>();

        //Tutorial Groups
        public List<TutorialsGroup> TutorialsGroups { get; set; }
        = new List<TutorialsGroup>();

        public List<CourseOwner> Owners { get; set; } = new List<CourseOwner>();

        public List<CourseMap> CourseMaps { get; set; } = new List<CourseMap>();

        public List<CourseBonusPointRegime> Regimes { get; set; } = new List<CourseBonusPointRegime>();

    }
}
