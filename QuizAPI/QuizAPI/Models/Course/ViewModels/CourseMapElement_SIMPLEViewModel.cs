using QuizAPI.Models.Questions.QuestionSeries.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class CourseMapElement_SIMPLEViewModel : BaseEntityViewModel
    {
        public int MapId { get; set; }
        public CourseMap_SIMPLEViewModel Map { get; set; }

        public string Title { get; set; }

        public string VideoURL { get; set; }
        public long VideoSize { get; set; }

        public string ExternalVideoLink { get; set; }

        public string PDFURL { get; set; }
        public long PDFSize { get; set; }

        public string AudioURL { get; set; }
        public long AudioSize { get; set; }

        public QuestionSeriesViewModel QuestionSeries { get; set; }
        public int? QuestionSeriesId { get; set; }

        public MapElementLinkViewModel MapAttachment { get; set; }
        public int? MapAttachmentId { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        public int Width { get; set; }
        public int Length { get; set; }
    }
}
