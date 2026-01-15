using QuizAPI.Models.DefaultValues.BackgroundImage;
using QuizAPI.Models.Questionnaire;
using QuizAPI.Models.Questions.QuestionSeries.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class CourseMapElement_Statistics_ViewModel : BaseEntityViewModel
    {
        public int MapId { get; set; }

        public string Title { get; set; }
        public string AdditionalInfo { get; set; }

        public string VideoURL { get; set; }
        public long VideoSize { get; set; }

        public string ExternalVideoLink { get; set; }

        public string PDFURL { get; set; }
        public long PDFSize { get; set; }
        public string AudioURL { get; set; }
        public long AudioSize { get; set; }
        public QuestionSeries_Statistics_ViewModel QuestionSeries { get; set; }
        public int? QuestionSeriesId { get; set; }

        public MapElementLinkViewModel MapAttachment { get; set; }
        public int? MapAttachmentId { get; set; }

        public QuestionnaireMapElementRelationViewModel QuestionnaireRelation { get; set; }
        public int? QuestionnaireRelationId { get; set; }

        public int X { get; set; }
        public int Y { get; set; }


        public int Width { get; set; }
        public int Length { get; set; }

        public int Badge_X { get; set; }
        public int Badge_Y { get; set; }

        public int Badge_Width { get; set; }
        public int Badge_Length { get; set; }

        public int Threshold { get; set; }

        public int? RequiredElementId { get; set; }
        public CourseMapElementViewModel RequiredElement { get; set; }

        public List<CourseMapRequiredElementRelationViewModel> Relations { get; set; }
       = new List<CourseMapRequiredElementRelationViewModel>();

        public List<CourseMapElementBadgeViewModel> Badges { get; set; } = new List<CourseMapElementBadgeViewModel>();

        public bool? IsFinal { get; set; }

        public string BackgroundImage { get; set; }

        public CourseMapElementImagesViewModel CourseMapElementImages { get; set; }
        public int? CourseMapElementImagesId { get; set; }

        public BackgroundImageViewModel Background_Image { get; set; }
        public int? Background_ImageId { get; set; }

        public List<CourseMapPDFStatisticsViewModel> PDFStatistics { get; set; } = new List<CourseMapPDFStatisticsViewModel>();
        public List<CourseMapLinkStatisticsViewModel> LinkStatistics { get; set; } = new List<CourseMapLinkStatisticsViewModel>();



    }
}
