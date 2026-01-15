using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using QuizAPI.Data;
using QuizAPI.Mapping;
using QuizAPI.Middleware;
using QuizAPI.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.AccountController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        
        private readonly UserManager<BaseUser> _userManager;
        private readonly SignInManager<BaseUser> _signInManager;
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;
        private TokenProviderOptions _options;

        private readonly List<string> ALLOWED_ROLES = new List<string>() { "course_editor", "content_editor" };
        private readonly List<string> NOTALLOWED_NAMES = new List<string>() { "admin", "student" };

        private const string FILES_PATH = "http://167.86.98.171:6001/Files/";//;//"http://localhost:54062/Files/";//

        public AccountController(
            UserManager<BaseUser> userManager,
            SignInManager<BaseUser> signInManager,
            IMapper mapper,
            IOptions<TokenProviderOptions> options,
            ApplicationDbContext applicationDbContext,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _applicationDbContext = applicationDbContext;
            _httpContextAccessor = httpContextAccessor;
            _options = options.Value;
        }

        public IActionResult Index()
        {
            return Ok();
        }

        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> GetAllUsers()
        {
            var DBusers = await _applicationDbContext.Users
                .ToListAsync();

            BaseUser current_user = null;
            List<string> Keys = new List<string>();

            try
            {
                current_user = await GetUser(_httpContextAccessor, _applicationDbContext);

                Keys = await _applicationDbContext.UserLinkedPlayerKeys
                    .Where(k => k.UserId == current_user.Id)
                    .Select(k => k.PlayerKey)
                    .ToListAsync();
            }
            catch
            {

            }

            var Users = new List<dynamic>();

            foreach (var user in DBusers)
            {
                var Roles  = await _userManager.GetRolesAsync(user);

                Users.Add(new
                {
                    Username = user.UserName,
                    Name = user.Name,
                    RegisteredOn = user.RegisteredOn.ToString("d", new CultureInfo("de-De")),
                    Email = user.Email,
                    Roles = Roles,
                    PlayerKeys = (!(current_user is null) && user.Id == current_user.Id) ? Keys : null,
                    ProfilePicture = !string.IsNullOrEmpty(user.ProfilePicture) ? $"{FILES_PATH}/{user.ProfilePicture}" : null
                });
            }

            


            return Ok(Users.OrderBy(a => a.Name));
        }

        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> CheckUserToken()
        {
            var currentUser = await GetUser(_httpContextAccessor, _applicationDbContext);
            var Roles = await _userManager.GetRolesAsync(currentUser);

            return Ok(new {
                username = currentUser.UserName,
                name = currentUser.Name,
                userProfile = !string.IsNullOrEmpty(currentUser.ProfilePicture)
                ? MappingProfile.FILES_PATH + currentUser.ProfilePicture : null,
                roles = Roles
            });
        }

        [Authorize]
        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllUsers_PORTAL_LIMITED()
        {
            var DBusers = await _applicationDbContext.Users
               
                .ToListAsync();


            var Users = new List<dynamic>();

            foreach (var user in DBusers)
            {
                var Roles = await _userManager.GetRolesAsync(user);

                Users.Add(new
                {
                    Name = user.Name,
                    RegisteredOn = user.RegisteredOn.ToString("d", new CultureInfo("de-De")),
                    Email = user.Email,
                    Roles = Roles,
                    ProfilePicture = !string.IsNullOrEmpty(user.ProfilePicture) ? $"{FILES_PATH}/{user.ProfilePicture}" : null,
                });
            }




            return Ok(Users);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Login()
        {
            string username = "";
            string password = "";

            try
            {
                var bodyStr = "";
                var req = HttpContext.Request;
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
                return NotFound("User not found");
            }


            //Check Password
            var PasswordValid = await _userManager.CheckPasswordAsync(user, password);

            if (!PasswordValid)
            {
                return BadRequest("Invalid password");
            }

            //Get User Roles 
            var UserRoleIds = await _applicationDbContext.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Select(ur => ur.RoleId)
                .ToArrayAsync();

            var UserRoles = await _applicationDbContext.Roles
                .Where(r => UserRoleIds.Any(i => i == r.Id))
                .Select(r => r.Name)
                .ToListAsync();

            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));
            claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
            claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
            claims.Add(new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64));

            foreach (var x in UserRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, x));
            }

            /*JwtSecurityToken*/
            var handler = new JwtSecurityTokenHandler();

            var tokenData = new SecurityTokenDescriptor
            {
                Issuer = _options.Issuer,
                Audience = _options.Audience,
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(_options.Expiration),
                NotBefore = DateTime.UtcNow,
                SigningCredentials = _options.SigningCredentials
            };

            var securityToken =
                handler.CreateToken
                (
                    tokenData
                );

            var encodedJwt = handler.WriteToken(securityToken);

            var response = new
            {
                access_token = encodedJwt,
                expires_in = (int)_options.Expiration.TotalSeconds,
                username = user.UserName,
                name = user.Name,
                userProfile = !string.IsNullOrEmpty(user.ProfilePicture)
                ?  MappingProfile.FILES_PATH + user.ProfilePicture: null,

                roles = UserRoles
            };

            return Ok(response);
        }

        //[Authorize("admin")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddUser([FromBody] RegisterViewModel model)
        {

            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            //Check Name Taken
            var NameTaken = await _applicationDbContext.Users
                .AnyAsync(u => u.Name.ToUpper() == model.Name.ToUpper());

            if (NameTaken)
                return BadRequest("Name Alraedy Taken");

            if (NOTALLOWED_NAMES.Any(n => model.Name.ToUpper() == n.ToUpper()))
                return BadRequest("Choose Another Name");

            //Check it Has Roles
            if(model.Roles.Count == 0)
                return BadRequest("Please Provide Roles for User");

            var user = new BaseUser
            {
                UserName = model.Username,
                Email = model.Email,
                Name = model.Name,
                RegisteredOn = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors.First().Description);

            await _signInManager.SignInAsync(user, isPersistent: false);

            foreach(var role in model.Roles.Where(r => ALLOWED_ROLES.Any(ar => ar == r)))
            {
                await _userManager.AddToRoleAsync(user, role);
            }

            return Ok();

        }

        //[Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> EditNameEmail([FromBody]EditUserNameViewModel EUNVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            //Check Name Taken
            var NameTaken = await _applicationDbContext.Users
                .AnyAsync(u => u.Name.ToUpper() == EUNVM.Name.ToUpper() && u.UserName.ToUpper() != EUNVM.Username.ToUpper());

            if (NameTaken)
                return BadRequest("Name Alraedy Taken");

            var User = await _applicationDbContext.Users
                .FirstOrDefaultAsync(u => u.UserName == EUNVM.Username);

            if (User is null)
                return NotFound("Username not found");

            User.Name = EUNVM.Name;
            User.Email = EUNVM.Email;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        //[Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> EditUsername([FromBody]EditUserUsernameViewModel EUNVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            //Check User Exists
            var User = await _applicationDbContext.Users
                .FirstOrDefaultAsync(u => u.UserName == EUNVM.Username);

            if (User is null)
                return NotFound("Username not found");

            //Check Username Taken
            var UsernameTaken = await _applicationDbContext.Users
                .AnyAsync(u => 
                u.UserName != EUNVM.Username 
                && u.UserName.ToUpper() == EUNVM.NewUsername.ToUpper());

            if (UsernameTaken)
                return BadRequest("Username Alraedy Taken");

            User.UserName = EUNVM.NewUsername;
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        //[Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateProfilePicture(string Username, IFormFile Picture)
        {
            //Check Image Exists
            var User = await _applicationDbContext.Users
                .FirstOrDefaultAsync(i => i.UserName == Username);

            if (User is null)
                return NotFound($"User Not Found");

            if (Picture is null)
                return BadRequest("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            //Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/Users",
                $"User_{Username}");

            var URL = await SaveFile(path, Picture);

            User.ProfilePicture = URL;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        //[Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveProfilePicture(string Username)
        {
            //Check Image Exists
            var User = await _applicationDbContext.Users
                .FirstOrDefaultAsync(i => i.UserName == Username);

            if (User is null)
                return NotFound($"User Not Found");

            
            User.ProfilePicture = null;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        //[Authorize("admin")]
        [HttpPost("[action]")]
        public async Task<IActionResult> EditRoles([FromBody]EditUserRolesViewModel EURVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var User = await _applicationDbContext.Users
                .FirstOrDefaultAsync(u => u.UserName == EURVM.Username);

            if (User is null)
                return NotFound("Username not found");

            var Roles = await _userManager.GetRolesAsync(User);

            //await _userManager.RemoveFromRolesAsync(User, Roles);
            var UserRoles = await _applicationDbContext.UserRoles
                .Where(ur => ur.UserId == User.Id)
                .ToListAsync();

            _applicationDbContext.UserRoles.RemoveRange(UserRoles);
            await _applicationDbContext.SaveChangesAsync();

            var DBRoles = await _applicationDbContext.Roles
                .Where(r => EURVM.Roles.Any(rvm => rvm == r.Name) && ALLOWED_ROLES.Any(ar => ar == r.Name))
                .ToListAsync();

            _applicationDbContext.UserRoles
                .AddRange(DBRoles.Select(r => new IdentityUserRole<string>() { 
                    UserId = User.Id,
                    RoleId = r.Id
                }));

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

    }
}
