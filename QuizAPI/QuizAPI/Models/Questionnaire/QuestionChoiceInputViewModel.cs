using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionChoiceInputViewModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public float Value { get; set; }
    }
}
