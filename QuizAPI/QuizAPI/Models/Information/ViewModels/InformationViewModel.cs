using QuizAPI.Models.Ownership.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Information.ViewModels
{
    public class InformationViewModel : BaseEntityViewModel
    {
        public string AddedByName { get; set; }


        public string Code { get; set; }

        public string Latex { get; set; }

        public string PDFURL { get; set; }
        public long PDFSize { get; set; }

        public List<OwnerInfoViewModel> Owners { get; set; } = new List<OwnerInfoViewModel>();

    }
}
