using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.KeyboardQuestion.ViewModels
{
    public class AddKeyboardQuestionSingleStepViewModel
    {
        public string Code { get; set; }

        public string AdditionalInfo { get; set; }

        public bool? IsEnergyBalance { get; set; }
        public bool? DisableDevision { get; set; }

        public int SubtopicId { get; set; }
        public int LODId { get; set; }

        public bool Public { get; set; }

        public List<string> Attributes { get; set; }

        public IFormFile Picture { get; set; }
        public int? DefaultImageId { get; set; }

        public IFormFile PDF { get; set; }
        public IFormFile Video { get; set; }

        public int KeyboardId { get; set; }


        public string AnswerForLatex { get; set; }

        public List<KeyboardQuestionAnswerViewModel> Answers { get; set; } = new List<KeyboardQuestionAnswerViewModel>();
        public string AnswersString { get; set; }

        public int DataPoolId { get; set; }

        
    }
}
