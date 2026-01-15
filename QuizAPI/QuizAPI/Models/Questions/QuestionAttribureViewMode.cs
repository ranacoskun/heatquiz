using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions
{
    public class QuestionAttribureViewMode : BaseEntityViewModel
    {
        public string Name { get; set; }

        //Question
        public int QuestionBaseId { get; set; }
    }
}
