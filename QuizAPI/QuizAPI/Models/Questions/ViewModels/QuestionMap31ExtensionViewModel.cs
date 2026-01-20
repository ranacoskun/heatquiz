using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.ViewModels
{
    public class QuestionMap31ExtensionViewModel : BaseEntityViewModel
    {
        public int QuestionId { get; set; }
        public string QuesId { get; set; }
        public string SubMaps { get; set; }
        public string Q_Type { get; set; }
        public string Topic { get; set; }
        public string Sub_Topic { get; set; }
        public string Link_Pdf { get; set; }
        public string Link_Videos { get; set; }
        public string Status { get; set; }
    }
}
