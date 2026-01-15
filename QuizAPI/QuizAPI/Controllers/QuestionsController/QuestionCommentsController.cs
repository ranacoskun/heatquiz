using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;
using QuizAPI.Models.Questions;
using QuizAPI.Models.Questions.QuestionComment;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;


namespace QuizAPI.Controllers.QuestionsController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class QuestionCommentsController : Controller 
    {
        private readonly IMapper _mapper;
        public const string FILES_PATH = "http://167.86.98.171:6001/Files/";
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;
        IHttpContextAccessor _httpContextAccessor;

        public QuestionCommentsController(
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
        public async Task<IActionResult> GetQuestionComments(int Id)
        {
            var Question = await _applicationDbContext.QuestionBase
                .Include(q => q.CommentSection)
                .ThenInclude(cs => cs.Comments)
                .ThenInclude(c => c.AddedBy)

                .Include(q => q.CommentSection)
                .ThenInclude(cs => cs.Comments)
                .ThenInclude(c => c.Tages)
                .ThenInclude(t => t.User)

                .Include(q => q.CommentSection)
                .ThenInclude(cs => cs.Tages)
                .ThenInclude(t => t.User)

                .FirstOrDefaultAsync(q => q.Id == Id);

            if (Question is null)
                return NotFound("Question not found");


            var user = await GetUser(_httpContextAccessor, _applicationDbContext);

            var comment_section_tag = Question.CommentSection != null ?
                Question.CommentSection.Tages.FirstOrDefault(t => t.UserId == user.Id) : null;

            if(comment_section_tag != null)
            {
                comment_section_tag.LastSeen = DateTime.Now;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<QuestionBaseCommentsViewModel>(Question));
        }

        [HttpGet("[action]/{CommentSectionId}")]
        public async Task<IActionResult> RegisterSeenNotification(int CommentSectionId)
        {
            var user = await GetUser(_httpContextAccessor, _applicationDbContext);

            if (user is null)
                return NotFound("Not registered");

            var cs = await _applicationDbContext.QuestionCommentSection
                .Include(csa => csa.Tages)
                .FirstOrDefaultAsync(csa => csa.Id == CommentSectionId && csa.Tages.Any(t => t.UserId == user.Id));

            if (cs is null)
                return NotFound("Comment section not found");

            var tag = cs.Tages.FirstOrDefault(t => t.UserId == user.Id);

            tag.LastSeen = DateTime.Now;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetUnseenCommentsNumber()
        {
            var user = await GetUser(_httpContextAccessor, _applicationDbContext);

            if (user is null)
                return Ok(new { 
                Count = "not registered"
                });           

            var comments = await _applicationDbContext.QuestionComments
                .Include(c => c.AddedBy)
               
                    .Include(c => c.CommentSection)
                    .ThenInclude(cs => cs.Tages)
                    .Include(c => c.CommentSection)
                    .ThenInclude(cs => cs.Question)
                    .Where(c =>
                    c.AddedById != user.Id
                    &&
                    c.CommentSection.Tages
                    .Any(t => t.UserId == user.Id && t.LastSeen.Value <= c.DateCreated))
                    
                    .ToListAsync();

            var notificationSubscribtions = await _applicationDbContext.DatapoolNotificationSubscriptions
                .Where(a => a.UserId == user.Id)
                .ToListAsync();

            var StudentFeedback = await _applicationDbContext.QuestionFeedback
                .Where(f => notificationSubscribtions
                .Any(a => a.DatapoolId == f.DataPoolId && f.DateCreated >= DateTime.Today))
                .Include(r => r.Question)
                .Select(r => new
                {
                    Id = r.Id,
                    Player = r.Player,
                    FeedbackContent = r.FeedbackContent,
                    DateCreated = r.DateCreated,
                    New = r.DateCreated > notificationSubscribtions.FirstOrDefault(a => a.DatapoolId == r.DataPoolId).LastSeen,
                    Question = new
                    {
                        Code = r.Question.Code,
                        Type = r.Question.Type,
                        Id = r.Question.Id,
                        Base_ImageURL = $"{FILES_PATH}/{r.Question.Base_ImageURL}"
                    }
                })
                .OrderByDescending(a => a.DateCreated)
                .ToListAsync();

            return Ok(new
            {
                Count = comments.GroupBy(c => c.CommentSection).Count() + StudentFeedback.Count(a => a.New),
                CountInactive = comments.GroupBy(c => c.CommentSection).Count() + StudentFeedback.Count(),

                Comments = comments.GroupBy(c => c.CommentSection).Select(g => {
                    var first_comment = g.OrderByDescending(a => a.DateCreated).FirstOrDefault();

                    return new { 
                    AddedByName = first_comment.AddedBy.Name,
                    AddedByProfilePicture = first_comment.AddedBy.ProfilePicture != null ? $"{FILES_PATH}/{first_comment.AddedBy.ProfilePicture}" : null,

                    Text = first_comment.Text,
                    DateCreated = first_comment.DateCreated,

                    CommentSection = _mapper.Map<QuestionCommentSectionViewModel>(g.Key),

                    NumberOfComments = g.Count()
                    };
                }).OrderByDescending(a => a.DateCreated),

                StudentFeedback = StudentFeedback
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetComments([FromBody] GetCommentsViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var user = await GetUser(_httpContextAccessor, _applicationDbContext);

            if (user is null)
                return NotFound("Not authorized");

            var From = DateTime.ParseExact(VM.From, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            var To = DateTime.ParseExact(VM.To, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);

            var comments = await _applicationDbContext.QuestionComments
                .Where((c) =>
                 c.AddedById != user.Id
                    &&
                   c.CommentSection.Tages.Any(t => t.UserId == user.Id && (VM.GetUnseen ? (t.LastSeen.Value <= c.DateCreated || c.DateCreated >= DateTime.Now.AddHours(1)) : true))
                   &&
                    (VM.GetUnseen ?  (c.DateCreated >= From || c.DateCreated <= To) : true)
                ) 
                .Include(c => c.CommentSection)
                .ThenInclude(cs => cs.Question)
                .ThenInclude(q => q.Subtopic)
                .ThenInclude(st => st.Topic)

                .Include(c => c.CommentSection)
                .ThenInclude(cs => cs.Question)
                .ThenInclude(q => q.LevelOfDifficulty)

                .Include(c => c.CommentSection)
                .ThenInclude(cs => cs.Question)
                .ThenInclude(q => q.AddedBy)

                .Include(c => c.AddedBy)
                .GroupBy(c => c.CommentSection)
                .ToListAsync();

            return Ok(new
            {
                Count = comments.Count(),

                Comments = comments.Select(g => {
                    var first_comments = g.OrderByDescending(a => a.DateCreated).Take(10);

                    return new
                    {
                        Comments = first_comments.Select(a => new {
                            AddedByName = a.AddedBy.Name,
                            Text = a.Text,
                            DateCreated = a.DateCreated,
                        }).OrderByDescending(a => a.DateCreated).GroupBy(c => c.AddedByName).Select(b => new {
                            AddedByName = b.Key,
                            Comments = b.Select(cc => new {
                                Text = cc.Text,
                                DateCreated = cc.DateCreated,
                            })
                        }),
                       
                        CommentSection = _mapper.Map<QuestionCommentSectionViewModel>(g.Key),
                        NumberOfComments = g.Count(),

                        Commenters = g.Select(a => a.AddedBy)
                        .Select(s => s.Name)
                        .Distinct()
                    };
                }),
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetComments2([FromBody] GetCommentsViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var user = await GetUser(_httpContextAccessor, _applicationDbContext);

            if (user is null)
                return NotFound("Not authorized");

            var From = DateTime.ParseExact(VM.From, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            var To = DateTime.ParseExact(VM.To, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);

            var commentsSections = await _applicationDbContext.QuestionCommentSection
                .Where((cs) => 
                cs.Comments.Any(c => c.AddedById != user.Id 
                && 
                c.CommentSection.Tages.Any(t => t.UserId == user.Id)
                &&
                c.DateCreated >= From 
                &&
                c.DateCreated <= To))

                .Include(cs => cs.Question)
                .Include(cs => cs.Comments)
                .ThenInclude(c => c.AddedBy)
                .OrderByDescending(c => c.DateCreated)
                .ToListAsync();

            return Ok(commentsSections
                .Select(g => {
                var first_comment = g.Comments.OrderByDescending(a => a.DateCreated).FirstOrDefault();

                var cs = g;
                cs.Comments = g.Comments.Where(c => c.DateCreated >= From && c.DateCreated <= To).ToList();

                return new
                {
                    AddedByName = first_comment.AddedBy.Name,
                    AddedByProfilePicture = first_comment.AddedBy.ProfilePicture != null ? $"{FILES_PATH}/{first_comment.AddedBy.ProfilePicture}" : null,

                    Text = first_comment.Text,
                    DateCreated = first_comment.DateCreated,

                    CommentSection = _mapper.Map<QuestionCommentSectionViewModel>(cs),

                    NumberOfComments = g.Comments.Count()
                };
            }).OrderByDescending(a => a.DateCreated));
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionComment(int QuestionId, string Comment, bool IsLatex, List<string> Tags)
        {
            var Question = await _applicationDbContext.QuestionBase
                .Include(q => q.CommentSection)
                .ThenInclude(cs => cs.Comments)

                .Include(q => q.CommentSection)
                .ThenInclude(cs => cs.Tages)
                .ThenInclude(tg => tg.User)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);


            //Check question
            if (Question is null)
                return NotFound("Question not found");

            //Check tags unique
            if (Tags.Distinct().Count() != Tags.Count())
                return BadRequest("Tagged user(s) repeated");

            //Check user exists
            var Adder = await GetUser(_httpContextAccessor, _applicationDbContext);

            if (Adder is null)
                return NotFound("User not found");

            var TaggedUsers = new List<BaseUser>();

            foreach(var tag in Tags)
            {
                Console.WriteLine("TAG:" + tag);

                var tag_user = await _applicationDbContext.Users
                .FirstOrDefaultAsync(u => u.Name.ToUpper() == tag.ToUpper());

                if (tag_user is null)
                    return NotFound("Tagged user not found");

                TaggedUsers.Add(tag_user);
            }

            if (Question.CommentSection is null)
            {
                Question.CommentSection = new QuestionCommentSection()
                {
                    DataPoolId = Question.DataPoolId
                };
            }


            var non_existing_tagged_users = TaggedUsers.Where(tg =>
            !Question.CommentSection.Tages.Any(cstg => cstg.User.Id == tg.Id) && tg.Id != Adder.Id);

            //Update general tags
            Question.CommentSection.Tages.AddRange(non_existing_tagged_users.Select(a => new QuestionCommentSectionTag()
            {
                User = a,
                DataPoolId = Question.DataPoolId,
                LastSeen = DateTime.Now.AddDays(-1)
            }));

            if(!Question.CommentSection.Tages.Any(t => t.User.Id == Adder.Id))
            {
                Question.CommentSection.Tages.Add(new QuestionCommentSectionTag()
                {
                    User = Adder,
                    DataPoolId = Question.DataPoolId,
                    LastSeen = DateTime.Now.AddDays(-1)
                });
            }

            //add comments
            Question.CommentSection.Comments.Add(new QuestionComment()
            {
                AddedBy = Adder,
                IsLatex = IsLatex,
                Text = Comment,
                Tages = TaggedUsers.Where(tg => tg.Id != Adder.Id).Select(a => new QuestionCommentTag()
                {
                    User = a,
                    DataPoolId = Question.DataPoolId
                }).ToList(),
                DataPoolId = Question.DataPoolId
            });

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
