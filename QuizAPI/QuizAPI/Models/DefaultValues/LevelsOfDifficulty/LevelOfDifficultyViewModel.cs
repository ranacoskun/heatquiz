using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.LevelsOfDifficulty
{
    public class LevelOfDifficultyViewModel : BaseEntityViewModel
    {
        public string Name { get; set; }

        public string HexColor { get; set; }

    }
}
