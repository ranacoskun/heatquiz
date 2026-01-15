using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class DataPoolAccess
    {
        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }

        public DataPool DataPool { get; set; }
        public int DataPoolId { get; set; }

        public BaseUser User { get; set; }
        public string UserId { get; set; }
    }
}
