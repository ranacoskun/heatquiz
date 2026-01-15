using QuizAPI.Models.DefaultValues.ImageAnswers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Ownership.ClickTrees
{
    public class ClickTreeOwner : BaseEntity
    {
        public BaseUser Owner { get; set; }
        public string OwnerId { get; set; }

        public ImageAnswerGroup ImageGroup { get; set; }
        public int ImageGroupId { get; set; }
    }
}
