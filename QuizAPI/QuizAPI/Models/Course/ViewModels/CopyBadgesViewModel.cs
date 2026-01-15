using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Course.ViewModels
{
    public class CopyBadgesViewModel
    {
        public int MapElementId { get; set; }

        public List<int> BadgeEntityIds { get; set; } = new List<int>();
    }
}
