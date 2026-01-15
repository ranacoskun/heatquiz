using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class ApplicationUser : BaseEntity
    {
        public string Code { get; set; }

        public string NickName { get; set; }
    }
}
