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
        public string Path { get; set; } = "/api/login";

        public string Issuer { get; set; } = "AltairCA";

        public string Audience { get; set; } = "AltairCAAudience";

        public TimeSpan Expiration { get; set; } = TimeSpan.FromDays(30);

        // Configured in Startup from configuration (Jwt:Key).
        public SigningCredentials SigningCredentials { get; set; }
    }
}
