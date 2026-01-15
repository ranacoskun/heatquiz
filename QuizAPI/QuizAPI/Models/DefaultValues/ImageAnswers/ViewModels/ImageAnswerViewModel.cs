using QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.ImageAnswers.ViewModels
{
    public class ImageAnswerViewModel : BaseEntityViewModel
    {
        //Edit
        public bool Edit { get; set; }

        //
        public string Name { get; set; }

        public bool Choosable { get; set; }

        //Image
        public string URL { get; set; }
        public long Size { get; set; }

        //Group 
        public ImageAnswerGroupViewModel Group { get; set; }
        public int GroupId { get; set; }

        //Root 
        public ImageAnswerViewModel Root { get; set; }
        public int? RootId { get; set; }

        //Leafs
        public List<ImageAnswerViewModel> Leafs { get; set; }
        = new List<ImageAnswerViewModel>();

        public List<ClickImageViewModel> ClickImages { get; set; } = new List<ClickImageViewModel>();

    }
}
