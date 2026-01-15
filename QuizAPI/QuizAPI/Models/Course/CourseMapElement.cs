using QuizAPI.Models.DefaultValues.BackgroundImage;
using QuizAPI.Models.Questionnaire;
using QuizAPI.Models.Questions.QuestionSeries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course
{
    public class CourseMapElement : BaseEntity
    {
        public CourseMap Map { get; set; }
        public int MapId { get; set; }

        public string Title { get; set; }

        public string AdditionalInfo { get; set; }

        public string VideoURL { get; set; }
        public long VideoSize { get; set; }
        public string ExternalVideoLink { get; set; }

        public MapElementLink MapAttachment { get; set; }
        public int? MapAttachmentId { get; set; }

        public QuestionnaireMapElementRelation QuestionnaireRelation { get; set; }
        public int? QuestionnaireRelationId { get; set; }

        public string PDFURL { get; set; }
        public long PDFSize { get; set; }

        public string AudioURL { get; set; }
        public long AudioSize { get; set; }

        //public string AnswersPDFURL { get; set; }
        //public int AnswersPDFThreshold { get; set; }

        public QuestionSeries QuestionSeries { get; set; }
        public int? QuestionSeriesId { get; set; }

       
        public int X { get; set; }
        public int Y { get; set; }

        public int Width { get; set; }
        public int Length { get; set; }

        public int Badge_X { get; set; }
        public int Badge_Y { get; set; }

        public int Badge_Width { get; set; }
        public int Badge_Length { get; set; }

        public int Threshold { get; set; }

        public CourseMapElement RequiredElement { get; set; }
        public int? RequiredElementId { get; set; }

        public List<CourseMapRequiredElementRelation> Relations { get; set; } = new List<CourseMapRequiredElementRelation>();

        public List<CourseMapElementBadge> Badges { get; set; } = new List<CourseMapElementBadge>();

        public bool? IsFinal { get; set; }

        public string BackgroundImage { get; set; }

        public BackgroundImage Background_Image { get; set; }
        public int? Background_ImageId { get; set; }

        public CourseMapElementImages CourseMapElementImages { get; set; }
        public int? CourseMapElementImagesId { get; set; }

        public List<CourseMapPDFStatistics> PDFStatistics { get; set; } = new List<CourseMapPDFStatistics>();
        public List<CourseMapLinkStatistics> LinkStatistics { get; set; } = new List<CourseMapLinkStatistics>();


    }
}
