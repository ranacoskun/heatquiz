using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questionnaire
{
    public class QuestionnaireQuestionViewModel : BaseEntityViewModel
    {
        public int QuestionnaireId { get; set; }
        public int Order { get; set; }
        public QuestionnaireQuestionType? Type { get; set; }

        public string Title { get; set; }

        public string Body { get; set; }
        public bool IsSingleChoice { get; set; }

        public string ImageURL { get; set; }
        public long ImageSize { get; set; }

        public List<QuestionnaireQuestionChoiceViewModel> Choices { get; set; } = new List<QuestionnaireQuestionChoiceViewModel>();


    }
}
