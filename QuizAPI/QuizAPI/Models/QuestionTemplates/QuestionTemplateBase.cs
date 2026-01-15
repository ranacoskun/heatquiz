using QuizAPI.Models.DefaultValues.LevelsOfDifficulty;
using QuizAPI.Models.Questions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionTemplates
{
    public class QuestionTemplateBase : BaseEntity
    {
        public string Code { get; set; }

        //Level Of Difficulty
        public LevelOfDifficulty LevelOfDifficulty { get; set; }
        public int LevelOfDifficultyId { get; set; }


        //Subtopic
        public Topic.Subtopic Subtopic { get; set; }
        public int SubtopicId { get; set; }

        //Attiributes
        public List<QuestionAttribure> QuestionAttribures { get; set; } = new List<QuestionAttribure>();
    }
}
