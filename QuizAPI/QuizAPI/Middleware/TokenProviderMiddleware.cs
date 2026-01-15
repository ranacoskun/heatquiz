using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.Web;
using Microsoft.AspNetCore.Http.Internal;
using System.Net.NetworkInformation;
using Microsoft.AspNetCore.Mvc;
using QuizAPI.Middleware;
using QuizAPI.Models;
using QuizAPI.Data;
using QuizAPI.Services;
using Microsoft.AspNetCore.Authentication;

namespace SaleApp.Middleware
{

    public class TokenProviderMiddleware
    {
        private readonly RequestDelegate _next;
        private TokenProviderOptions _options;


        private readonly ApplicationDbContext _applicationDbContext;

        public TokenProviderMiddleware(
            RequestDelegate next,
            IOptions<TokenProviderOptions> options,
            ApplicationDbContext applicationDbContext
            )
        {
            _next = next;
            _options = options.Value;
            _applicationDbContext = applicationDbContext;
        }

        public Task Invoke(HttpContext context)
        {
            if (context.Request.Method.Equals("POST") && context.Request.Path.Equals(_options.Path, StringComparison.Ordinal))
                return GenerateToken(context);

            //GetUserIdentity(context);

            return _next(context);

        }

        private async Task GenerateToken(HttpContext context)
        {
            string username = "";
            string password = "";

            try
            {
                var bodyStr = "";
                var req = context.Request;
                req.EnableRewind();

                using (StreamReader reader
                    = new StreamReader(req.Body, Encoding.UTF8, true, 1024, true))
                {
                    bodyStr = reader.ReadToEnd();
                }

                req.Body.Position = 0;

                var request = JsonConvert.DeserializeObject<LoginRequest>(bodyStr);
                username = request.username;
                password = request.password;
            }
            catch
            {
            }

            //Get User
            var user = await _applicationDbContext.Users
                .FirstOrDefaultAsync(u => u.UserName == username);

            if (user is null)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("User Not Found");
                return;
            }

            
             //Check Password
            /*var PasswordValid = await _userManager.CheckPasswordAsync(user, password);

            if (!PasswordValid)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Invalid Password");
                return;
            }*/
            
            //Get User Roles 
            var UserRoleIds = await _applicationDbContext.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Select(ur => ur.RoleId)
                .ToArrayAsync();

            var UserRoles = await _applicationDbContext.Roles
                .Where(r => UserRoleIds.Any(i => i == r.Id))
                .Select(r => r.Name)
                .ToListAsync();

            List <Claim> claims = new List<Claim>();
            claims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));
            claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
            claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
            claims.Add(new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64));

            foreach (var x in UserRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, x));
            }

            var jwt = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.Add(_options.Expiration),
                signingCredentials: _options.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new
            {
                access_token = encodedJwt,
                expires_in = (int)_options.Expiration.TotalSeconds,
                username = user.Name,
                roles = UserRoles
            };

            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));   
    }

        private void GetUserIdentity(HttpContext context)
        {
            string token = string.Empty;

            token = (context.Request.Headers.Any(x => x.Key == "Authorization")) 
                ? context.Request.Headers.Where(x => x.Key == "Authorization")
                .FirstOrDefault().Value.SingleOrDefault().Replace("Bearer ", "") 
                : "";



        }
    }
}

class LoginRequest
{
    public string username { get; set; }
    public string password { get; set; }
}
