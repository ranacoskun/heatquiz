using QuizAPI.Models.Questions.SimpleClickableQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.InterpretedImages
{
    public class InterpretedImage : BaseEntity
    {
        public string Code { get; set; }

        //Left
        public LeftGradientValue Left { get; set; }
        public int LeftId { get; set; }

        //Right
        public RightGradientValue Right { get; set; }
        public int RightId { get; set; }

        //Ratio
        public RationOfGradientsValue RationOfGradients { get; set; }
        public int RationOfGradientsId { get; set; }

        //Jump
        public JumpValue Jump { get; set; }
        public int JumpId { get; set; }

        //Image
        public string URL { get; set; }
        public long Size { get; set; }

        //Group
        public InterpretedImageGroup Group { get; set; }
        public int GroupId { get; set; }

        public List<ClickChart> ClickCharts { get; set; } = new List<ClickChart>();
    }
}
