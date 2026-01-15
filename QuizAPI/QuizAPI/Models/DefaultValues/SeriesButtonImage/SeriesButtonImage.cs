using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.SeriesButtonImage
{
    public class SeriesButtonImage : BaseEntity
    {
        public string Code { get; set; }
        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }
        public string ExitImageURL { get; set; }
        public string ClearImageURL { get; set; }
        public string SubmitImageURL { get; set; }
        public string ContinueImageURL { get; set; }
        public string PDFImageURL { get; set; }
    }
}
