using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Services
{
    public class UserIdentityCustom :IUserIdentityCustom
    {
        public string UserId { get; set; }
    }
}
