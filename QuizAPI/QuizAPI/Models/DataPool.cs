using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class DataPool 
    {
        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }

        public string Name { get; set; }
        public string NickName { get; set; }

        public bool IsDefault { get; set; }

        public bool? IsHidden { get; set; }

        public List<DataPoolAccess> PoolAccesses { get; set; } = new List<DataPoolAccess>();

        public List<DatapoolNotificationSubscription> notificationSubscriptions = new List<DatapoolNotificationSubscription>();
    }
}
