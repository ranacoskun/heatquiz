using QuizAPI.Models.DefaultValues.BackgroundImage;
using QuizAPI.Models.DefaultValues.Keyboard.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion.ViewModels
{
    public class EB_ClickablePartViewModel : BaseEntityViewModel
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

        public int AnswerWeight { get; set; }

        public string BackgroundImage { get; set; }
        public BackgroundImageViewModel Background_Image { get; set; }
        public int Background_ImageId { get; set; }

        public KeyboardViewModel Keyboard { get; set; }
        public int? KeyboardId { get; set; }
        public List<EB_AnswerViewModel> Answers { get; set; } = new List<EB_AnswerViewModel>();
        public List<EB_Q_L_D_RelationViewModel> Relations { get; set; } = new List<EB_Q_L_D_RelationViewModel>();


    }
}
