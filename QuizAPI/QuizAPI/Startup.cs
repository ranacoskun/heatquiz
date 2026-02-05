using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using QuizAPI.Data;
using QuizAPI.Mapping;
using QuizAPI.Middleware;
using QuizAPI.Models;
using QuizAPI.Services;
using SaleApp.Middleware;

namespace QuizAPI
{
    public class Startup
    {
        // NOTE: This project targets netcoreapp2.0; keep configuration usage compatible with ASP.NET Core 2.x.
        // For Azure App Service, set these via App Settings (environment variables).
        private const string DevFallbackJwtKey = "mysupersecret_secretkey!123"; // MUST be overridden in production.

        private readonly string _jwtIssuer;
        private readonly string _jwtAudience;
        private readonly SymmetricSecurityKey _signingKey;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

            _jwtIssuer = (Configuration["Jwt:Issuer"] ?? "AltairCA").Trim();
            _jwtAudience = (Configuration["Jwt:Audience"] ?? "AltairCAAudience").Trim();

            // If Jwt:Key exists but is empty, fall back to the dev key (so local dev doesn't crash).
            // In Azure/production, override Jwt:Key with a strong secret via App Service config.
            var jwtKey = (Configuration["Jwt:Key"] ?? "").Trim();
            if (string.IsNullOrEmpty(jwtKey))
            {
                jwtKey = DevFallbackJwtKey;
            }
            _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey));

            // Configure file URL base used in API responses (avoid hardcoded legacy hosts / mixed-content issues).
            // Expected: "https://<your-backend>.azurewebsites.net/Files" (no trailing slash).
            var filesBaseUrl = (Configuration["App:FilesBaseUrl"] ?? Configuration["FILES_BASE_URL"] ?? "").Trim();
            if (!string.IsNullOrEmpty(filesBaseUrl))
            {
                MappingProfile.FILES_PATH = filesBaseUrl.TrimEnd('/');
            }
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            #region CORS

            services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
            {
                // If Cors:AllowedOrigins is provided, lock CORS down to those origins (recommended for Azure).
                // Otherwise, fall back to AllowAnyOrigin (legacy behavior).
                var allowedOrigins =
                    Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                    ?? (Configuration["Cors:AllowedOrigins"] ?? "")
                        .Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(s => s.Trim())
                        .Where(s => !string.IsNullOrEmpty(s))
                        .ToArray();

                if (allowedOrigins != null && allowedOrigins.Length > 0)
                {
                    builder
                        .WithOrigins(allowedOrigins)
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                }
                else
                {
                    builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                }
            }));

            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new CorsAuthorizationFilterFactory("MyPolicy"));
            });

            #endregion


            services.AddMvc().AddJsonOptions(
                options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );

            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                options.SerializerSettings.ContractResolver
                    = new Newtonsoft.Json.Serialization.DefaultContractResolver();
            });

            #region Database + Seed + HTTP Accessor

            services.AddDbContext<ApplicationDbContext>((provider, options) =>
               options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")),
               ServiceLifetime.Transient, ServiceLifetime.Transient);

            services.AddTransient<Seed>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            #endregion

            #region LLM (server-side OpenAI client)

            // Keep OpenAI key on the server. Configure in Azure App Service:
            // - OpenAI__ApiKey or OPENAI_API_KEY
            // - OpenAI__Model  or OPENAI_MODEL (optional)
            // - OpenAI__ApiUrl or OPENAI_API_URL (optional)
            services.AddSingleton<OpenAiChatService>();

            #endregion

            #region Authorization

            services.AddIdentity<BaseUser, IdentityRole>(o =>
            {
                o.Password.RequireDigit = false;
                o.Password.RequiredLength = 0;
                o.Password.RequireLowercase = false;
                o.Password.RequireNonAlphanumeric = false;
                o.Password.RequireUppercase = false;

            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            var tokenValidationParameters = new TokenValidationParameters
            {
                //The signing key must match !
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _signingKey,

                //Validate the JWT Issuer (iss) claim
                ValidateIssuer = true,
                ValidIssuer = _jwtIssuer,

                //validate the JWT Audience (aud) claim

                ValidateAudience = true,
                ValidAudience = _jwtAudience,

                //validate the token expiry
                ValidateLifetime = true,

                // If you  want to allow a certain amout of clock drift
                ClockSkew = TimeSpan.Zero
            };

            services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = tokenValidationParameters;
            });

            // Provide TokenProviderOptions via configuration so controllers can generate tokens using the same key.
            services.Configure<TokenProviderOptions>(options =>
            {
                options.Issuer = _jwtIssuer;
                options.Audience = _jwtAudience;

                // Optional: override expiration days via config (defaults to TokenProviderOptions default).
                if (int.TryParse(Configuration["Jwt:ExpirationDays"], out var expirationDays) && expirationDays > 0)
                {
                    options.Expiration = TimeSpan.FromDays(expirationDays);
                }

                options.SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
            });

            services.AddAuthorization(options =>
            {

                options.AddPolicy("admin",
                    authBuilder =>
                    {
                        authBuilder.RequireRole("admin");
                    });

                options.AddPolicy("course_editor",
                    authBuilder =>
                    {
                        authBuilder.RequireRole("course_editor");
                    });

                options.AddPolicy("content_editor",
                    authBuilder =>
                    {
                        authBuilder.RequireRole("content_editor");
                    });

            });

            //services.AddScoped<TokenProviderOptions>();

            #endregion

            #region File Provider + Automapper

            services.AddSingleton<IFileProvider>(
                new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")));

            services.AddAutoMapper();
            
            #endregion
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, Seed Seeder)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseCors("MyPolicy");

            // Serve static files from wwwroot at the site root (needed for /dist/* assets referenced by views)
            app.UseStaticFiles();

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
                RequestPath = "/Files"
            });

            app.UseDirectoryBrowser(new DirectoryBrowserOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
                RequestPath = "/Files"
            });

            app.UseAuthentication();

            var jwtOptions = new TokenProviderOptions
            {
                Audience = _jwtAudience,
                Issuer = _jwtIssuer,
                SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256)
            };

            
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                // The legacy SPA fallback route requires SPA assets + optional NodeServices prerendering.
                // When hosting the frontend separately (Azure Static Web Apps), keep the backend API-only.
                // To re-enable SPA fallback, set Spa:EnableFallback=true (or env var Spa__EnableFallback=true).
                var enableSpaFallback = env.IsDevelopment() || Configuration.GetValue<bool>("Spa:EnableFallback");
                if (enableSpaFallback)
                {
                    routes.MapSpaFallbackRoute(
                        name: "spa-fallback",
                        defaults: new { controller = "Home", action = "Index" });
                }
            });

            //Seeder.SeedAdminAndRoles();

        }

    }

    public static class TokenProviderMiddlewareExtensions
    {
        public static IApplicationBuilder UseJWTTokenProviderMiddleware(this IApplicationBuilder builder, IOptions<TokenProviderOptions> options)
        {
            return builder.UseMiddleware<TokenProviderMiddleware>(options);
        }
    }
}
