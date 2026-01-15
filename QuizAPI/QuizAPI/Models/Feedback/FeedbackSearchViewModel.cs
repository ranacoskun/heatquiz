using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Feedback
{
    public class FeedbackSearchViewModel
    {
        [Required]
        public string encryption { get; set; }

        public string FromDate { get; set; }

        public string ToDate { get; set; }
        public int DataPoolId { get; set; }

    }
}
