using QuizAPI.Models.DefaultValues.LevelsOfDifficulty;
using QuizAPI.Models.Feedback;
using QuizAPI.Models.Ownership;
using QuizAPI.Models.QuestionGroupsSubgroup;
using QuizAPI.Models.Questions.QuestionComment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions
{
    public class QuestionBase : BaseEntity
    {
        public int Type { get; set; }
        public string Code { get; set; }

        //Added By
        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        public BaseUser EditedBy { get; set; }
        public string EditedById { get; set; }

        public QuestionCommentSection CommentSection { get; set; }
        public int CommentSectionId { get; set; }

        //Private Or Public
        public bool Public { get; set; }

        //Approved
        public bool Approved { get; set; }

        //Level Of Difficulty
        public LevelOfDifficulty LevelOfDifficulty { get; set; }
        public int LevelOfDifficultyId { get; set; }

        public string Base_ImageURL {get;set;}
        public int Base_ImageURL_Width { get; set; }
        public int Base_ImageURL_Height { get; set; }
        
        //Thumbnail jhf
        public string ThumbnailURL { get; set; }
        public long ThumbnailSize { get; set; }

        //Subtopic
        public Topic.Subtopic Subtopic { get; set; }
        public int SubtopicId { get;set; }

        //Attiributes
        public List<QuestionAttribure> QuestionAttribures { get; set; } = new List<QuestionAttribure>();
        

        //PDF Solution
        public string PDFURL { get; set; }
        public long PDFSize { get; set; }

        public string VIDEOURL { get; set; }
        public long VIDEOSize { get; set; }

        public List<QuestionOwner> Owners { get; set; } = new List<QuestionOwner>();

        //public string ImageURL { get; set; }

        //public string BackgroundImageURL { get; set; }

        public List<QuestionStatistic> QuestionStatistics { get; set; } = new List<QuestionStatistic>();

        public List<QuestionPDFStatistic> QuestionPDFStatistics { get; set; } = new List<QuestionPDFStatistic>();
        public List<FeedbackQuestion> StudentFeedback { get; set; } = new List<FeedbackQuestion>();
        public List<FeedbackQuestionEvent> StudentFeedbackEvents { get; set; } = new List<FeedbackQuestionEvent>();
    }
}
