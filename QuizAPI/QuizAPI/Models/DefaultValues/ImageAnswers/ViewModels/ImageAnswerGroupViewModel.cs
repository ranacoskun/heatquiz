using QuizAPI.Models.Ownership.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.ImageAnswers.ViewModels
{
    public class ImageAnswerGroupViewModel : BaseEntityViewModel
    {
        public string Name { get; set; }
        public string AddedByName { get; set; }

        //Trees
        public List<ImageAnswerViewModel> Images { get; set; }
        = new List<ImageAnswerViewModel>();

        public List<OwnerInfoViewModel> Owners { get; set; } = new List<OwnerInfoViewModel>();

        public int DataPoolId { get; set; }

    }
}
