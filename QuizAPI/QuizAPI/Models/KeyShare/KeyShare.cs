using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.KeyShare
{
    public class KeyShare : BaseEntity
    {
        public string Sender { get; set; }

        public string Receiver { get; set; }
    }
}
