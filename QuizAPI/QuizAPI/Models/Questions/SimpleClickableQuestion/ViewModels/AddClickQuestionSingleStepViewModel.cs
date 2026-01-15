using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels
{
    public class AddClickQuestionSingleStepViewModel
    {       
            [Required]
            public string Code { get; set; }

            public int SubtopicId { get; set; }
            public int LODId { get; set; }

            public bool Public{ get; set; }

            public List<string> Attributes{ get; set; }
            public string Latex { get; set; }

            public IFormFile Picture{ get; set; }
            public int PictureWidth { get; set; }
            public int PictureHeight { get; set; }

            [Required]
            public string ClickParts { get; set; }

            public IFormFile PDF { get; set; }
            public IFormFile Video { get; set; }

            public List<IFormFile> BackgroundImages { get; set; } = new List<IFormFile>();
            
            public int DataPoolId { get; set; }

    }
}
