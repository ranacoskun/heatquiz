using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class AdvancedDataPoolStatisticsViewModel
    {
        public int query_dp_Id { get; set; }

        public List<int> TopicIds { get; set; } = new List<int>();

        public string Player { get; set; }

        public string From { get; set; }

        public string To { get; set; }
    }
}
