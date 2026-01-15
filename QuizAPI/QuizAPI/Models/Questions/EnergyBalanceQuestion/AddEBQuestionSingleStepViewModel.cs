using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class AddEBQuestionSingleStepViewModel
    {
        [Required]
        public string Code { get; set; }

        [Required]
        public string Latex { get; set; }

        public int SubtopicId { get; set; }
        public int LODId { get; set; }

        public bool Public { get; set; }

        public int BoundryConditionsKeyboard { get; set; }

        public List<string> Attributes { get; set; }

        public IFormFile Picture { get; set; }

        public IFormFile PDF { get; set; }
        public IFormFile Video { get; set; }

        public List<AddEBQsinglestep_question> Questions { get; set; } = new List<AddEBQsinglestep_question>();
        public List<AddEBQsinglestep_boundrycondition> BoundryConditions { get; set; } = new List<AddEBQsinglestep_boundrycondition>();
        public List<AddEBQsinglestep_clickable> ClickableParts { get; set; } = new List<AddEBQsinglestep_clickable>();

        public List<string> Labels { get; set; } = new List<string>();



    }
}
