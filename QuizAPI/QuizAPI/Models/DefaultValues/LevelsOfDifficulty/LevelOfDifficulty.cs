using QuizAPI.Models.Questions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.LevelsOfDifficulty
{
    public class LevelOfDifficulty : BaseEntity
    {
        public string Name { get; set; }

        public string HexColor { get; set; }

        public List<QuestionBase> Questions { get; set; } = new List<QuestionBase>();
    }
}
