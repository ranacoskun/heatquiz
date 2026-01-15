using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.QuestionChallenges;
using QuizAPI.Models.QuestionChallenges.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace QuizAPI.Controllers.QuestionChallengeController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class QuestionChallengeController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;

        public QuestionChallengeController(
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

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllTemplates()
        {
            var Challenges = await _applicationDbContext.QuestionChallengeTemplates
                .Include(c => c.Questions)
                .ThenInclude(q => q.ClickableQuestion)
                .Include(c => c.Questions)
                .ThenInclude(q => q.KeyboardQuestion)
                .ToListAsync();

            return Ok(_mapper.Map<List<QuestionChallengeTemplate>, List<QuestionChallengeTemplateViewModel>>(Challenges));
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetTemplate(int Id)
        {
            var Challenge = await _applicationDbContext.QuestionChallengeTemplates
                .Include(c => c.Questions)
                .ThenInclude(q => q.ClickableQuestion)
                .Include(c => c.Questions)
                .ThenInclude(q => q.KeyboardQuestion)
                .FirstOrDefaultAsync(c => c.Id == Id);

            return Ok(_mapper.Map<QuestionChallengeTemplate, QuestionChallengeTemplateViewModel>(Challenge));
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddTemplate([FromBody] QuestionChallengeTemplateViewModel TemplateVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            //Check Code not Null
            if(string.IsNullOrEmpty(TemplateVM.Code))
                return BadRequest("Code Cannot Be Null");

            //Check Code Uniqe
            var CodeExists = await _applicationDbContext.QuestionChallengeTemplates
                .AnyAsync(ct => ct.Code == TemplateVM.Code);

            if (CodeExists)
                return BadRequest("Code Already in Use");

            //Check Has Questions
            if (!TemplateVM.Questions.Any())
                return BadRequest("Please Add Questions");

            //Check Time is Positive
            if(TemplateVM.TimeInMinutes <= 0)
                return BadRequest("Time Can Only Positive");

            //Check all Questions Have Ids
            if (TemplateVM.Questions.Any(q => !q.KeyboardQuestionId.HasValue && !q.ClickableQuestionId.HasValue))
                return BadRequest("All Questions Should Have Ids");

            //Check Order is positive
            if (TemplateVM.Questions.All(q => q.Order <= 0))
                return BadRequest("Question Order Can Only Be Positive");

            //Check order is uniqe
            if (TemplateVM.Questions.Select(q => q.Order).Distinct().Count() != TemplateVM.Questions.Count)
                return BadRequest("Order Is Repeated");

            //Get Clickable Questions
            var ClickableQuestions = await _applicationDbContext.SimpleClickableQuestions
                .Where(q => TemplateVM.Questions.Any(qvm => qvm.ClickableQuestionId.HasValue && qvm.ClickableQuestionId.Value == q.Id))
                .ToListAsync();

            if (ClickableQuestions.Count != TemplateVM.Questions.Count(qvm => qvm.ClickableQuestionId.HasValue))
                return BadRequest("Not All Clickable Questions Exist");

            //Get Keyboard Questions 
            var KeyboardQuestions = await _applicationDbContext.KeyboardQuestion
                .Where(q => TemplateVM.Questions.Any(qvm => qvm.KeyboardQuestionId.HasValue && qvm.KeyboardQuestionId.Value == q.Id))
                .ToListAsync();

            if (KeyboardQuestions.Count != TemplateVM.Questions.Count(qvm => qvm.KeyboardQuestionId.HasValue))
                return BadRequest("Not All Keyboard Questions Exist");

            var ChallengeTemplate = new QuestionChallengeTemplate()
            {
                Code = TemplateVM.Code,
                TimeInMinutes = TemplateVM.TimeInMinutes
            };

            //Add Clickable Questions
            ChallengeTemplate.Questions.AddRange(TemplateVM.Questions.Where(q => q.ClickableQuestionId.HasValue).Select(q => new QuestionChallengeQuestion()
            {
                ClickableQuestionId = q.ClickableQuestionId.Value,
                Order = q.Order
            }));

            //Add Keyboard Questions
            ChallengeTemplate.Questions.AddRange(TemplateVM.Questions.Where(q => q.KeyboardQuestionId.HasValue).Select(q => new QuestionChallengeQuestion()
            {
                KeyboardQuestionId = q.KeyboardQuestionId.Value,
                Order = q.Order
            }));

            _applicationDbContext.QuestionChallengeTemplates.Add(ChallengeTemplate);
            await _applicationDbContext.SaveChangesAsync();

            var Challenges = await _applicationDbContext.QuestionChallengeTemplates
                .Include(c => c.Questions)
                .ThenInclude(q => q.ClickableQuestion)
                .Include(c => c.Questions)
                .ThenInclude(q => q.KeyboardQuestion)
                .ToListAsync();

            return Ok(_mapper.Map<List<QuestionChallengeTemplate>, List<QuestionChallengeTemplateViewModel>>(Challenges));

        }

        [HttpDelete("[action]/{TemplateId}")]
        public async Task<IActionResult> RemoveTemplate(int TemplateId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            var Template = await _applicationDbContext.QuestionChallengeTemplates
                .FirstOrDefaultAsync(t => t.Id == TemplateId);

            if (Template is null)
                return Ok("Template Not Found");

            _applicationDbContext.QuestionChallengeTemplates.Remove(Template);
            await _applicationDbContext.SaveChangesAsync();

            var Challenges = await _applicationDbContext.QuestionChallengeTemplates
                .Include(c => c.Questions)
                .ThenInclude(q => q.ClickableQuestion)
                .Include(c => c.Questions)
                .ThenInclude(q => q.KeyboardQuestion)
                .ToListAsync();

            return Ok(_mapper.Map<List<QuestionChallengeTemplate>, List<QuestionChallengeTemplateViewModel>>(Challenges));

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditTemplateCode([FromBody] QuestionChallengeTemplateViewModel TemplateVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            var Template = await _applicationDbContext.QuestionChallengeTemplates
                .FirstOrDefaultAsync(t => t.Id == TemplateVM.Id);

            if (Template is null)
                return Ok("Template Not Found");

            //Check Code not Null
            if (string.IsNullOrEmpty(TemplateVM.Code))
                return BadRequest("Code Cannot Be Null");

            //Check Code Uniqe
            var CodeExists = await _applicationDbContext.QuestionChallengeTemplates
                .AnyAsync(ct => ct.Code == TemplateVM.Code && ct.Id != TemplateVM.Id);

            if (CodeExists)
                return BadRequest("Code Already in Use");

            Template.Code = TemplateVM.Code;

            await _applicationDbContext.SaveChangesAsync();

            var Challenges = await _applicationDbContext.QuestionChallengeTemplates
                .Include(c => c.Questions)
                .ThenInclude(q => q.ClickableQuestion)
                .Include(c => c.Questions)
                .ThenInclude(q => q.KeyboardQuestion)
                .ToListAsync();

            return Ok(_mapper.Map<List<QuestionChallengeTemplate>, List<QuestionChallengeTemplateViewModel>>(Challenges));

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditTemplateTiming([FromBody] QuestionChallengeTemplateViewModel TemplateVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            var Template = await _applicationDbContext.QuestionChallengeTemplates
                .FirstOrDefaultAsync(t => t.Id == TemplateVM.Id);

            if (Template is null)
                return Ok("Template Not Found");

            //Check Time is Positive
            if (TemplateVM.TimeInMinutes <= 0)
                return BadRequest("Time Can Only Positive");

            Template.TimeInMinutes = TemplateVM.TimeInMinutes;

            await _applicationDbContext.SaveChangesAsync();

            var Challenges = await _applicationDbContext.QuestionChallengeTemplates
                .Include(c => c.Questions)
                .ThenInclude(q => q.ClickableQuestion)
                .Include(c => c.Questions)
                .ThenInclude(q => q.KeyboardQuestion)
                .ToListAsync();

            return Ok(_mapper.Map<List<QuestionChallengeTemplate>, List<QuestionChallengeTemplateViewModel>>(Challenges));

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AssignNewQuestion([FromBody] QuestionChallengeTemplateViewModel TemplateVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            //Check Template Exists
            var Template = await _applicationDbContext.QuestionChallengeTemplates
                .Include(t => t.Questions)
                .FirstOrDefaultAsync(t => t.Id == TemplateVM.Id);

            if (Template is null)
                return Ok("Template Not Found");

            //Check There are Questions 
            if (!TemplateVM.Questions.Any())
                return Ok("No Question Added");

            //Check all Questions Have Ids
            if (TemplateVM.Questions.Any(q => !q.KeyboardQuestionId.HasValue && !q.ClickableQuestionId.HasValue))
                return BadRequest("All Questions Should Have Ids");

            //Get Clickable Question
            var ClickableQuestion = await _applicationDbContext.SimpleClickableQuestions
                .FirstOrDefaultAsync(q => TemplateVM.Questions.Any(qvm => qvm.ClickableQuestionId.HasValue && qvm.ClickableQuestionId.Value == q.Id));

            //Get Keyboard Questions 
            var KeyboardQuestion = await _applicationDbContext.KeyboardQuestion
                .FirstOrDefaultAsync(q => TemplateVM.Questions.Any(qvm => qvm.KeyboardQuestionId.HasValue && qvm.KeyboardQuestionId.Value == q.Id));

            if (ClickableQuestion is null && KeyboardQuestion is null)
                return Ok("No Question Exists");

            if(ClickableQuestion != null)
            {
                Template.Questions.Add(new QuestionChallengeQuestion()
                {
                    ClickableQuestion = ClickableQuestion,
                    Order = Template.Questions.Any() ? Template.Questions.Max(q => q.Order) + 1 : 1
                });
            }
            else
            {
                Template.Questions.Add(new QuestionChallengeQuestion()
                {
                    KeyboardQuestion = KeyboardQuestion,
                    Order = Template.Questions.Max(q => q.Order) + 1
                });
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeassignNewQuestion([FromBody] QuestionChallengeTemplateViewModel TemplateVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            //Check Template Exists
            var Template = await _applicationDbContext.QuestionChallengeTemplates
                .Include(t => t.Questions)
                .ThenInclude(q => q.ClickableQuestion)
                .Include(t => t.Questions)
                .ThenInclude(q => q.KeyboardQuestion)
                .FirstOrDefaultAsync(t => t.Id == TemplateVM.Id);


            if (Template is null)
                return Ok("Template Not Found");

            //Check all Questions Have Ids
            if (TemplateVM.Questions.Any(q => !q.KeyboardQuestionId.HasValue && !q.ClickableQuestionId.HasValue))
                return BadRequest("All Questions Should Have Ids");

            //Get Clickable Question
            var Question = Template.Questions
                .FirstOrDefault(q => 
                TemplateVM.Questions.Any(qvm => qvm.Id == q.Id));

            if (Question is null)
                return Ok("No Question Exists");

            Template.Questions.Remove(Question);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RearrangeQuestion([FromBody] RearrangeChallengeQuestionViewModel TemplateVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            //Check Template Exists
            var Template = await _applicationDbContext.QuestionChallengeTemplates
                .Include(t => t.Questions)
                .ThenInclude(q => q.ClickableQuestion)
                .Include(t => t.Questions)
                .ThenInclude(q => q.KeyboardQuestion)
                .FirstOrDefaultAsync(t => t.Id == TemplateVM.Id);

            if (Template is null)
                return Ok("Template Not Found");

            var Question = Template.Questions
                .FirstOrDefault(q => TemplateVM.Questions.Any(qdb => qdb.Id == q.Id));

            if (Question is null)
                return Ok("Question Does Not Exist");

            var QuestionOrders = Template.Questions
                .Select(q => q.Order)
                .OrderBy(o => o);


            Expression<Func<int, bool>> MinExpression = (qo) => (qo <= Question.Order - 1);
            Expression<Func<int, bool>> MaxExpression = (qo) => (qo >= Question.Order + 1);

            var ChosenExpression = TemplateVM.Forward ? MaxExpression : MinExpression;

            var AroundMaxOrder = TemplateVM.Forward ? QuestionOrders.FirstOrDefault(ChosenExpression.Compile()) : QuestionOrders.LastOrDefault(ChosenExpression.Compile());

            var ToBeShiftedQuestion = Template.Questions
                .FirstOrDefault(q => q.Order == AroundMaxOrder);

            Question.Order = AroundMaxOrder != 0 ? Question.Order + (TemplateVM.Forward ? 1 : -1) : Question.Order;

            if (ToBeShiftedQuestion != null)
                ToBeShiftedQuestion.Order = ToBeShiftedQuestion.Order + (TemplateVM.Forward ? -1 : 1);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
            
        }

        [HttpPost("[action]/{TemplateId}")]
        public async Task<IActionResult> AddSession(int TemplateId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            var Template = await _applicationDbContext.QuestionChallengeTemplates
                .Include(t => t.Questions)
                .ThenInclude(q => q.ClickableQuestion)
                .Include(t => t.Questions)
                .ThenInclude(q => q.KeyboardQuestion)
                .FirstOrDefaultAsync(t => t.Id == TemplateId);

            if (Template is null)
                return BadRequest("Template Not Found");

            var Session = new ChallengeSession()
            {
                Template = Template,
                Active = true
            };

            _applicationDbContext.ChallengeSessions.Add(Session);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<ChallengeSession, ChallengeSessionViewModel>(Session));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EndSession([FromBody] ChallengeSessionViewModel SessionVM)
        {
            var Session = await _applicationDbContext.ChallengeSessions
                .Include(s => s.Players)
                .FirstOrDefaultAsync(s => s.Id == SessionVM.Id);

            if (Session is null)
                return Ok("Session Not Found");

            if (!Session.Active)
                return Ok();

            Session.Active = false;

            var Results = Session.Players
                .Where(p => !string.IsNullOrEmpty(p.Score))
                .Select(p => new QuestionChallengeSingleResult()
                {
                    SessionId = Session.Id,
                    PlayerId = p.Id,
                    Result = p.Score
                }).ToList();

            Session.Results.AddRange(Results);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<ChallengeSession, ChallengeSessionViewModel>(Session));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllSessions()
        {
            var Sessions = await _applicationDbContext.ChallengeSessions
                .Include(s => s.Template)
                .ThenInclude(c => c.Questions)
                .ThenInclude(q => q.ClickableQuestion)
                .Include(s => s.Template)
                .ThenInclude(c => c.Questions)
                .ThenInclude(q => q.KeyboardQuestion)
                .Include(s => s.Players)
                .Include(s => s.Results)
                .Where(s => s.Active)
                .ToListAsync();

            return Ok(_mapper.Map<List<ChallengeSession>, List<ChallengeSessionViewModel>>(Sessions));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllSessionsHistory()
        {
            var Sessions = await _applicationDbContext.ChallengeSessions
                .Include(s => s.Template)
                .ThenInclude(c => c.Questions)
                .ThenInclude(q => q.ClickableQuestion)
                .Include(s => s.Template)
                .ThenInclude(c => c.Questions)
                .ThenInclude(q => q.KeyboardQuestion)
                .Include(s => s.Players)
                .Include(s => s.Results)
                .Where(s => !s.Active)
                .ToListAsync();

            return Ok(_mapper.Map<List<ChallengeSession>, List<ChallengeSessionViewModel>>(Sessions));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ParticipateInChallenge([FromBody] ParticipateInChallengeViewModel ParticipateVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            var Session = await _applicationDbContext.ChallengeSessions
                .Include(s => s.Players)
                .FirstOrDefaultAsync(s => s.Id == ParticipateVM.SessionId);

            if (Session is null)
                return BadRequest("Session Not Found");

            if (!Session.Active)
                return Ok("Session Ended");

            //Check Name Unique
            if (Session.Players.Any(p => p.Name == ParticipateVM.Name))
                return BadRequest("Name Used");

            //Create New Player
            var NewPlayer = new ChallengePlayer()
            {
                Session = Session,
                Name = ParticipateVM.Name
            };

            Session.Players.Add(NewPlayer);

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<ChallengeSession, ChallengeSessionViewModel>(Session));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SubmitScore([FromBody] ChallengePlayerSubmit SubmitVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            //Get Session
            var Session = await _applicationDbContext.ChallengeSessions
                .FirstOrDefaultAsync(s => s.Players.Any(p => p.Id == SubmitVM.PlayerId));

            if (Session is null)
                return BadRequest("Session Not Found");

            //Check Has Scores
            if (!SubmitVM.Scores.Any())
                return BadRequest("No Scores Not Submitted");

            if(Session.Active)
            {
                var Player = Session.Players.FirstOrDefault(p => p.Id == SubmitVM.PlayerId);

                Player.Score = string.Join(',', SubmitVM.Scores.Select(s => $" {s.Order} : {s.Score} "));
            }
            else
            {
                Session.Results.Add(new QuestionChallengeSingleResult()
                {
                    PlayerId = SubmitVM.PlayerId,
                    Result = string.Join(',', SubmitVM.Scores.Select(s => $" {s.Order} : {s.Score} "))
                });
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
