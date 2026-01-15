using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class UserLinkedPlayerKey
    {
        public int Id { get; set; }
        public DateTime DateCreated { get; set; }

        public string PlayerKey { get; set; }
        public BaseUser User { get; set; }
        public string UserId { get; set; }
    }
}
