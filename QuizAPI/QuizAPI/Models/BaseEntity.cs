using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class BaseEntity
    {
        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }

        public Information.Information Information { get; set; }
        public int? InformationId { get; set; }


        public DataPool DataPool { get; set; }
        public int? DataPoolId { get; set; }
    }
}
