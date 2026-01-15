using QuizAPI.Models.Information.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class BaseEntityViewModel
    {
        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }

        public InformationViewModel Information { get; set; }
        public int InformationId { get; set; }

        public int? DataPoolId { get; set; }

    }
}
