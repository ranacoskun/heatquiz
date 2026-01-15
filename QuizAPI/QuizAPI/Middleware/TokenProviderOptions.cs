using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizAPI.Middleware
{

    public class TokenProviderOptions
    {
        public static readonly string secretKey = "mysupersecret_secretkey!123";

        public string Path { get; set; } = "/api/login";

        public string Issuer { get; set; } = "AltairCA";

        public string Audience { get; set; } = "AltairCAAudience";

        public TimeSpan Expiration { get; set; } = TimeSpan.FromDays(30);

        public SigningCredentials SigningCredentials { get; set; } 
            = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)),
                SecurityAlgorithms.HmacSha256);
    }
}
