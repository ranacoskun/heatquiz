using QuizAPI.Models.Ownership.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.InterpretedImages.ViewModel
{
    public class InterpretedImageGroupViewModel : BaseEntity
    {
        public string Name { get; set; }
        public string AddedByName { get; set; }

        //Images
        public List<InterpretedImageViewModel> Images { get; set; }
        = new List<InterpretedImageViewModel>();

        public List<OwnerInfoViewModel> Owners { get; set; } = new List<OwnerInfoViewModel>();

    }
}
