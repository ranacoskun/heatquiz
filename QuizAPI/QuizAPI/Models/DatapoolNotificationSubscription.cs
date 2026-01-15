using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class DatapoolNotificationSubscription 
    {
        public int Id { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime LastSeen { get; set; }

        public BaseUser User { get; set; }
        public string UserId { get; set; }

        public DataPool Datapool { get; set; }
        public int DatapoolId { get; set; }
    }
}
