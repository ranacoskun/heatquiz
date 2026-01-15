using QuizAPI.Models.Ownership;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.InterpretedImages
{
    public class InterpretedImageGroup : BaseEntity
    {
        public string Name { get; set; }

        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        //Images
        public List<InterpretedImage> Images { get; set; }
        = new List<InterpretedImage>();

        public List<InterpretedTreeOwner> Owners { get; set; } = new List<InterpretedTreeOwner>();

    }
}
