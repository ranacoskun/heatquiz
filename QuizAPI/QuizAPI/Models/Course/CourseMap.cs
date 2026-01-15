using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class CourseMap : BaseEntity
    {
        public Course Course { get; set; }
        public int CourseId { get; set; }

        public string Title { get; set; }

        public bool IsSeriesMap { get; set; }

        public bool ShowBorder { get; set; }
        public bool? ShowSolutions { get; set; }

        public bool Disabled { get; set; }

        public string LargeMapURL { get; set; }
        public int LargeMapWidth { get; set; }
        public int LargeMapLength { get; set; }

        public string KeyInfo { get; set; }

        public List<CourseMapElement> Elements { get; set; } = new List<CourseMapElement>();

        public List<CourseMapBadgeSystem> BadgeSystems { get; set; } = new List<CourseMapBadgeSystem>();

        public List<CourseMapArrow> Arrows { get; set; } = new List<CourseMapArrow>();

        public List<MapElementLink> Attachments { get; set; } = new List<MapElementLink>();

    }
}
