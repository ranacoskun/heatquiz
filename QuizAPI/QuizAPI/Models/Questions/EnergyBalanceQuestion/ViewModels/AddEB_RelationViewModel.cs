using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.EnergyBalanceQuestion.ViewModels
{
    public class AddEB_RelationViewModel
    {
        public int LabelId { get; set; }
        public int QuestionId { get; set; }
        public List<int> Directions = new List<int>();

        public List<int> QuestionIds = new List<int>();
    }
}
