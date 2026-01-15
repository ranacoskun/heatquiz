using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Tutorials
{
    public class TutorialPDF : BaseEntity
    {
        public Tutorial Tutorial { get; set; }
        public int TutorialId { get; set; }

        public string Title { get; set; }

        public string PDFURL { get; set; }
        public long PDFSize { get; set; }

        
    }
}
