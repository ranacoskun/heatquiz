using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Controllers.ApplicationUserController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class ApplicationUserController : Controller 
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;

        public ApplicationUserController(
            IMapper mapper,
            ApplicationDbContext applicationDbContext
        )
        {
            _mapper = mapper;
            _applicationDbContext = applicationDbContext;
        }
        public IActionResult Index()
        {
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddUser([FromBody]ApplicationUserViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data is Invalid");

            //Check Nickname Not Taken 
            var NicknameTaken = await _applicationDbContext.ApplicationUsers
                .AnyAsync(u => u.NickName.ToUpper() == VM.NickName.ToUpper());

            if (NicknameTaken)
                return BadRequest("Nickname Taken, Choose Different Nickname");

            //Create User
            var User = new ApplicationUser()
            {
                NickName = VM.NickName,
                Code = Guid.NewGuid().ToString()
            };

            _applicationDbContext.ApplicationUsers.Add(User);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(new {
                Code = User.Code
            });
        }

        [HttpPost("[action]/{Nickname}")]
        public async Task<IActionResult> ChangeNickName([FromBody] ApplicationUserViewModel UserVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check User Exists
            var User = await _applicationDbContext.ApplicationUsers
                .FirstOrDefaultAsync(u => u.Id == UserVM.Id);

            if (User is null)
                return NotFound($"User {UserVM.Id} Not Found");

            //Check Nickname Not Null
            if (string.IsNullOrEmpty(UserVM.NickName))
                return BadRequest("Name Can't Be Empty");

            //Check Nickname Not Taken 
            var NicknameTaken = await _applicationDbContext.ApplicationUsers
                .AnyAsync(u => u.Id != UserVM.Id && u.NickName == UserVM.NickName);

            if (NicknameTaken)
                return BadRequest("Nickname Taken, Choose Different Nickname");

            User.NickName = UserVM.NickName;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<ApplicationUser, ApplicationUserViewModel>(User));
        }
    }
}
