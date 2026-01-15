using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;
using QuizAPI.Models.KeyShare;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.KeyShareController 
{

    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class KeyShareController : Controller
    {
        private readonly IMapper _mapper;
        IHttpContextAccessor _httpContextAccessor;

        private readonly ApplicationDbContext _applicationDbContext;

        public KeyShareController(
            IMapper mapper,
            ApplicationDbContext applicationDbContext,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _mapper = mapper;
            _applicationDbContext = applicationDbContext;
            _httpContextAccessor = httpContextAccessor;

        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ShareKey([FromBody] KeyShareViewModel VM)
        {
            if(!ModelState.IsValid)
                return BadRequest("Invalid data");

            if (VM.Receiver == VM.Sender)
            {
                return BadRequest("Receiver and Sender cannot be the same!");
            }

            //Check if sender/receiver exists
            var senderExists = await _applicationDbContext.QuestionStatistic
                .AnyAsync(s => s.Player == VM.Sender);

            if (!senderExists)
            {
                return BadRequest("Sender does not exist");
            }

            var receiverExists = await _applicationDbContext.QuestionStatistic
                .AnyAsync(s => s.Player == VM.Receiver);

            if (!receiverExists)
            {
                return BadRequest("Receiver does not exist");
            }

            //Delete already existing 
            var ExistingKeys = await _applicationDbContext.KeyShare
                .Where(ks => ks.Receiver == VM.Receiver && ks.Sender == VM.Sender)
                .ToListAsync();

            _applicationDbContext.KeyShare.RemoveRange(ExistingKeys);
            await _applicationDbContext.SaveChangesAsync();

            var KS = new KeyShare()
            {
                Sender = VM.Sender,
                Receiver = VM.Receiver
            };

            _applicationDbContext.KeyShare.Add(KS);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();


        }

        [HttpGet("[action]/{Me}")]
        public async Task<IActionResult> GetMyReceivedKeys(string Me)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            //Clean Old Keys
            var KSs_Old = await _applicationDbContext.KeyShare
                .Where(ks => ks.Receiver == Me && ks.DateCreated<DateTime.Now.AddMinutes(-5))
                .ToListAsync();

            _applicationDbContext.KeyShare.RemoveRange(KSs_Old);
            await _applicationDbContext.SaveChangesAsync();

            //Get Up to date Keys
            var KSs = await _applicationDbContext.KeyShare
                .Where(ks => ks.Receiver == Me && ks.DateCreated >= DateTime.Now.AddMinutes(-5))
                .ToListAsync();

            return Ok(_mapper.Map<List<KeyShareViewModel>>(KSs));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ApproveKey([FromBody] ApproveKeyShareViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            //Clean Keys
            var KSs_Old = await _applicationDbContext.KeyShare
                .Where(ks => ks.Receiver == VM.Me)
                .ToListAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SetKeyOnDevice(string oldKey, string newKey)
        {
            BaseUser current_user = null;

            try
            {
                current_user = await GetUser(_httpContextAccessor, _applicationDbContext);
            }
            catch
            {

            }

            if(current_user is null)
                return BadRequest("User not found");

            var LinkedKeys = await _applicationDbContext.UserLinkedPlayerKeys
                .Where(k => k.UserId == current_user.Id)
                .ToListAsync();

            if(LinkedKeys.All(k => k.PlayerKey != oldKey && k.PlayerKey != newKey))
                return BadRequest("Keys non-existent");


            var statistics_old = await _applicationDbContext.QuestionStatistic
                .Where(s => s.Player == oldKey)
                .ToListAsync();

            foreach(var s in statistics_old)
            {
                s.Player = newKey;
            }

            var existingLinkedKey = LinkedKeys.FirstOrDefault(k => k.PlayerKey == oldKey);

            if (existingLinkedKey != null)
            {
                _applicationDbContext.UserLinkedPlayerKeys.Remove(existingLinkedKey);
            }


            await _applicationDbContext.SaveChangesAsync();

            return Ok();
         }


    }
}
