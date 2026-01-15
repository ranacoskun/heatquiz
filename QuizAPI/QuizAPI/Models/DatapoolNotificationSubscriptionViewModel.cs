using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class DatapoolNotificationSubscriptionViewModel
    {
        public int Id { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime LastSeen { get; set; }

        public string User { get; set; }

        public DataPoolViewModel Datapool { get; set; }
        public int DatapoolId { get; set; }
    }
}
