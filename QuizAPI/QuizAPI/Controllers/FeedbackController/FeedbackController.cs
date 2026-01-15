using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;
using QuizAPI.Models.Feedback;
using QuizAPI.Models.Information;
using QuizAPI.Models.Information.ViewModels;
using QuizAPI.Models.Questions;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Controllers.QuestionsController.SimpleClickableController;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.FeedbackController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class FeedbackController : Controller
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;
        private readonly string SECRET = "XAyCAwQFMgcIWStADu0ODwrA";
        private readonly int PLAYER_FAILY_FEEDBACK_LIMIT = 10;

        IHttpContextAccessor _httpContextAccessor;

        public FeedbackController(
            IMapper mapper,
            ApplicationDbContext applicationDbContext,
            UserManager<BaseUser> userManager,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _mapper = mapper;
            _applicationDbContext = applicationDbContext;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;

        }
        public IActionResult Index()
        {
            return Ok();
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetQuestionFeedback(int Id)
        {
            var Question = await _applicationDbContext.QuestionBase
                .Include(q => q.StudentFeedback)

                .FirstOrDefaultAsync(q => q.Id == Id);

            if (Question is null)
                return NotFound("Question not found");

            return Ok(_mapper.Map<List<FeedbackQuestionViewModel>>(
                Question.StudentFeedback.Where(f => !f.IsArchived).OrderByDescending(f => f.DateCreated)));
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetQuestionFeedbackArchive(int Id)
        {
            var Question = await _applicationDbContext.QuestionBase
                .Include(q => q.StudentFeedback)
                .Include(q => q.StudentFeedbackEvents)
                .ThenInclude(e => e.EventHolder)
                .FirstOrDefaultAsync(q => q.Id == Id);

            if (Question is null)
                return NotFound("Question not found");

            return Ok(new {
                Archive = _mapper.Map<List<FeedbackQuestionViewModel>>(Question.StudentFeedback.OrderByDescending(f => f.DateCreated).Where(f => f.IsArchived)),
                Events = _mapper.Map<List<FeedbackQuestionEventViewModel>>(Question.StudentFeedbackEvents.OrderByDescending(f => f.DateCreated)),
            });
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> GetFeedback([FromBody] FeedbackSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data invalid");

            var user = await GetUser(_httpContextAccessor, _applicationDbContext);

            if (user is null)
                return BadRequest("User not found");

            DateTime From = DateTime.Now;
            DateTime To = DateTime.Now;

            
            if (!string.IsNullOrEmpty(VM.FromDate) && !string.IsNullOrEmpty(VM.ToDate))
            {
                try
                {
                    From = DateTime.ParseExact(VM.FromDate, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                    To = DateTime.ParseExact(VM.ToDate, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                }
                catch
                {
                    return BadRequest("invalid date format");
                }
            }

            var Questions = await _applicationDbContext.QuestionBase
                .Include(q => q.StudentFeedback)
                .Include(q => q.AddedBy)
                .Where(q =>
                q.DataPoolId == VM.DataPoolId &&
                q.StudentFeedback
                .Any(stf => stf.DateCreated >= From && stf.DateCreated<= To))
                .ToListAsync();

            var questionsSorted = Questions
                .OrderByDescending((q) => q.StudentFeedback.OrderByDescending(stf => stf.DateCreated).First().DateCreated)
                .Select(q => new {
                    data = _mapper.Map<QuestionBaseViewModel>(q),
                    type = OBJECT_TYPE.QUESTION,
                    feedback = _mapper.Map
                    <List<FeedbackQuestionViewModel>>(
                        q.StudentFeedback.Where(c =>
                            c.DateCreated >= From && c.DateCreated <= To
                        )
                        .OrderByDescending(f => f.DateCreated)
                    )
                })
                .ToList();

            //Update last seen in notifications subscribers
            var notificationSubscriber = await _applicationDbContext.DatapoolNotificationSubscriptions
                .FirstOrDefaultAsync(a => a.UserId == user.Id && a.DatapoolId == VM.DataPoolId);

            if(notificationSubscriber != null)
            {
                notificationSubscriber.LastSeen = DateTime.Now;

                await _applicationDbContext.SaveChangesAsync();
            }

            return Ok(questionsSorted);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddStudentFeedback(int QuestionId, string Feedback, string Player)
        {
            var Question = await _applicationDbContext.QuestionBase
                .Include(q => q.StudentFeedback)
                
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Question not found");

           
            if (string.IsNullOrEmpty(Feedback) || Feedback.Length > 500)
                return BadRequest("Please provide proper feedback");

            var player_exists = await _applicationDbContext.QuestionStatistic
                .AnyAsync(s => s.Player == Player);

            if (!player_exists)
                return BadRequest("Player never played a game");

            //Feedback Limit

            var feedback = new FeedbackQuestion() { 
            Player = Player,
            QuestionId = Question.Id,
            FeedbackContent = Feedback,
            DataPoolId = Question.DataPoolId
            };

            _applicationDbContext.QuestionFeedback.Add(feedback);
            await _applicationDbContext.SaveChangesAsync();

            //Send emails to subscribers
            var Subscribers = await _applicationDbContext.DatapoolNotificationSubscriptions
                .Where(a => a.DatapoolId == Question.DataPoolId)
                .Include(a => a.User)
                .ToListAsync();



            return Ok("Success");
        }

        

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveFeedback(int FeedbackId)
        {
            var Feedback = await _applicationDbContext.QuestionFeedback
                .FirstOrDefaultAsync(f => f.Id == FeedbackId);

            if (Feedback is null)
                return NotFound("Feedback not found");

            _applicationDbContext.QuestionFeedback.Remove(Feedback);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteFeedback([FromBody] QuestionBaseViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data not valid");

            var question = await _applicationDbContext.QuestionBase
                .Include(q => q.StudentFeedback)
                .Include(q => q.StudentFeedbackEvents)
                .FirstOrDefaultAsync(q => q.Id == VM.Id);

            if (question is null)
                return NotFound("Question not found");

            var Feedback = question.StudentFeedback.Where(f => f.IsArchived).ToList();

            var eventHolder = await GetUser(_httpContextAccessor, _applicationDbContext);

            question.StudentFeedbackEvents.Add(new FeedbackQuestionEvent()
            {
                DataPoolId = question.DataPoolId,
                QuestionId = question.Id,
                
                RecordsCount = Feedback.Count,

                EventHolderId = eventHolder.Id
            });

            _applicationDbContext.QuestionFeedback.RemoveRange(Feedback);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> ArchiveFeedback(List<int> FeedbackIds)
        {
            var Feedback = await _applicationDbContext.QuestionFeedback
                .Where(f => FeedbackIds.Any(id => id == f.Id))
                .ToListAsync();

            if (Feedback.Count != FeedbackIds.Distinct().Count())
                return NotFound("Some feedback not found");

            foreach(var f in Feedback)
            {
                f.IsArchived = true;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> ReferenceQuestion(int Id)
        {
            var question = await _applicationDbContext.QuestionBase

                .FirstOrDefaultAsync(q => q.Id == Id);

            if (question is null)
                return NotFound("Question not found");

            var data = new DecryptedData()
            {
                Type = OBJECT_TYPE.QUESTION,
                Id = question.Id,
            };

            var dataString = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            var encryptedDataString = EncryptString(SECRET, dataString);

            return Ok(encryptedDataString);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DecryptObject([FromBody] FeedbackSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data invalid");

            //try catch
            var encryptedDataString = "";

            try
            {
                encryptedDataString = DecryptString(SECRET, VM.encryption);
            }
            catch
            {

            }
            var dataJSON = Newtonsoft.Json.JsonConvert.DeserializeObject<DecryptedData>(encryptedDataString);

            if (dataJSON is null)
                return NotFound("Data not found");

            dynamic data = null;

            if(dataJSON.Type == OBJECT_TYPE.QUESTION)
            {
                var question = await _applicationDbContext.QuestionBase
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)
                .Include(q => q.AddedBy)
                .FirstOrDefaultAsync(q => q.Id == dataJSON.Id);

                if (question is null)
                    return NotFound("Question not found");

                return Ok(new
                {
                    data = _mapper.Map<QuestionBaseViewModel>(question),
                    type = dataJSON.Type
                });
            }

            return Ok();
        }

         class DecryptedData
        {
            public int Id { get; set; }
            public OBJECT_TYPE Type { get; set; }
        }

        enum OBJECT_TYPE
        {
            QUESTION = 0,
            SERIES = 2
        }

    }
}
