using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions
{
    public class StudentReportViewModel
    {
        public string Code { get; set; }

        public string From { get; set; }

        public string To { get; set; }

        public int datapool_id { get; set; }
    }
}
