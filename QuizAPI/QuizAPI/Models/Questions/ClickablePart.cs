using QuizAPI.Models.DefaultValues.BackgroundImage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions
{
    public class ClickablePart : BaseEntity
    {
        public int X { get; set; }
        public int Y { get; set; }

        public int RelativeToImageX { get; set; }
        public int RelativeToImageY { get; set; }

        public int Width { get; set; }
        public int Height { get; set; }

        public int AnswerWeight { get; set; }

        public string BackgroundImage { get; set; }
        public BackgroundImage Background_Image { get; set; }
        public int? Background_ImageId { get; set; }

        public string Comment { get; set; }
    }
}
