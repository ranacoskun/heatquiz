using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.MultipleChoiceQuestion.ViewModels
{
    public class MultipleChoiceQuestionChoiceViewModel : BaseEntityViewModel
    {
        public int QuestionId { get; set; }

        public string Text { get; set; }

        public string Latex { get; set; }

        public string LatexURL { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string ImageURL { get; set; }
        public int Image_Width { get; set; }
        public int Image_Height { get; set; }

        public float ScaleFactor { get; set; }

        public bool Correct { get; set; }

        public int TotalSelect { get; set; }
        public int TotalCorrect { get; set; }
    }
}
