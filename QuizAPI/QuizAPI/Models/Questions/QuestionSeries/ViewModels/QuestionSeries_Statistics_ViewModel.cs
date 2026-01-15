using QuizAPI.Models.Course.ViewModels;
using QuizAPI.Models.Ownership.ViewModels;
using QuizAPI.Models.Questionnaire;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.QuestionSeries.ViewModels
{
    public class QuestionSeries_Statistics_ViewModel : BaseEntityViewModel
    {
        [Required]
        public string   Code        { get; set; }
        public string   AddedByName { get; set; }

        public bool     IsRandom    { get; set; }
        public int      RandomSize      { get; set; }

        public QuestionnaireSeriesRelationViewModel QuestionnaireRelation { get; set; }
        public int? QuestionnaireRelationId { get; set; }

        public List<QuestionSeriesElementViewModel> Elements { get; set; } = new List<QuestionSeriesElementViewModel>();

        public List<OwnerInfoViewModel> Owners { get; set; } = new List<OwnerInfoViewModel>();

        public List<CourseMapElement_SIMPLEViewModel> MapElements { get; set; } = new List<CourseMapElement_SIMPLEViewModel>();

        public int DataPoolId       { get; set; }

        public int NumberOfPools    { get; set; }

        public List<QuestionSeriesStatisticViewModel> Statistics { get; set; } = new List<QuestionSeriesStatisticViewModel>();

        public int MedianPlayTime           { get; set; }
        public int TotalStats               { get; set; }
        public int TotalStatsOnMobile       { get; set; }

    }
}
