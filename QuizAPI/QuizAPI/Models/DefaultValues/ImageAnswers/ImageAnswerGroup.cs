using QuizAPI.Models.Ownership.ClickTrees;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.ImageAnswers
{
    public class ImageAnswerGroup : BaseEntity
    {
        public string Name { get; set; }

        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        //Trees
        public List<ImageAnswer> Images { get; set; }
        = new List<ImageAnswer>();

        public List<ClickTreeOwner> Owners { get; set; } = new List<ClickTreeOwner>();

    }
}
