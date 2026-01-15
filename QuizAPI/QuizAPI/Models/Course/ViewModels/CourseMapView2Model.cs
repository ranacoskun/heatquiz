using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class CourseMapView2Model : BaseEntityViewModel
    {
        public CourseViewModel Course { get; set; }
        public int CourseId { get; set; }

        [Required]
        public string Title { get; set; }

        public bool IsSeriesMap { get; set; }
        public bool ShowBorder { get; set; }
        public bool? ShowSolutions { get; set; }

        public bool Disabled { get; set; }

        public string LargeMapURL { get; set; }
        public int LargeMapWidth { get; set; }
        public int LargeMapLength { get; set; }
        public string KeyInfo { get; set; }

        public List<CourseMapElement_Statistics_ViewModel> Elements { get; set; } = new List<CourseMapElement_Statistics_ViewModel>();
        public List<CourseMapBadgeSystemViewModel> BadgeSystems { get; set; } = new List<CourseMapBadgeSystemViewModel>();
        public List<CourseMapArrowViewModel> Arrows { get; set; } = new List<CourseMapArrowViewModel>();

    }
}
