using QuizAPI.Models.DefaultValues.BackgroundImage;
using QuizAPI.Models.DefaultValues.Keyboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class EB_ClickablePart : BaseEntity
    {
        public EnergyBalanceQuestion Question { get; set; }
        public int QuestionId { get; set; }

        public int X { get; set; }
        public int Y { get; set; }

        public int RelativeToImageX { get; set; }
        public int RelativeToImageY { get; set; }

        public int NorthX { get; set; }
        public int NorthY { get; set; }

        public int SouthX { get; set; }
        public int SouthY { get; set; }

        public int EastX { get; set; }
        public int EastY { get; set; }

        public int WestX { get; set; }
        public int WestY { get; set; }

        public int Width { get; set; }
        public int Height { get; set; }

        public int AnswerWeight { get; set; }

        public string BackgroundImage { get; set; }

        public BackgroundImage Background_Image { get; set; }
        public int? Background_ImageId { get; set; }

        public Keyboard Keyboard { get; set; }
        public int? KeyboardId { get; set; }
        public List<EB_Answer> Answers { get; set; } = new List<EB_Answer>();

        public List<EB_Q_L_D_Relation> Relations { get; set; } = new List<EB_Q_L_D_Relation>();

    }

}
