using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Tutorials
{
    public class TutorialsGroup : BaseEntity
    {
        public string Name { get; set; }

        //Tutorials
        public List<Tutorial> Tutorials { get; set; }
        = new List<Tutorial>();
    }
}
