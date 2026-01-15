using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.QuestionImage
{
    public class QuestionImageSearchViewModel
    {
        public string Code { get; set; }

        public int Page { get; set; }
        public int QperPage { get; set; }

        public int DataPoolId { get; set; }
    }
}
