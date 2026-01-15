using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class UpdateDataPoolAccessViewModel 
    {
        public List<string> UsersWithAccess { get; set; } = new List<string>();
        public int UpdateDataPoolId { get; set; }
    }
}
