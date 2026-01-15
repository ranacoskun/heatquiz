using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.BackgroundImage
{
    public class BackgroundImage : BaseEntity
    {
        public string Code { get; set; }
        public string URL { get; set; }
        public float Width { get; set; }
        public float Height { get; set; }

        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }
    }
}
