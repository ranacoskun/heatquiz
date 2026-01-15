using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Ownership.ViewModels
{
    public class EditOwnershipViewModel
    {
        public int Id { get; set; }

        public List<string> Owners { get; set; } = new List<string>();

        public EntityType Type { get; set; }

    }

    public enum EntityType
    {
        CLICK_IMAGE         = +1,
        INTERPRETED_IMAGE   = +2,
        COURSE              = +3,
        KEYBOARD            = +4,
        QUESTION            = +5,
        TOPIC               = +6,
        CHALLENGE           = +7,
    }
}
