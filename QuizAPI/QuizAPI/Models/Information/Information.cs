using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Information
{
    public class Information 
    {
        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }

        public DataPool DataPool { get; set; }
        public int? DataPoolId { get; set; }

        public BaseUser AddedBy { get; set; }
        public string AddedById { get; set; }

        public string Code { get; set; }

        public string Latex { get; set; }

        public string PDFURL { get; set; }
        public long PDFSize { get; set; }

        public List<BaseEntity> Objects  = new List<BaseEntity>();

        public List<InformationOwner> Owners { get; set; } = new List<InformationOwner>();
    }
}
