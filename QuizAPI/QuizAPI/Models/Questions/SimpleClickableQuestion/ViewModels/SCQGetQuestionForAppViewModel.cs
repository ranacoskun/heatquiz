using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels
{
    public class SCQGetQuestionForAppViewModel
    {

        public int Group { get; set; }
        public int Course { get; set; }

        public bool GetAll { get; set; }
        public bool GetAllLevelOfDifficulty { get; set; }

        public int? Subgroup { get; set; }
        public int? Topic { get; set; }

        public int? LevelOfDifficulty { get; set; }

        public int? Subtopic { get; set; }

        public string Code { get; set; }

        public int QuestionId { get; set; }

        public bool MakePublic { get; set; }

        public int Page { get; set; }
        public int QperPage { get; set; }

        public int NumberOfQuestions { get; set; }

        public bool Recalculate { get; set; }

        public bool SearchBasedOnQuestionTypes { get; set; }

        public bool ShowClickableQuestions { get; set; }
        public bool ShowKeyboardQuestions { get; set; }
        public bool ShowMultipleChoiceQuestions { get; set; }
        public bool ShowEBQuestions { get; set; }
        public bool ShowFreebodyDiagramQuestions { get; set; }
        public bool ShowDiagramQuestions { get; set; }
        public bool ShowPVDiagramQuestions { get; set; }

        public bool SearchBasedOnMedianTime { get; set; }

        public int MedianTime1 { get; set; }
        public int MedianTime2 { get; set; }

        public bool SearchBasedOnPlayStats { get; set; }

        public int MinimumQuestionPlay { get; set; }
        public int SuccessRate1 { get; set; }
        public int SuccessRate2 { get; set; }

        public bool GetIdsTypes { get; set; }

        public int DataPoolId { get; set; }

        public int? Failure_Percentage { get; set; }
        public int? Failure_NumberOfGames { get; set; }

    }
}
