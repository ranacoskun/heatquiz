using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Information
{
    public class InformationOwner 
    {
        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }

        public Information Information { get; set; }
        public int InformationId { get; set; }

        public BaseUser Owner { get; set; }
        public string OwnerId { get; set; }
    }

}
