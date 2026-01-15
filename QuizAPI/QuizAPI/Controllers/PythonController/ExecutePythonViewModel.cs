using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Controllers.PythonController
{
    public class ExecutePythonViewModel
    {
        public dynamic Parameters { get; set; }

        public string Code { get; set; }
    }
}
