using QuizAPI.Models.DefaultValues.InterpretedImages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Ownership
{
    public class InterpretedTreeOwner : BaseEntity
    {
        public InterpretedImageGroup ImageGroup { get; set; }
        public int ImageGroupId { get; set; }

        public BaseUser Owner { get; set; }
        public string OwnerId { get; set; }
    }
}
