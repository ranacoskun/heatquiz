using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.QuestionGroupsSubgroup.ViewModels
{
    public class QuestionSubgroupViewModel : BaseEntityViewModel
    {
        public string Name { get; set; }

        //Group
        public QuestionGroupViewModel Group { get; set; }
        public int GroupId { get; set; }

        //Clickable Questions 
        public List<ClickableQuestionSubgroupRelationViewModel> ClickableSubgroupRelations { get; set; } = new List<ClickableQuestionSubgroupRelationViewModel>();
        public List<KeyboardQuestionSubgroupRelationViewModel> KeyboardSubgroupRelations { get; set; } = new List<KeyboardQuestionSubgroupRelationViewModel>();

        //Keyboard Questions
        //public List<KeyboardQuestionViewModel> KeyboardQuestions { get; set; } = new List<KeyboardQuestionViewModel>();
    }
}
