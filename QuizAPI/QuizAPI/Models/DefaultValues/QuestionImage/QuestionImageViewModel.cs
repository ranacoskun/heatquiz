using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.QuestionImage
{
    public class QuestionImageViewModel : BaseEntityViewModel
    {
        public string Code { get; set; }
        public string AddedByName { get; set; }
        public string ImageURL { get; set; }
        public long size { get; set; }
    }
}
