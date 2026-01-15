using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class DataPoolAccessViewModel
    {
        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }

        public DataPool DataPool { get; set; }
        public int DataPoolId { get; set; }

        public string UserName { get; set; }
    }
}
