using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated.ViewModels
{
    public class EnergyBalanceQuestion_ControlVolumeViewModel : BaseEntityViewModel
    {
        public EnergyBalanceQuestionUpdatedViewModel Question { get; set; }
        public int QuestionId { get; set; }

        public int X { get; set; }
        public int Y { get; set; }

        public int Width { get; set; }
        public int Height { get; set; }

        public bool Correct { get; set; }

        public string ImageURL { get; set; }
        public string Comment { get; set; }

    }
}
