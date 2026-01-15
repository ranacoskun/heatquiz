using QuizAPI.Models.Questions.EnergyBalanceQuestion.ViewModels;
using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion
{
    public class AddEBQsinglestep_clickable
    {
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

        public int? BackgroundImageId { get; set; }

        public int KeyboardId { get; set; }

        public List<AddEBQsinglestep_Relation> Relations = new List<AddEBQsinglestep_Relation>();

    }
}
