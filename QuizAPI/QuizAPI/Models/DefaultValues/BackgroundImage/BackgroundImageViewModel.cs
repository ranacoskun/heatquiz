using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.BackgroundImage
{
    public class BackgroundImageViewModel : BaseEntityViewModel
    {
        public string Code { get; set; }
        public string URL { get; set; }
        public float Width { get; set; }
        public float Height { get; set; }

        public string AddedByName { get; set; }
    }
}
