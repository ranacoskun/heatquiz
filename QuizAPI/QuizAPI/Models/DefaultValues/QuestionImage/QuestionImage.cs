using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.QuestionImage
{
    public class QuestionImage : BaseEntity
    {
        public string Code { get; set; }

        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        public string ImageURL { get; set; }

        public long size { get; set; }
    }
}
