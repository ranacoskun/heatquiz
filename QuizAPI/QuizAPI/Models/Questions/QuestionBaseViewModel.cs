using QuizAPI.Models.DefaultValues.LevelsOfDifficulty;
using QuizAPI.Models.Ownership.ViewModels;
using QuizAPI.Models.QuestionGroupsSubgroup.ViewModels;
using QuizAPI.Models.Questions.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions
{
    public class QuestionBaseViewModel : BaseEntityViewModel
    {
        public int Type { get; set; }

        [Required]
        public string Code { get; set; }

        //Added By
        public string AddedByName { get; set; }
        public string EditedByName { get; set; }

        public bool Public { get; set; }

        //Level Of Difficulty
        public LevelOfDifficultyViewModel LevelOfDifficulty { get; set; }
        public int LevelOfDifficultyId { get; set; }

        public List<QuestionAttribureViewMode> QuestionAttribures { get; set; } = new List<QuestionAttribureViewMode>();


        //Thumbnail 
        public string ThumbnailURL { get; set; }
        public long ThumbnailSize { get; set; }

        public string Base_ImageURL { get; set; }
        public int Base_ImageURL_Width { get; set; }
        public int Base_ImageURL_Height { get; set; }


        //Subtopic
        public Topic.ViewModels.SubtopicViewModel Subtopic { get; set; }
        public int SubtopicId { get; set; }

        //PDF Solution
        public string PDFURL { get; set; }
        public long PDFSize { get; set; }

        public string VIDEOURL { get; set; }
        public long VIDEOSize { get; set; }

        public List<OwnerInfoViewModel> Owners { get; set; } = new List<OwnerInfoViewModel>();

        //
        //public string ImageURL { get; set; }

        //public string BackgroundImageURL { get; set; }

        public List<QuestionStatisticViewModel> QuestionStatistics { get; set; } = new List<QuestionStatisticViewModel>();

        // Extension data for CourseMap 31
        public QuestionMap31ExtensionViewModel Extension { get; set; }

    }
}
