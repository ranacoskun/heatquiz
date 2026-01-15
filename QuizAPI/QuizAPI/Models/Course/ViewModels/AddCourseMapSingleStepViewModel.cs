using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class AddCourseMapSingleStepViewModel
    {
        //[Required]
        public int CourseId { get; set; }

        //[Required]
        public string Title { get; set; }

        public bool IsSeriesMap { get; set; }
        public bool ShowBorder { get; set; }

        public IFormFile Picture { get; set; }

         public float LargeMapWidth { get; set; }
         public float LargeMapLength { get; set; }

         public string ElementsString { get; set; }

        public List<IFormFile> BackgroundImages { get; set; } = new List<IFormFile>();

        public int? DataPoolId { get; set; }

    }
}
