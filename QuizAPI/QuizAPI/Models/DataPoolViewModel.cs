using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models
{
    public class DataPoolViewModel 
    {
        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }


        [Required]
        public string Name { get; set; }

        [Required]
        public string NickName { get; set; }

        public bool IsDefault { get; set; }

        public bool? IsHidden { get; set; }

        public List<DataPoolAccessViewModel> PoolAccesses = new List<DataPoolAccessViewModel>();

    }
}
