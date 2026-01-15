using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;
using QuizAPI.Models.Course;
using QuizAPI.Models.Course.ViewModels;
using QuizAPI.Models.DefaultValues.ImageAnswers;
using QuizAPI.Models.DefaultValues.ImageAnswers.ViewModels;
using QuizAPI.Models.DefaultValues.InterpretedImages;
using QuizAPI.Models.DefaultValues.InterpretedImages.ViewModel;
using QuizAPI.Models.DefaultValues.Keyboard;
using QuizAPI.Models.QuestionGroupsSubgroup;
using QuizAPI.Models.Questions;
using QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated;
using QuizAPI.Models.Questions.FreebodyDiagramQuestion;
using QuizAPI.Models.Questions.KeyboardQuestion;
using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using QuizAPI.Models.Questions.MultipleChoiceQuestion;
using QuizAPI.Models.Questions.MultipleChoiceQuestion.ViewModels;
using QuizAPI.Models.Questions.SimpleClickableQuestion;
using QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels;
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
    public class SimpleClickableController : Controller
    {
        private readonly IMapper _mapper;
        public const string FILES_PATH = "http://167.86.98.171:6001/Files/";
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;
        const int CLICKABLE_QUESTION_PARAMETER = +1;
        const int KEYBOARD_QUESTION_PARAMETER = +2;
        const int MUTLIPLE_CHOICE_QUESTION_PARAMETER = +3;
        const int ENERGY_BALANCE_QUESTION_PARAMETER = +4;
        const int ENERGY_BALANCE_QUESTION_PARAMETER_UPDATED = +5;
        const int FREE_BODY_DIAGRAM_QUESTION_PARAMETER = +6; 
        const int DIAGRAM_QUESTION_PARAMETER = +7; 
        const int PV_DIAGRAM_QUESTION_PARAMETER = +8; 

        private readonly string  PROF_WILKO_ID = "b19e0712-bd5c-4bb2-ac5b-7e1713765cdc";

        IHttpContextAccessor _httpContextAccessor;

        public SimpleClickableController(
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

        [HttpGet("[action]/{player}")]
        public async Task<IActionResult> TEST(string player)
        {
            var questions = await _applicationDbContext.QuestionStatistic
                .Where(s => s.Player == player && !string.IsNullOrEmpty(s.Key))
                .ToListAsync();

            var survey = await _applicationDbContext.QuestionnaireStatisticInstanceBase
                .Where(s => s.Player == player && !string.IsNullOrEmpty(s.Key))
                .ToListAsync();

            return Ok(new { q=questions, s = survey});
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetRandomQuestionsDataPool(int DatapoolId)
        {
            var questions = await _applicationDbContext.QuestionBase
                .Where(q => q.DataPoolId == DatapoolId)
                .OrderBy(r => Guid.NewGuid())
                .Take(5)
                .Select(q => new { 
                    Id = q.Id,
                    Type = q.Type,
                    Code = q.Code,
                })
                .ToListAsync();

            return Ok(questions);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetWorstPlayedQuestionsDataPool(string player, int DatapoolId)
        {
            var questions = await _applicationDbContext.QuestionStatistic
                .Include(s => s.Question)
                .Where(s => s.Player == player && s.Question.DataPoolId == DatapoolId)
                .GroupBy(a => a.Question)
                .Select(g => new
                {
                    Id = g.Key.Id,
                    Type = g.Key.Type,
                    Code = g.Key.Code,
                    FailRate = g.Count(e => !e.Correct) * (1 / (g.Count() + 0.0000001))
                })
                .Where(r => r.FailRate > 0)
                .OrderByDescending(r => r.FailRate)
                .Take(5)                
                .ToListAsync();

            return Ok(questions.Select(x => new {
                Id = x.Id,
                Type = x.Type,
                Code = x.Code
            }));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetDashboardInfo(string player, string DateFrom, string DateTo)
        {
            var d1 = DateTime.ParseExact(DateFrom, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            var d2 = DateTime.ParseExact(DateTo, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);

            var questions = await _applicationDbContext.QuestionStatistic
                .Include(s => s.Question)
                .Where(s => s.Player == player && s.DateCreated >= d1 && s.DateCreated <= d2)
                .GroupBy(a => a.Question)
                .Select(g => new
                {
                    Id = g.Key.Id,
                    Code = g.Key.Code,
                    ImageURL = Mapping.MappingProfile.FILES_PATH + "/" + g.Key.Base_ImageURL,
                    Total = g.Count(),
                })
                .OrderByDescending(r => r.Total)
                .Take(10)
                .ToListAsync();

            var questionsSuccess = await _applicationDbContext.QuestionStatistic
                .Include(s => s.Question)
                .Where(s => s.Player == player && s.DateCreated >= d1 && s.DateCreated <= d2)
                .GroupBy(a => a.Question)
                .Select(g => new
                {
                    Id = g.Key.Id,
                    Code = g.Key.Code,
                    ImageURL = Mapping.MappingProfile.FILES_PATH + "/" + g.Key.Base_ImageURL,
                    Total = g.Count(),
                    SuccessRate = g.Count(e => e.Correct) * (1/ g.Count())
                })
                .Where(r => r.SuccessRate > 0.5)
                .OrderByDescending(r => r.SuccessRate)
                .Take(10)
                .ToListAsync();

            var questionsFail = await _applicationDbContext.QuestionStatistic
                .Include(s => s.Question)
                .Where(s => s.Player == player && s.DateCreated >= d1 && s.DateCreated <= d2)
                .GroupBy(a => a.Question)
                .Select(g => new
                {
                    Id = g.Key.Id,
                    Code = g.Key.Code,
                    ImageURL = Mapping.MappingProfile.FILES_PATH + "/" + g.Key.Base_ImageURL,
                    Total = g.Count(),
                    FailRate = g.Count(e => !e.Correct) * (1 / g.Count())
                })
                .Where(r => r.FailRate > 0.3)
                .OrderByDescending(r => r.FailRate)
                .Take(10)
                .ToListAsync();

            var series = await _applicationDbContext.QuestionSeriesStatistic
                .Include(s => s.Series)
                .Where(s => s.Player == player && s.DateCreated >= d1 && s.DateCreated <= d2)
                .GroupBy(a => a.Series)
                .Select(g => new
                {
                    Id = g.Key.Id,
                    Code = g.Key.Code,
                    Total = g.Count(),
                })
                .OrderByDescending(r => r.Total)
                .Take(10)
                .ToListAsync();

            var qPDFLinks = await _applicationDbContext.QuestionPDFStatistic
                .Include(s => s.Question)
                .Where(s => s.Player == player && s.DateCreated >= d1 && s.DateCreated <= d2)
                .GroupBy(a => a.Question)
                .Select(g => new
                {
                    Id = g.Key.Id,
                    Code = g.Key.Code,
                    ImageURL = Mapping.MappingProfile.FILES_PATH + "/" + g.Key.Base_ImageURL,
                    URL = Mapping.MappingProfile.FILES_PATH + "/" + g.Key.PDFURL,
                    Total = g.Count(),

                    MapId = 0,
                    MapCode = 0
                })
                .OrderByDescending(r => r.Total)
                .ToListAsync();

            var mPDFLinks = await _applicationDbContext.CourseMapPDFStatistics
                .Include(s => s.Element)
                .ThenInclude(e => e.Map)
                .Where(s => s.Player == player && s.DateCreated >= d1 && s.DateCreated <= d2)
                .GroupBy(a => a.Element)
                .Select(g => new
                {
                    Id = g.Key.Id,
                    MapId = g.Key.Map.Id,
                    Code = g.Key.Title,
                    MapCode = g.Key.Map.Title,
                    URL = Mapping.MappingProfile.FILES_PATH + "/" + g.Key.PDFURL,
                    Total = g.Count(),
                    ImageURL =""
                })
                .OrderByDescending(r => r.Total)
                .ToListAsync();

            var topicsPerformance = await _applicationDbContext.QuestionStatistic
                .Include(s => s.Question)
                .ThenInclude(s => s.Subtopic)
                .ThenInclude(s => s.Topic)
                .Include(s => s.Question)
                .ThenInclude(s => s.DataPool)
                .Where(s => s.Player == player && s.DateCreated >= d1 && s.DateCreated <= d2)
                .Select(s => new
                {
                    Topic = s.Question.Subtopic.Topic.Name,
                    TopicId = s.Question.Subtopic.Topic.Id,
                    DataPool = s.Question.DataPool.Name,
                    DataPoolId = s.Question.DataPool.Id,
                    Correct = s.Correct,
                })
                .GroupBy(r => r.DataPoolId)
                .Select(g => new
                {
                    Id = g.Key,
                    Name = g.FirstOrDefault().DataPool,
                    Topics = g.GroupBy(f => f.TopicId).Select(x => new
                    {
                        Id = x.Key,
                        Name = x.FirstOrDefault().Topic,
                        Count = x.Count(),
                        CountCorrect = x.Count(o => o.Correct)
                    }).OrderBy(b => b.Name)
                }).OrderBy(b => b.Name)
                .ToListAsync();

            return Ok(new { 
                questions = questions,
                questionsFail = questionsFail,
                questionsSuccess = questionsSuccess,

                series = series,

                mPDFLinks = mPDFLinks,
                qPDFLinks = qPDFLinks,

                topicsPerformance = topicsPerformance
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CheckQuestionCodeExists([FromBody] QuestionBaseViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var codeExists = await _applicationDbContext.QuestionBase
                .AnyAsync(q => q.Code == VM.Code && q.DataPoolId == VM.DataPoolId);

            

            return Ok(new {
                CodeUsed = codeExists
            });
        }

        [HttpGet("[action]/{DatapoolId}")]
        public async Task<IActionResult> GetAllQuestions(int DatapoolId)
        {
            //Get Question
            var Question = await _applicationDbContext.SimpleClickableQuestions
                .Include(q => q.ClickImages)
                .ThenInclude(a => a.Answer)

                .Include(q => q.ClickCharts)
                .ThenInclude(a => a.Answer)
                .Where(a => a.DataPoolId == DatapoolId)
                .Select(q => new
                {
                    Type = q.Type,

                    Code = q.Code,
                    ImageURL = q.Base_ImageURL != null ? Mapping.MappingProfile.FILES_PATH + "/" + q.Base_ImageURL : null,
                    PDFURL = q.PDFURL != null ? Mapping.MappingProfile.FILES_PATH + "/" + q.PDFURL : null,

                    ImageWidth = q.Base_ImageURL_Width,
                    ImageHeight = q.Base_ImageURL_Height,

                    Subtopic = new
                    {
                        Name = q.Subtopic.Name
                    },

                    LevelOfDifficulty = new
                    {
                        Name = q.LevelOfDifficulty.Name
                    },

                    Information = q.Information,

                    ClickImages = q.ClickImages.Select(a => new {
                        Width = a.Width,
                        Height = a.Height,

                        X = a.X,
                        Y = a.Y,

                        Answer = new
                        {
                            Name = a.Answer.Name,
                            Group = new
                            {
                                Name = a.Answer.Group.Name
                            }
                        }
                    
                    }),
                    ClickCharts = q.ClickCharts.Select(a => new {
                        Width = a.Width,
                        Height = a.Height,

                        X = a.X,
                        Y = a.Y,

                        Answer = new
                        {
                            Code = a.Answer.Code,
                            Group = new
                            {
                                Name = a.Answer.Group.Name
                            }
                        }

                    }),

                })
                .ToListAsync();

            return Ok((Question));

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetQuestions_APP([FromBody] SCQGetQuestionForAppViewModel RequestVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Course = await _applicationDbContext.Courses
                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.ClickableSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.LevelOfDifficulty)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.ClickableSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.ClickImages)
                .ThenInclude(ci => ci.AnswerGroup)
                .ThenInclude(g => g.Images)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.ClickableSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.ClickCharts)
                .ThenInclude(ci => ci.AnswerGroup)
                .ThenInclude(g => g.Images)
                .ThenInclude(a => a.Left)

                 .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.ClickableSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.ClickCharts)
                .ThenInclude(ci => ci.AnswerGroup)
                .ThenInclude(g => g.Images)
                .ThenInclude(a => a.Right)

                 .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.ClickableSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.ClickCharts)
                .ThenInclude(ci => ci.AnswerGroup)
                .ThenInclude(g => g.Images)
                .ThenInclude(a => a.Jump)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.ClickableSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.ClickCharts)
                .ThenInclude(ci => ci.Answer)
                .ThenInclude(a => a.Jump)

                 .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.ClickableSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.ClickCharts)
                .ThenInclude(ci => ci.AnswerGroup)
                .ThenInclude(g => g.Images)
                .ThenInclude(a => a.RationOfGradients)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.ClickableSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.ClickCharts)
                .ThenInclude(ci => ci.Answer)
                .ThenInclude(a => a.Left)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.ClickableSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.ClickCharts)
                .ThenInclude(ci => ci.Answer)
                .ThenInclude(a => a.Right)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.ClickableSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.ClickCharts)
                .ThenInclude(ci => ci.Answer)
                .ThenInclude(a => a.RationOfGradients)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.KeyboardSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.Keyboard)
                .ThenInclude(k => k.NumericKeys)
                .ThenInclude(n => n.NumericKey)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.KeyboardSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.Keyboard)
                .ThenInclude(k => k.VariableKeyImages)
                .ThenInclude(n => n.Image)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.KeyboardSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.Keyboard)
                .ThenInclude(k => k.VariableKeys)
                .ThenInclude(n => n.VariableKey)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.KeyboardSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(ae => ae.NumericKey)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.KeyboardSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(ae => ae.Image)

                .FirstOrDefaultAsync(c => c.Id == RequestVM.Course);

            if (Course is null)
                return NotFound("Course not Found");

            var CQuestions = Course.QuestionGroups
                .Where(g => RequestVM.Group == -1 ? true : g.Id == RequestVM.Group)
                .Select(g => g.Subgroups
                        .Where(sg => RequestVM.Subgroup == -1 ? true: sg.Id  == RequestVM.Subgroup)
                        .Select(sg => sg.ClickableSubgroupRelations
                            .Select(r => r.Question)))
                .SelectMany(qq => qq)
                .SelectMany(qq => qq)
                .Where(q => RequestVM.LevelOfDifficulty == -1 ? true : q.LevelOfDifficulty.Id == RequestVM.LevelOfDifficulty)
                .Distinct()
                .ToList();

            var KQuestions = Course.QuestionGroups
                .Where(g => RequestVM.Group == -1 ? true : g.Id == RequestVM.Group)
                .Select(g => g.Subgroups
                        .Where(sg => RequestVM.Subgroup == -1 ? true : sg.Id == RequestVM.Subgroup)
                        .Select(sg => sg.KeyboardSubgroupRelations
                            .Select(r => r.Question)))
                .SelectMany(qq => qq)
                .SelectMany(qq => qq)
                .Where(q => RequestVM.LevelOfDifficulty == -1 ? true : q.LevelOfDifficulty.Id == RequestVM.LevelOfDifficulty)
                .Distinct()
                .ToList();

            return Ok(new {
                ClickableQuestions = _mapper.Map<List<SimpleClickableQuestion>, List<SimpleClickableQuestionViewModel>>(CQuestions),
                KeyboardQuestions = _mapper.Map<List<KeyboardQuestion>, List<KeyboardQuestionViewModel>>(KQuestions),
            });
        }
        

       [HttpPost("[action]")]
        public async Task<IActionResult> GetQuestions_PORTAL([FromBody] SCQGetQuestionForAppViewModel RequestVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var SQ = await _applicationDbContext.SimpleClickableQuestions
                 .Where(q => 
                 (RequestVM.LevelOfDifficulty == -1 ? true : q.LevelOfDifficultyId == RequestVM.LevelOfDifficulty)
                 &&
                 (string.IsNullOrEmpty(RequestVM.Code) ? true : q.Code.Contains(RequestVM.Code))
                 &&
                 (RequestVM.Subgroup == -1 ? true : q.SubtopicId == RequestVM.Subgroup)
                 )
                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .Include(q => q.QuestionAttribures)
                 .Include(q => q.Owners)
                 .ThenInclude(o => o.Owner)
                 .OrderBy(q => q.Code)
                 .ToListAsync();

            var KQ = await _applicationDbContext.KeyboardQuestion
                 .Where(q =>
                 (RequestVM.LevelOfDifficulty == -1 ? true : q.LevelOfDifficultyId == RequestVM.LevelOfDifficulty)
                 &&
                 (string.IsNullOrEmpty(RequestVM.Code) ? true : q.Code == RequestVM.Code)
                 &&
                 (RequestVM.Subgroup == -1 ? true : q.SubtopicId == RequestVM.Subgroup)
                 )
                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .Include(q => q.QuestionAttribures)
                 .Include(q => q.Owners)
                 .ThenInclude(o => o.Owner)
                 .OrderBy(q => q.Code)
                 .ToListAsync();

            var MCQ = await _applicationDbContext.MultipleChoiceQuestion
                .Where(q =>
                 (RequestVM.LevelOfDifficulty == -1 ? true : q.LevelOfDifficultyId == RequestVM.LevelOfDifficulty)
                 &&
                 (string.IsNullOrEmpty(RequestVM.Code) ? true : q.Code == RequestVM.Code)
                 &&
                 (RequestVM.Subgroup == -1 ? true : q.SubtopicId == RequestVM.Subgroup)
                 )
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)
                .Include(q => q.QuestionAttribures)
                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)
                 .OrderBy(q => q.Code)
                .ToListAsync();


            return Ok(new { 
                ClickableQuestions = _mapper.Map<List<SimpleClickableQuestion>, List<SimpleClickableQuestionViewModel>>(SQ),
                KeyboardQuestions = _mapper.Map<List<KeyboardQuestion>, List<KeyboardQuestionViewModel>>(KQ),
                MultipleChoiceQuestions = _mapper.Map<List<MultipleChoiceQuestion>, List<MultipleChoiceQuestionViewModel>>(MCQ),

            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetQuestions_ADVANCED_PORTAL([FromBody] SCQGetQuestionForAppViewModel RequestVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            Expression<Func<QuestionBase, bool>> Criteria = q =>
                 ((RequestVM.LevelOfDifficulty == -1 ? true : q.LevelOfDifficultyId == RequestVM.LevelOfDifficulty)
                 &&
                 (string.IsNullOrEmpty(RequestVM.Code) ? true : q.Code.Contains(RequestVM.Code))
                 &&
                 (RequestVM.Topic == -1 ? true : q.Subtopic.TopicId == RequestVM.Topic)
                 &&
                 (RequestVM.Subgroup == -1 ? true : q.SubtopicId == RequestVM.Subgroup)
                 && (!RequestVM.ShowClickableQuestions ? q.Type != CLICKABLE_QUESTION_PARAMETER : true)
                 && (!RequestVM.ShowKeyboardQuestions ? q.Type != KEYBOARD_QUESTION_PARAMETER : true)
                 && (!RequestVM.ShowMultipleChoiceQuestions ? q.Type != MUTLIPLE_CHOICE_QUESTION_PARAMETER : true)
                 && (!RequestVM.ShowEBQuestions ? q.Type != ENERGY_BALANCE_QUESTION_PARAMETER : true)
                 && (RequestVM.DataPoolId == q.DataPoolId));

            var CodesNumbers = await _applicationDbContext.QuestionBase
                .Where(Criteria)
                .OrderBy(q => q.Code)
                .Select(q => q.Code[0])
                .ToListAsync();

            var Codes = new List<Code_Number>();

            foreach(var c in CodesNumbers)
            {
                if(Codes.Count == 0)
                {
                    Codes.Add(new Code_Number()
                    {
                        Code = c,
                        Number = 1
                    });

                    continue;
                }

                if(Codes.Last().Code == c)
                {
                    Codes.Last().Number += 1; 
                }
                else
                {
                    Codes.Add(new Code_Number()
                    {
                        Code = c,
                        Number = 1
                    });
                }

            }

            var Questions = await _applicationDbContext.QuestionBase
                .Where(Criteria)
                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .Include(q => q.QuestionAttribures)
                 .Include(q => q.Owners)
                 .ThenInclude(o => o.Owner)
                 .OrderBy(q => q.Code)
                 .Skip(RequestVM.Page * RequestVM.QperPage)
                 .Take(RequestVM.QperPage)
                .ToListAsync();

            var QuestionsIdsTypes = new List<KeyValuePair<int, int>>();

            if (RequestVM.GetIdsTypes)
            {
                QuestionsIdsTypes = await _applicationDbContext.QuestionBase
                .Where(Criteria)
                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .Include(q => q.QuestionAttribures)
                 .Include(q => q.Owners)
                 .ThenInclude(o => o.Owner)
                 .OrderBy(q => q.Code)
                 .Select((q) => new KeyValuePair<int, int>(q.Id, q.Type))
                .ToListAsync();
            }


            return Ok(new
            {
                NumberOfQuestions = CodesNumbers.Count,
                Questions = _mapper.Map<List<QuestionBase>, List<QuestionBaseViewModel>>(Questions),
                QuestionsIdsTypes = QuestionsIdsTypes,
                Codes = Codes
                /*ClickableQuestions = _mapper.Map<List<SimpleClickableQuestion>, List<SimpleClickableQuestionViewModel>>(SQ),
                KeyboardQuestions = _mapper.Map<List<KeyboardQuestion>, List<KeyboardQuestionViewModel>>(KQ),
                MultipleChoiceQuestions = _mapper.Map<List<MultipleChoiceQuestion>, List<MultipleChoiceQuestionViewModel>>(MCQ),
                */
            }) ;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetQuestions_ADVANCED2_PORTAL([FromBody] SCQGetQuestionForAppViewModel RequestVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Failure_Percentage = RequestVM.Failure_Percentage;
            var Failure_NumberOfGames = RequestVM.Failure_NumberOfGames;

            Expression<Func<QuestionBase, bool>> Criteria = q =>
                ((RequestVM.DataPoolId == q.DataPoolId)
                &&
                (RequestVM.Subgroup == -1 ? true : q.SubtopicId == RequestVM.Subgroup)
                &&
                (RequestVM.Topic == -1 ? true : q.Subtopic.TopicId == RequestVM.Topic)
                &&
                (RequestVM.LevelOfDifficulty == -1 ? true : q.LevelOfDifficultyId == RequestVM.LevelOfDifficulty)
                &&
                (string.IsNullOrEmpty(RequestVM.Code) ? true : q.Code.ToLower().Contains(RequestVM.Code.ToLower()))
                
                && (!RequestVM.ShowClickableQuestions && RequestVM.SearchBasedOnQuestionTypes ? q.Type != CLICKABLE_QUESTION_PARAMETER : true)
                && (!RequestVM.ShowKeyboardQuestions && RequestVM.SearchBasedOnQuestionTypes ? q.Type != KEYBOARD_QUESTION_PARAMETER : true)
                && (!RequestVM.ShowMultipleChoiceQuestions && RequestVM.SearchBasedOnQuestionTypes ? q.Type != MUTLIPLE_CHOICE_QUESTION_PARAMETER : true)
                && (!RequestVM.ShowEBQuestions && RequestVM.SearchBasedOnQuestionTypes ? (q.Type != ENERGY_BALANCE_QUESTION_PARAMETER && q.Type != ENERGY_BALANCE_QUESTION_PARAMETER_UPDATED) : true)
                && (!RequestVM.ShowFreebodyDiagramQuestions && RequestVM.SearchBasedOnQuestionTypes ? q.Type != FREE_BODY_DIAGRAM_QUESTION_PARAMETER : true)
                && (!RequestVM.ShowDiagramQuestions && RequestVM.SearchBasedOnQuestionTypes ? q.Type != DIAGRAM_QUESTION_PARAMETER : true)
                && (!RequestVM.ShowPVDiagramQuestions && RequestVM.SearchBasedOnQuestionTypes ? q.Type != PV_DIAGRAM_QUESTION_PARAMETER : true))

                && (RequestVM.SearchBasedOnMedianTime ?
                q.QuestionStatistics.Any(qs => qs.TotalTime.HasValue) &&
                (RequestVM.MedianTime1 <= 
                    q.QuestionStatistics
                    .Where(qs => qs.TotalTime.HasValue)
                    .OrderBy(qs => qs.TotalTime)
                    .Skip(q.QuestionStatistics.Count(qs => qs.TotalTime.HasValue)/2)
                    .FirstOrDefault().TotalTime 

                    &&

                    RequestVM.MedianTime2 >=
                     q.QuestionStatistics
                    .Where(qs => qs.TotalTime.HasValue)
                    .OrderBy(qs => qs.TotalTime)
                    .Skip(q.QuestionStatistics.Count(qs => qs.TotalTime.HasValue) / 2)
                    .FirstOrDefault().TotalTime
                )
                
                : true)

                && (RequestVM.SearchBasedOnPlayStats ?
                q.QuestionStatistics.Any() &&
                (
                RequestVM.MinimumQuestionPlay <= q.QuestionStatistics.Count
                &&
                RequestVM.SuccessRate1 <= (100*q.QuestionStatistics.Count(a => a.Correct)/ q.QuestionStatistics.Count)
                &&
                RequestVM.SuccessRate2 >= (100 * q.QuestionStatistics.Count(a => a.Correct) / q.QuestionStatistics.Count)
                )

                : true);

            var CodesNumbers = await _applicationDbContext.QuestionBase
              .Where(Criteria)
              .OrderBy(q => q.Code)
              .Select(q => q.Code[0])
              .ToListAsync();

            var Codes = new List<Code_Number>();

            foreach (var c in CodesNumbers)
            {
                if (Codes.Count == 0)
                {
                    Codes.Add(new Code_Number()
                    {
                        Code = c,
                        Number = 1
                    });

                    continue;
                }

                if (Codes.Last().Code == c)
                {
                    Codes.Last().Number += 1;
                }
                else
                {
                    Codes.Add(new Code_Number()
                    {
                        Code = c,
                        Number = 1
                    });
                }

            }

            var Questions = await _applicationDbContext.QuestionBase
                .Where(Criteria)
                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .Include(q => q.QuestionAttribures)
                 .Include(q => q.Owners)
                 .ThenInclude(o => o.Owner)
                 
                 .Include(q => q.QuestionPDFStatistics)

                 .OrderBy(q => q.Code)
                 .Skip(RequestVM.Page * RequestVM.QperPage)
                 .Take(RequestVM.QperPage)
                 .Select(q =>  new {
                     Id = q.Id,
                     Code = q.Code,
                     Type = q.Type,
                        
                     DateCreated = q.DateCreated,

                     AddedByName = q.AddedBy.Name,

                     Base_ImageURL = $"{FILES_PATH}/{q.Base_ImageURL}",
                     PDFURL = q.PDFURL != null ? $"{FILES_PATH}/{q.PDFURL}" : "",
                     VIDEOURL = q.VIDEOURL != null ? $"{FILES_PATH}/{q.VIDEOURL}" : "",

                     TotalGames = q.QuestionStatistics.Count,
                     TotalCorrectGames = q.QuestionStatistics.Count(s => s.Correct),
                     MedianPlayTime = q.QuestionStatistics.Any(s => s.TotalTime.HasValue) ?
                     q.QuestionStatistics.Where(s => s.TotalTime.HasValue)
                     .OrderBy(a => a.TotalTime).ToList()[(int)(q.QuestionStatistics.Count(s => s.TotalTime.HasValue)/2)].TotalTime : 0,


                     TotalPDFViews = q.QuestionPDFStatistics.Count,
                     TotalPDFViewsWrong = q.QuestionPDFStatistics.Count(a => !a.Correct),

                     LevelOfDifficulty = new
                     {
                         Name = q.LevelOfDifficulty.Name,
                         HexColor = q.LevelOfDifficulty.HexColor,
                         Id = q.LevelOfDifficulty.Id,
                     },

                     Subtopic = new {
                         Name = q.Subtopic.Name,
                         Id = q.Subtopic.Id,
                         Topic = new
                         {
                             Name = q.Subtopic.Topic.Name,
                             Id = q.Subtopic.Topic.Id
                         },
                     },


                     Owners = q.Owners.Select((o) => new
                     {
                         Name = o.Owner.Name
                     })
                 })
                .ToListAsync();

            var QuestionsIdsTypes = new List<KeyValuePair<int, int>>();

            if (RequestVM.GetIdsTypes)
            {
                QuestionsIdsTypes = await _applicationDbContext.QuestionBase
                .Where(Criteria)
                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .Include(q => q.QuestionAttribures)
                 .Include(q => q.Owners)
                 .ThenInclude(o => o.Owner)
                 .OrderBy(q => q.Code)
                 .Select((q) => new KeyValuePair<int, int>(q.Id, q.Type))
                .ToListAsync();
            }


            return Ok(new
            {
                NumberOfQuestions = CodesNumbers.Count,
                Questions = (Questions),
                QuestionsIdsTypes = QuestionsIdsTypes,
                Codes = Codes
               
            });
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> GetQuestionsByIds_ADVANCED_PORTAL([FromBody] SearchQuestionsByIdViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var Questions = await _applicationDbContext.QuestionBase
                .Where(q => VM.Ids.Any(Id => Id == q.Id))
                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .Include(q => q.QuestionAttribures)
                 .Include(q => q.Owners)
                 .ThenInclude(o => o.Owner)

                 .Include(q => q.QuestionPDFStatistics)

                 .OrderBy(q => q.Code)
                 .Select(q => new {
                     Id = q.Id,
                     Code = q.Code,
                     Type = q.Type,

                     DateCreated = q.DateCreated,

                     AddedByName = q.AddedBy.Name,

                     Base_ImageURL = $"{FILES_PATH}/{q.Base_ImageURL}",
                     PDFURL = q.PDFURL != null ? $"{FILES_PATH}/{q.PDFURL}" : "",
                     VIDEOURL = q.VIDEOURL != null ? $"{FILES_PATH}/{q.VIDEOURL}" : "",

                     TotalGames = q.QuestionStatistics.Count,
                     TotalCorrectGames = q.QuestionStatistics.Count(s => s.Correct),
                     MedianPlayTime = q.QuestionStatistics.Any(s => s.TotalTime.HasValue) ?
                     q.QuestionStatistics.Where(s => s.TotalTime.HasValue)
                     .OrderBy(a => a.TotalTime).ToList()[(int)(q.QuestionStatistics.Count(s => s.TotalTime.HasValue) / 2)].TotalTime : 0,


                     TotalPDFViews = q.QuestionPDFStatistics.Count,
                     TotalPDFViewsWrong = q.QuestionPDFStatistics.Count(a => !a.Correct),

                     LevelOfDifficulty = new
                     {
                         Name = q.LevelOfDifficulty.Name,
                         HexColor = q.LevelOfDifficulty.HexColor,
                         Id = q.LevelOfDifficulty.Id,
                     },

                     Subtopic = new
                     {
                         Name = q.Subtopic.Name,
                         Id = q.Subtopic.Id,
                         Topic = new
                         {
                             Name = q.Subtopic.Topic.Name,
                             Id = q.Subtopic.Topic.Id
                         },
                     },


                     Owners = q.Owners.Select((o) => new
                     {
                         Name = o.Owner.Name
                     })
                 })
                .ToListAsync();


            return Ok(new {
                NumberOfQuestions = VM.NumberOfQuestions,
                Questions = (Questions),
                QuestionsIdsTypes = VM.QuestionsIdsTypes,
                Codes = VM.Codes
            });
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAlGetQuestions_PORTALlQuestions_PORTAL()
        {
           
            var SQ = await _applicationDbContext.SimpleClickableQuestions
                 
                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .Include(q => q.QuestionAttribures)
                 .Include(q => q.Owners)
                 .ThenInclude(o => o.Owner)
                 .ToListAsync();

            var KQ = await _applicationDbContext.KeyboardQuestion
                 
                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .Include(q => q.QuestionAttribures)
                 .Include(q => q.Owners)
                 .ThenInclude(o => o.Owner)
                 .ToListAsync();

            var MCQ = await _applicationDbContext.MultipleChoiceQuestion

                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .Include(q => q.QuestionAttribures)
                 .Include(q => q.Owners)
                 .ThenInclude(o => o.Owner)
                 .ToListAsync();

            return Ok(new
            {
                ClickableQuestions = _mapper.Map<List<SimpleClickableQuestion>, List<SimpleClickableQuestionViewModel>>(SQ),
                KeyboardQuestions = _mapper.Map<List<KeyboardQuestion>, List<KeyboardQuestionViewModel>>(KQ),
                MultipleChoiceQuestions = _mapper.Map<List<MultipleChoiceQuestion>, List<MultipleChoiceQuestionViewModel>>(MCQ),
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetQuestionsOwned_PORTAL([FromBody] SCQGetQuestionForAppViewModel RequestVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var CodesNumbers = await _applicationDbContext.QuestionBase
                .Where(q => q.Owners.Any(o => o.OwnerId == Owner.Id)
                 && (RequestVM.DataPoolId == q.DataPoolId))
                .OrderBy(q => q.Code)
                .Select(q => q.Code[0])
                .ToListAsync();

            var Codes = new List<Code_Number>();

            foreach (var c in CodesNumbers)
            {
                if (Codes.Count == 0)
                {
                    Codes.Add(new Code_Number()
                    {
                        Code = c,
                        Number = 1
                    });

                    continue;
                }

                if (Codes.Last().Code == c)
                {
                    Codes.Last().Number += 1;
                }
                else
                {
                    Codes.Add(new Code_Number()
                    {
                        Code = c,
                        Number = 1
                    });
                }

            }

            var Questions = await _applicationDbContext.QuestionBase
                .Where(q =>
                    q.Owners.Any(o => o.OwnerId == Owner.Id)
                 && (RequestVM.DataPoolId == q.DataPoolId)

                 )
                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .Include(q => q.QuestionAttribures)
                 .Include(q => q.Owners)
                 .ThenInclude(o => o.Owner)
                 .OrderBy(q => q.Code)
                 .Skip(RequestVM.Page * RequestVM.QperPage)
                 .Take(RequestVM.QperPage)
                 .Select(q => new {
                     Id = q.Id,
                     Code = q.Code,
                     Type = q.Type,

                     DateCreated = q.DateCreated,

                     AddedByName = q.AddedBy.Name,

                     Base_ImageURL = $"{FILES_PATH}/{q.Base_ImageURL}",
                     PDFURL = q.PDFURL != null ? $"{FILES_PATH}/{q.PDFURL}" : "",
                     VIDEOURL = q.VIDEOURL != null ? $"{FILES_PATH}/{q.VIDEOURL}" : "",

                     TotalGames = q.QuestionStatistics.Count,
                     TotalCorrectGames = q.QuestionStatistics.Count(s => s.Correct),
                     AveragePlayTime = q.QuestionStatistics.Sum(s => s.TotalTime) / q.QuestionStatistics.Count(s => s.TotalTime.HasValue),

                     LevelOfDifficulty = new
                     {
                         Name = q.LevelOfDifficulty.Name,
                         HexColor = q.LevelOfDifficulty.HexColor,
                         Id = q.LevelOfDifficulty.Id,
                     },

                     Subtopic = new
                     {
                         Name = q.Subtopic.Name,
                         Id = q.Subtopic.Id,
                         Topic = new
                         {
                             Name = q.Subtopic.Topic.Name,
                             Id = q.Subtopic.Topic.Id
                         },
                     },


                     Owners = q.Owners.Select((o) => new
                     {
                         Name = o.Owner.Name
                     })
                 })
                .ToListAsync();

            var QuestionsIdsTypes = new List<KeyValuePair<int,int>>();

            if (RequestVM.GetIdsTypes)
            {
                QuestionsIdsTypes = await _applicationDbContext.QuestionBase
                .Where(q =>
                    q.Owners.Any(o => o.OwnerId == Owner.Id)
                 && (RequestVM.DataPoolId == q.DataPoolId)

                 )
                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .Include(q => q.QuestionAttribures)
                 .Include(q => q.Owners)
                 .ThenInclude(o => o.Owner)
                 .OrderBy(q => q.Code)
                 .Select((q) => new KeyValuePair<int,int>(q.Id, q.Type))
                .ToListAsync();
            }

            return Ok(new
            {
                NumberOfQuestions = CodesNumbers.Count,
                Codes = Codes,
                Questions = (Questions),
                QuestionsIdsTypes = QuestionsIdsTypes
                /*ClickableQuestions = _mapper.Map<List<SimpleClickableQuestion>, List<SimpleClickableQuestionViewModel>>(SQ),
                KeyboardQuestions = _mapper.Map<List<KeyboardQuestion>, List<KeyboardQuestionViewModel>>(KQ),
                MultipleChoiceQuestions = _mapper.Map<List<MultipleChoiceQuestion>, List<MultipleChoiceQuestionViewModel>>(MCQ),
                */
            });
        }


        [HttpGet("[action]/{QuestionId}")]
        public async Task<IActionResult> GetQuestion_PORTAL(int QuestionId)
        {
            //Get Question
            var Question = await _applicationDbContext.SimpleClickableQuestions
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)
                .Include(q => q.QuestionAttribures)
                .Include(q => q.ClickImages)
                .ThenInclude(ci => ci.Answer)
                .Include(q => q.ClickCharts)
                .ThenInclude(cc => cc.Answer)
                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound();

            Question.ClickImages = Question.ClickImages.OrderBy(a => a.Id).ToList();
            Question.ClickCharts = Question.ClickCharts.OrderBy(a => a.Id).ToList();

            return Ok(_mapper.Map<SimpleClickableQuestion, SimpleClickableQuestionViewModel>(Question));
        }

        [HttpGet("[action]/{QuestionId}/{DataPoolId}")]
        public async Task<IActionResult> GetQuestion_PORTAL(int QuestionId, int DataPoolId)
        {
            //Get Question
            var Question = await _applicationDbContext.SimpleClickableQuestions
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)
                .Include(q => q.QuestionAttribures)
                .Include(q => q.ClickImages)
                .ThenInclude(ci => ci.Answer)
                .Include(q => q.ClickCharts)
                .ThenInclude(cc => cc.Answer)
                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound();

            Question.ClickImages = Question.ClickImages.OrderBy(a => a.Id).ToList();
            Question.ClickCharts = Question.ClickCharts.OrderBy(a => a.Id).ToList();

            return Ok(_mapper.Map<SimpleClickableQuestion, SimpleClickableQuestionViewModel>(Question));
        }


        [HttpGet("[action]/{QuestionId}")]
        public async Task<IActionResult> GetQuestionSeriesMapRelations_PORTAL(int QuestionId)
        {
            //Get Question
           
            var Maps = await _applicationDbContext.CourseMap
                .Include(m => m.Course)
                .Include(m => m.Elements)
                .ThenInclude(e => e.QuestionSeries)
                .ThenInclude(qs => qs.Elements)
                .Where(m => m.Elements.Any(el => el.QuestionSeriesId.HasValue && el.QuestionSeries.Elements.Any(e => e.QuestionId == QuestionId)))
                .ToListAsync();

            return Ok(Maps.Select(m => new
            {
                Id = m.Id,
                Title = m.Title,
                Course = m.Course.Name,
                CourseId = m.CourseId,
                Image = $"{FILES_PATH}/{m.LargeMapURL}",
                Elements = _mapper.Map<List<CourseMapElement>, List<CourseMapElementViewModel>>
                (m.Elements
                .Where(el => el.QuestionSeriesId.HasValue && el.QuestionSeries.Elements.Any(e =>e.QuestionId == QuestionId)).ToList())
            })
            );
        }

        [HttpGet("[action]/{QuestionId}")]
        public async Task<IActionResult> GetQuestion_APP(int QuestionId)
        {
            //Get Question
            var Question = await _applicationDbContext.SimpleClickableQuestions
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)
                .Include(q => q.QuestionAttribures)
                .Include(q => q.ClickImages)
                .ThenInclude(ci => ci.Answer)
                .Include(q => q.ClickCharts)
                .ThenInclude(cc => cc.Answer)
                .ThenInclude(a => a.Jump)
                .Include(q => q.ClickImages)
                .ThenInclude(ci => ci.Background_Image)
                .Include(q => q.ClickCharts)
                .ThenInclude(cc => cc.Background_Image)
                .Include(q => q.Information)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Question Not Found");

            var ImageAnswerGroups = await _applicationDbContext.ImageAnswerGroups
                .Where(g => Question.ClickImages.Any(ci => ci.AnswerGroupId == g.Id))
                .Include(g => g.Images)
                .ToListAsync();

            foreach(var Group in ImageAnswerGroups)
            {
                //Get Roots Including Leafs That Include Thier Leafs ...... -- TREE
                var Images = Group.Images
                    .Where(i => !i.RootId.HasValue)
                    .ToList();

                Group.Images = Images;
            }

            var InterpretedImageGroups = await _applicationDbContext.InterpretedImageGroups
                .Where(g => Question.ClickCharts.Any(cc => cc.AnswerGroupId == g.Id))
                .Include(g => g.Images)
                .ToListAsync();

            return Ok(
                new {
                    Question = _mapper.Map<SimpleClickableQuestion, SimpleClickableQuestionViewModel>(Question),

                    ImageAnswerGroups = _mapper.Map<List<ImageAnswerGroup>, List<ImageAnswerGroupViewModel>>
                    (ImageAnswerGroups),

                    InterpretedImageGroups = _mapper.Map<List<InterpretedImageGroup>, List<InterpretedImageGroupViewModel>>
                    (InterpretedImageGroups)
                });
        }

    
        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionSingleStep([FromForm] AddClickQuestionSingleStepViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Code not Null
            if (string.IsNullOrEmpty(QuestionVM.Code))
                return BadRequest("Code Can't Be Empty");

            if (QuestionVM.Picture is null)
                return Ok("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => QuestionVM.Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            var DATA_POOL = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(dp => dp.Id == QuestionVM.DataPoolId);

            if (DATA_POOL is null)
                return BadRequest("DATA_POOL Not Found");

            //Check Code Not Taken
            var CodeTaken = await _applicationDbContext.QuestionBase
                .AnyAsync(q => q.Code == QuestionVM.Code && q.DataPoolId == DATA_POOL.Id);

            if (CodeTaken)
                return BadRequest("Code Taken, Choose Different Code");

            //Get Level Of Difficulty
            var LOD = await _applicationDbContext.LevelsOfDifficulty
                .FirstOrDefaultAsync(l => l.Id == QuestionVM.LODId);

            if (LOD is null)
                return BadRequest("Level Of Difficulty Not Found");

            Console.WriteLine("****");
            Console.WriteLine(QuestionVM.BackgroundImages.Count);
            Console.WriteLine("****");


            //Subtopic
            var Subtopic = await _applicationDbContext.Subtopics
                .FirstOrDefaultAsync(s => s.Id == QuestionVM.SubtopicId);

            if (Subtopic is null)
                return BadRequest("Subtopic Not Found");

            
            var ParsedModel = Newtonsoft.Json.JsonConvert.DeserializeObject<ParseClickablePartsViewModel>(QuestionVM.ClickParts);

            if (ParsedModel is null)
                return BadRequest("Invalid Data Of Click Parts");

            if (ParsedModel.ClickImages.Count == 0 && ParsedModel.ClickCharts.Count == 0)
                return BadRequest("Please Provide Clickable Parts");

            //Check MC Images 
            if (QuestionVM.BackgroundImages.Count > (ParsedModel.ClickCharts.Count + ParsedModel.ClickImages.Count))
                return BadRequest("More images provided than clickable parts");

            if (QuestionVM.BackgroundImages.Count < (ParsedModel.ClickImages.Count(a => !string.IsNullOrEmpty(a.BackgroundImage)) + ParsedModel.ClickCharts.Count(a => !string.IsNullOrEmpty(a.BackgroundImage))))
                return BadRequest("Number of images provided not correct");

            if (QuestionVM.BackgroundImages.Count != (ParsedModel.ClickImages.Count(a => !string.IsNullOrEmpty(a.BackgroundImage)) + ParsedModel.ClickCharts.Count(a => !string.IsNullOrEmpty(a.BackgroundImage))))
                return BadRequest("Number of images does not match clickable parts selected to have an image");

            //Images 
            var ClickableImages = (await _applicationDbContext.ImageAnswers
                .Where(i => ParsedModel.ClickImages.Any(ci => ci.AnswerId == i.Id))
                .ToListAsync())
                .ToDictionary(ci => ci.Id);

            if (ClickableImages.Count != ParsedModel.ClickImages.GroupBy(ci => ci.AnswerId).Count())
                return NotFound("Atleast Image Answer Not Found");

            //Charts 
            var InterpretedImages = (await _applicationDbContext.InterpretedImages
                .Where(ii => ParsedModel.ClickCharts.Any(cc => cc.AnswerId == ii.Id))
                .ToListAsync()).ToDictionary(ci => ci.Id);

            if (InterpretedImages.Count != ParsedModel.ClickCharts.GroupBy(cc => cc.AnswerId).Count())
                return NotFound("Atleast Interpreted Image Not Found");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Create Question
            var Question = new SimpleClickableQuestion()
            {
                Code = QuestionVM.Code,
                Type = CLICKABLE_QUESTION_PARAMETER,
                LevelOfDifficultyId = LOD.Id,
                SubtopicId = Subtopic.Id,
                Public = QuestionVM.Public,
                QuestionAttribures = QuestionVM.Attributes.Select(a => new QuestionAttribure()
                {
                    Name = a,
                    DataPoolId = DATA_POOL.Id
                }).ToList(),
                    
                Latex = QuestionVM.Latex,

                AddedBy = Owner,
                DataPoolId = DATA_POOL.Id
            };

            Question.Owners.Add(new Models.Ownership.QuestionOwner()
            {
                Owner = Owner,
                DataPoolId = DATA_POOL.Id
            });

            var ProfWilko = await _applicationDbContext.Users
                .FirstOrDefaultAsync(u => u.Id == PROF_WILKO_ID);

            if(ProfWilko != null)
            {
                Question.Owners.Add(new Models.Ownership.QuestionOwner()
                {
                    OwnerId = ProfWilko.Id,
                    DataPoolId = DATA_POOL.Id
                });
            }

            Question.ClickImages.AddRange(ParsedModel.ClickImages.Select(ci => new ClickImage()
            {
                X = ci.X,
                Y = ci.Y,

                RelativeToImageX = ci.RelativeToImageX,
                RelativeToImageY = ci.RelativeToImageY,

                Width = ci.Width,
                Height = ci.Height,
                AnswerId = ci.AnswerId,
                AnswerGroupId = ClickableImages[ci.AnswerId].GroupId,
                AnswerWeight = ci.AnswerWeight,
                BackgroundImage = ci.BackgroundImage,
                DataPoolId = DATA_POOL.Id
            }));

            Question.ClickCharts.AddRange(ParsedModel.ClickCharts.Select(cc => new ClickChart()
            {
                X = cc.X,
                Y = cc.Y,

                RelativeToImageX = cc.RelativeToImageX,
                RelativeToImageY = cc.RelativeToImageY,

                Width = cc.Width,
                Height = cc.Height,
                AnswerId = cc.AnswerId,
                AnswerGroupId = InterpretedImages[cc.AnswerId].GroupId,
                AnswerWeight = cc.AnswerWeight,
                BackgroundImage = cc.BackgroundImage,
                DataPoolId = DATA_POOL.Id

            }));

            //Picture
            var path = Path.Combine(
                "wwwroot/SimpleClickableQuestions",
                $"Question_{Question.Code.ToString()}");

            var URL = await SaveFile(path, QuestionVM.Picture);
            Question.BackgroundImageURL = URL;
            Question.Base_ImageURL = URL;

            Question.BackgroundImageSize = (int)QuestionVM.Picture.Length;
            Question.BackgroundImageWidth = QuestionVM.PictureWidth;
            Question.BackgroundImageHeight = QuestionVM.PictureHeight;
            Question.Base_ImageURL_Width = QuestionVM.PictureWidth;
            Question.Base_ImageURL_Height = QuestionVM.PictureHeight;

            var BackgroundImages = QuestionVM.BackgroundImages;

            //Add Background Images
            foreach (var CP in Question.ClickImages)
            {
                if (!string.IsNullOrEmpty(CP.BackgroundImage))
                {
                    path = Path.Combine(
                   "wwwroot/SimpleClickableQuestions",
                   $"Question_{Question.Code.ToString()}");

                    URL = await SaveFile(path, BackgroundImages[0]);
                    CP.BackgroundImage = URL;

                    BackgroundImages.RemoveAt(0);
                }
            }

            foreach (var CP in Question.ClickCharts)
            {
                if (!string.IsNullOrEmpty(CP.BackgroundImage))
                {
                    path = Path.Combine(
                   "wwwroot/SimpleClickableQuestions",
                   $"Question_{Question.Code.ToString()}");

                    URL = await SaveFile(path, BackgroundImages[0]);
                    CP.BackgroundImage = URL;

                    BackgroundImages.RemoveAt(0);
                }
            }

            if (QuestionVM.PDF != null)
            {
                //Verify Extension
                var PDFvalidExtenstions = new List<string>() { ".pdf"};
                var PDFfileExtensionIsValid = PDFvalidExtenstions.Any(ve => QuestionVM.PDF.FileName.EndsWith(ve));

                if (!PDFfileExtensionIsValid)
                {
                    return BadRequest("PDF Extenstion Not Valid");
                }

                //PDF
                var PDFpath = Path.Combine(
                    "wwwroot/SimpleClickableQuestions",
                    $"Question_{Question.Code.ToString()}");

                var PDFURL = await SaveFile(path, QuestionVM.PDF);
                Question.PDFURL = PDFURL;
                Question.PDFSize = (int)QuestionVM.PDF.Length;

            }

            if (QuestionVM.Video != null)
            {
                //Verify Extension
                var VIDEOvalidExtenstions = new List<string>() { ".mp4" };
                var VIDEOfileExtensionIsValid = VIDEOvalidExtenstions.Any(ve => QuestionVM.Video.FileName.EndsWith(ve));

                if (!VIDEOfileExtensionIsValid)
                {
                    return BadRequest("VIDEO Extenstion Not Valid");
                }

                //VIDEO
                var VIDEOpath = Path.Combine(
                    "wwwroot/SimpleClickableQuestions",
                    $"Question_{Question.Code.ToString()}");

                var VIDEOURL = await SaveFile(path, QuestionVM.Video);
                Question.VIDEOURL = VIDEOURL;
                Question.VIDEOSize = (int)QuestionVM.Video.Length;

            }


            _applicationDbContext.SimpleClickableQuestions.Add(Question);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddNewQuestionParts([FromForm] AddClickQuestionSingleStepViewModel QuestionVM)
        {
            var Question = await _applicationDbContext.SimpleClickableQuestions
                .FirstOrDefaultAsync(q => q.Code == QuestionVM.Code);

            if (Question is null)
                return NotFound("Not Found");

            var ParsedModel = Newtonsoft.Json.JsonConvert.DeserializeObject<ParseClickablePartsViewModel>(QuestionVM.ClickParts);

            if (ParsedModel is null)
                return BadRequest("Invalid Data Of Click Parts");

            if (ParsedModel.ClickImages.Count == 0 && ParsedModel.ClickCharts.Count == 0)
                return BadRequest("Please Provide Clickable Parts");

            //Images 
            var ClickableImages = (await _applicationDbContext.ImageAnswers
                .Where(i => ParsedModel.ClickImages.Any(ci => ci.AnswerId == i.Id))
                .ToListAsync())
                .ToDictionary(ci => ci.Id);

            if (ClickableImages.Count != ParsedModel.ClickImages.GroupBy(ci => ci.AnswerId).Count())
                return NotFound("Atleast Image Answer Not Found");

            //Charts 
            var InterpretedImages = (await _applicationDbContext.InterpretedImages
                .Where(ii => ParsedModel.ClickCharts.Any(cc => cc.AnswerId == ii.Id))
                .ToListAsync()).ToDictionary(ci => ci.Id);

            if (InterpretedImages.Count != ParsedModel.ClickCharts.GroupBy(cc => cc.AnswerId).Count())
                return NotFound("Atleast Interpreted Image Not Found");

            Question.ClickImages.AddRange(ParsedModel.ClickImages.Select(ci => new ClickImage()
            {
                X = ci.X,
                Y = ci.Y,

                RelativeToImageX = ci.RelativeToImageX,
                RelativeToImageY = ci.RelativeToImageY,

                Width = ci.Width,
                Height = ci.Height,
                AnswerId = ci.AnswerId,
                AnswerGroupId = ClickableImages[ci.AnswerId].GroupId,
                AnswerWeight = ci.AnswerWeight
            }));

            Question.ClickCharts.AddRange(ParsedModel.ClickCharts.Select(cc => new ClickChart()
            {
                X = cc.X,
                Y = cc.Y,

                RelativeToImageX = cc.RelativeToImageX,
                RelativeToImageY = cc.RelativeToImageY,

                Width = cc.Width,
                Height = cc.Height,
                AnswerId = cc.AnswerId,
                AnswerGroupId = InterpretedImages[cc.AnswerId].GroupId,
                AnswerWeight = cc.AnswerWeight
            }));

            await UpdateQuestionEditDateTime(Question.Id);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditQuestionBackgroundImage(int QuestionId,IFormFile Picture)
        {
            //Check Question Exists
            var Question = await _applicationDbContext.SimpleClickableQuestions
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return Ok($"Question {QuestionId} Not Found");

            if (Picture is null)
                return Ok("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return Ok("Picture Extenstion Not Valid");
            }

            //Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/SimpleClickableQuestions",
                $"Question_{Question.Id.ToString()}",
                "BackgroundImage");

            var URL = await SaveFile(path, Picture);

            Question.BackgroundImageURL = URL;
            Question.BackgroundImageSize = (int)Picture.Length;

            Question.Base_ImageURL = URL;

            await UpdateQuestionEditDateTime(Question.Id);

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<SimpleClickableQuestion, SimpleClickableQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionBaseInfo([FromBody] QuestionBaseViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            var DATA_POOL = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(dp => dp.Id == QuestionVM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check Question Exists
            var Question = await _applicationDbContext.QuestionBase
                .Include(q => q.QuestionAttribures)
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            //Check Code Unique
            var CodeUsed = await _applicationDbContext.QuestionBase
                .AnyAsync(q => q.Id != Question.Id && q.Code.ToUpper() == QuestionVM.Code.ToUpper() && q.DataPoolId == DATA_POOL.Id);

            if (CodeUsed)
                return BadRequest("Code Already in Use");

            //Get Level Of Difficulty
            var LOD = await _applicationDbContext.LevelsOfDifficulty
                .FirstOrDefaultAsync(l => l.Id == QuestionVM.LevelOfDifficultyId);

            if (LOD is null)
                return BadRequest("Level Of Difficulty Not Found");

            //Subtopic
            var Subtopic = await _applicationDbContext.Subtopics
                .FirstOrDefaultAsync(s => s.Id == QuestionVM.SubtopicId);

            if (Subtopic is null)
                return BadRequest("Subtopic Not Found");


            Question.Code = QuestionVM.Code;
            Question.Public = QuestionVM.Public;
            Question.LevelOfDifficultyId = LOD.Id;
            Question.SubtopicId = Subtopic.Id;

            Question.QuestionAttribures.Clear();
            Question.QuestionAttribures.AddRange(QuestionVM.QuestionAttribures.Select(a => new QuestionAttribure()
            {
                Name = a.Name
            }));

            await UpdateQuestionEditDateTime(Question.Id);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditPartComment(int Id, string Comment, bool IsImage, int DataPoolId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            var DATA_POOL = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(dp => dp.Id == DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            ClickablePart part = null;

            if (IsImage)
            {
                part = await _applicationDbContext.ClickImage
                  .FirstOrDefaultAsync(q => q.Id == Id);
            }
            else
            {
                part = await _applicationDbContext.ClickChart
                  .FirstOrDefaultAsync(q => q.Id == Id);
            }

           
            if (part is null)
                return NotFound("Not Found");

            part.Comment = Comment;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditLatex(int Id, string Latex, int DataPoolId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            var question = await _applicationDbContext.SimpleClickableQuestions
                 .FirstOrDefaultAsync(q => q.Id == Id);

            if (question is null)
                return NotFound("Question not found");

            question.Latex = Latex;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestion([FromBody] QuestionBaseViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            //Check Question Exists
            var Question = await _applicationDbContext.SimpleClickableQuestions
                .Include(q => q.SeriesElements)
                .Include(q => q.QuestionAttribures)
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            var SeriesElements = Question.SeriesElements;

            _applicationDbContext.QuestionSeriesElement.RemoveRange(SeriesElements);
            _applicationDbContext.SimpleClickableQuestions.Remove(Question);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditQuestionPDF(int QuestionId, QuestionTypes QuestionType, IFormFile PDF)
        {
            //Check Question Exists
            QuestionBase Question = await _applicationDbContext.QuestionBase
                            .FirstOrDefaultAsync(q => q.Id == QuestionId);

            /*switch (QuestionType)
            {
                case QuestionTypes.ClickableQuestion:
                    {
                        Question = await _applicationDbContext.SimpleClickableQuestions
                            .FirstOrDefaultAsync(q => q.Id == QuestionId);

                        break;
                    }

                case QuestionTypes.KeyboardQuestion:
                    {
                        Question = await _applicationDbContext.KeyboardQuestion
                           .FirstOrDefaultAsync(q => q.Id == QuestionId);

                        break;
                    }

                case QuestionTypes.MultipleChoiceQuestion:
                    {
                        Question = await _applicationDbContext.MultipleChoiceQuestion
                            .FirstOrDefaultAsync(q => q.Id == QuestionId);

                        break;
                    }
            }*/


            if (Question is null)
                return NotFound($"Question {QuestionId} Not Found");

            if (PDF is null)
                return BadRequest("Please Provide PDF File");

            //Verify Extension
            var validExtenstions = new List<string>() { ".pdf" };

            var fileExtensionIsValid = validExtenstions.Any(ve => PDF.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            // Generate a Path for The Picture
            var path = Path.Combine(
                 "wwwroot/SimpleClickableQuestions",
                 $"Question_{Question.Id.ToString()}",
                 "PDF");

            var URL = await SaveFile(path, PDF);

            Question.PDFURL = URL;
            Question.PDFSize = PDF.Length;

            await UpdateQuestionEditDateTime(Question.Id);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditQuestionVideo(int QuestionId, QuestionTypes QuestionType, IFormFile Video)
        {
            //Check Question Exists
            QuestionBase Question = await _applicationDbContext.QuestionBase
                            .FirstOrDefaultAsync(q => q.Id == QuestionId); 

            /*switch (QuestionType)
            {
                case QuestionTypes.ClickableQuestion:
                    {
                        Question = await _applicationDbContext.SimpleClickableQuestions
                            .FirstOrDefaultAsync(q => q.Id == QuestionId);

                        break;
                    }

                case QuestionTypes.KeyboardQuestion:
                    {
                        Question = await _applicationDbContext.KeyboardQuestion
                           .FirstOrDefaultAsync(q => q.Id == QuestionId);

                        break;
                    }

                case QuestionTypes.MultipleChoiceQuestion:
                    {
                        Question = await _applicationDbContext.MultipleChoiceQuestion
                           .FirstOrDefaultAsync(q => q.Id == QuestionId);

                        break;
                    }
            }*/

            if (Question is null)
                return NotFound($"Question {QuestionId} Not Found");

            if (Video is null)
                return BadRequest("Please Provide Video");

            //Verify Extension
            var validExtenstions = new List<string>() { ".mp4" };

            var fileExtensionIsValid = validExtenstions.Any(ve => Video.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Video Extenstion Not Valid");
            }

            // Generate a Path for The Picture
            var path = Path.Combine(
                 "wwwroot/SimpleClickableQuestions",
                 $"Question_{Question.Id.ToString()}",
                 "Video");

            var URL = await SaveFile(path, Video);

            Question.VIDEOURL = URL;
            Question.VIDEOSize = Video.Length;

            await UpdateQuestionEditDateTime(Question.Id);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
        
        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestionSolution(int QuestionId, QuestionTypes QuestionType, bool PDF, bool Video)
        {
            //Check Question Exists
            QuestionBase Question = await _applicationDbContext.QuestionBase
                            .FirstOrDefaultAsync(q => q.Id == QuestionId);

            /*switch (QuestionType)
            {
                case QuestionTypes.ClickableQuestion:
                    {
                        Question = await _applicationDbContext.SimpleClickableQuestions
                            .FirstOrDefaultAsync(q => q.Id == QuestionId);

                        break;
                    }

                case QuestionTypes.KeyboardQuestion:
                    {
                        Question = await _applicationDbContext.KeyboardQuestion
                           .FirstOrDefaultAsync(q => q.Id == QuestionId);

                        break;
                    }

                case QuestionTypes.MultipleChoiceQuestion:
                    {
                        Question = await _applicationDbContext.MultipleChoiceQuestion
                           .FirstOrDefaultAsync(q => q.Id == QuestionId);

                        break;
                    }
            }*/
            

            if (Question is null)
                return NotFound($"Question {QuestionId} Not Found");

            if(PDF)
            {
                Question.PDFURL = null;
                Question.PDFSize = 0;
            }

            if (Video)
            {
                Question.VIDEOSize = 0;
                Question.VIDEOURL = null;
            }

            await UpdateQuestionEditDateTime(Question.Id);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveClickable([FromBody] RemoveUpdateClickablePartViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest();


            if (VM.IsImage)
            {
                var Image = await _applicationDbContext.ClickImage
                    .FirstOrDefaultAsync(i => i.Id == VM.Id);


                if (Image is null)
                    return NotFound("Not Found");

                _applicationDbContext.ClickImage.Remove((ClickImage)Image);
                await UpdateQuestionEditDateTime(Image.QuestionId);

            }
            else
            {
                var Image = await _applicationDbContext.ClickChart
                   .FirstOrDefaultAsync(i => i.Id == VM.Id);


                if (Image is null)
                    return NotFound("Not Found");

                _applicationDbContext.ClickChart.Remove((ClickChart)Image);
                await UpdateQuestionEditDateTime(Image.QuestionId);

            }



            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
        

       [HttpPost("[action]")]
        public async Task<IActionResult> UpdateClickableImageAnswer([FromBody] RemoveUpdateClickablePartViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (VM.IsImage)
            {
                var Image = await _applicationDbContext.ClickImage
                    .FirstOrDefaultAsync(i => i.Id == VM.Id);

                var Answer = await _applicationDbContext.ImageAnswers
                           .FirstOrDefaultAsync(a => a.Id == VM.AnswerId);

                if (Answer is null)
                    return NotFound("Answer not found");

               Image.AnswerId = Answer.Id;
               Image.AnswerGroupId = Answer.GroupId;
               await UpdateQuestionEditDateTime(Image.QuestionId);

            }
            else
            {
                var Image = await _applicationDbContext.ClickChart
                   .FirstOrDefaultAsync(i => i.Id == VM.Id);

                if (Image is null)
                    return NotFound("Not Found");

                var Answer = await _applicationDbContext.InterpretedImages
                           .FirstOrDefaultAsync(a => a.Id == VM.AnswerId);

                if (Answer is null)
                    return NotFound("Answer not found");

                Image.AnswerId = Answer.Id;
                Image.AnswerGroupId = Answer.GroupId;
                await UpdateQuestionEditDateTime(Image.QuestionId);

            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateClickableImagePosition([FromBody] RemoveUpdateClickablePartViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (VM.IsImage)
            {
                var Image = await _applicationDbContext.ClickImage
                    .FirstOrDefaultAsync(i => i.Id == VM.Id);

                var Answer = await _applicationDbContext.ImageAnswers
                           .FirstOrDefaultAsync(a => a.Id == VM.AnswerId);

                if (Answer is null)
                    return NotFound("Answer not found");

                Image.AnswerId = Answer.Id;
                Image.AnswerGroupId = Answer.GroupId;
                await UpdateQuestionEditDateTime(Image.QuestionId);

            }
            else
            {
                var Image = await _applicationDbContext.ClickChart
                   .FirstOrDefaultAsync(i => i.Id == VM.Id);

                if (Image is null)
                    return NotFound("Not Found");

                var Answer = await _applicationDbContext.InterpretedImages
                           .FirstOrDefaultAsync(a => a.Id == VM.AnswerId);

                if (Answer is null)
                    return NotFound("Answer not found");

                Image.AnswerId = Answer.Id;
                Image.AnswerGroupId = Answer.GroupId;
                await UpdateQuestionEditDateTime(Image.QuestionId);

            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> PostStatistic([FromBody] QuestionStatisticViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            //Get Question
            var Question = await _applicationDbContext.QuestionBase
                .FirstOrDefaultAsync(q => q.Id == VM.QuestionId);

            if (Question is null)
                return NotFound("Question Not Found");

            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.IsDefault);

            if (DATA_POOL is null)
                return BadRequest("DATA_POOL Not Found");

            Question.QuestionStatistics.Add(new QuestionStatistic()
            {
                Correct = VM.Correct,
                Score = VM.Score,
                TotalTime = VM.TotalTime,
                Key = VM.Key,
                Player = VM.Player,
                DataPoolId = Question.DataPoolId
            });

            try
            {
                var registered_user = await GetUser(_httpContextAccessor, _applicationDbContext);
                var player_key = VM.Player;

                var key_exists = await _applicationDbContext.UserLinkedPlayerKeys
                    .AnyAsync(k => k.UserId == registered_user.Id && k.PlayerKey == player_key);

                if (!key_exists)
                {
                    _applicationDbContext.UserLinkedPlayerKeys.Add(new UserLinkedPlayerKey()
                    {
                        PlayerKey = player_key,
                        User = registered_user,
                        DateCreated = DateTime.Now
                    });
                }
            }
            catch
            {

            }

            if(Question.Type == KEYBOARD_QUESTION_PARAMETER && !VM.Correct)
            {
                var KQuestion = await _applicationDbContext.KeyboardQuestion
                .FirstOrDefaultAsync(q => q.Id == VM.QuestionId);

                KQuestion.AnswerStatistics.Add(new KeyboardQuestionAnswerStatistic()
                {
                    QuestionId = KQuestion.Id,
                    AnswerLatex = VM.Latex,
                    DataPoolId = Question.DataPoolId
                });
            }

            if (Question.Type == MUTLIPLE_CHOICE_QUESTION_PARAMETER)
            {
                var MCQuestion = await _applicationDbContext.MultipleChoiceQuestion
                    .Include(q => q.Choices)
                .FirstOrDefaultAsync(q => q.Id == VM.QuestionId);

                foreach(var c in MCQuestion.Choices)
                {
                    c.TotalSelect += 1;
                }

                foreach (var c in MCQuestion.Choices
                    .Where(a => 
                        (a.Correct && VM.ChoicesId.Any(cid => cid == a.Id))
                        ||
                        (!a.Correct && !VM.ChoicesId.Any(cid => cid == a.Id))
                    ))
                {
                    c.TotalCorrect += 1;
                }

            }

            await _applicationDbContext.SaveChangesAsync();
            return Ok();
        }


        [HttpGet("[action]/{Player}")]
        public async Task<IActionResult> PlayerStatistic(string Player)
        {
            var Statistics = await _applicationDbContext.QuestionStatistic
                .Where(s => s.Player == Player)
                .ToListAsync();

            var Data = new
            {
                Total = Statistics.Count,
                Correct = Statistics.Count(s => s.Correct),

            };

            return Ok();
        }



        [HttpGet("[action]/{Id}/{DataPoolId}")]
        public async Task<IActionResult> GetQuestionStatisticTotal(int Id, int DataPoolId)
        {

            //Get Question
            var Question = await _applicationDbContext.QuestionBase
                .Include(q => q.QuestionStatistics)
                .Include(q => q.QuestionPDFStatistics)
                .FirstOrDefaultAsync(q => q.Id == Id);

            if (Question is null)
                return NotFound("Question Not Found");

            var PlayTime = Question.QuestionStatistics.Where(s => s.TotalTime.HasValue).Select(s => s.TotalTime).ToList();
            var median = 0;

            if (PlayTime.Any())
            {
                PlayTime.Sort();
                median = PlayTime[(int)(PlayTime.Count() / 2)].Value;
            }
            return Ok(new
            {
                TotalPlay = Question.QuestionStatistics.Count,
                CorrectPlay = Question.QuestionStatistics.Count(s => s.Correct),
                MedianPlayTime = median,
                WrongPlay = Question.QuestionStatistics.Count(s => !s.Correct),

                MedianPlayTimeWrong = Question.QuestionStatistics.Any(s => s.TotalTime.HasValue && !s.Correct) ?
                     Question.QuestionStatistics.Where(s => s.TotalTime.HasValue && !s.Correct)
                     .OrderBy(a => a.TotalTime).ToList()[(int)(Question.QuestionStatistics.Count(s => s.TotalTime.HasValue && !s.Correct) / 2)].TotalTime : 0,


                MedianPlayTimeCorrect = Question.QuestionStatistics.Any(s => s.TotalTime.HasValue && s.Correct) ?
                     Question.QuestionStatistics.Where(s => s.TotalTime.HasValue && s.Correct)
                     .OrderBy(a => a.TotalTime).ToList()[(int)(Question.QuestionStatistics.Count(s => s.TotalTime.HasValue && s.Correct) / 2)].TotalTime : 0,


            });
            //return Ok(_mapper.Map<List<QuestionStatistic>,List<QuestionStatisticViewModel>>(Question.QuestionStatistics));
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetQuestionStatisticTotal(int Id)
        {

            //Get Question
            var Question = await _applicationDbContext.QuestionBase
                .Include(q => q.QuestionStatistics)
                .Include(q => q.QuestionPDFStatistics)
                .FirstOrDefaultAsync(q => q.Id == Id);

            if (Question is null)
                return NotFound("Question Not Found");

            var PlayTime = Question.QuestionStatistics.Where(s => s.TotalTime.HasValue).Select(s => s.TotalTime).ToList();
            var median = 0;

            if (PlayTime.Any())
            {
                PlayTime.Sort();
                median = PlayTime[(int)(PlayTime.Count() / 2)].Value;
            }
            return Ok(new
            {
                TotalPlay = Question.QuestionStatistics.Count,
                CorrectPlay = Question.QuestionStatistics.Count(s => s.Correct),
                MedianPlayTime = median,
                WrongPlay = Question.QuestionStatistics.Count(s => !s.Correct),
                TotalPDFViews = Question.QuestionPDFStatistics.Count,
                TotalPDFViewsWrong = Question.QuestionPDFStatistics.Count(a => !a.Correct),

                MedianPlayTimeWrong = Question.QuestionStatistics.Any(s => s.TotalTime.HasValue && !s.Correct) ?
                     Question.QuestionStatistics.Where(s => s.TotalTime.HasValue && !s.Correct)
                     .OrderBy(a => a.TotalTime).ToList()[(int)(Question.QuestionStatistics.Count(s => s.TotalTime.HasValue && !s.Correct) / 2)].TotalTime : 0,


                MedianPlayTimeCorrect = Question.QuestionStatistics.Any(s => s.TotalTime.HasValue && s.Correct) ?
                     Question.QuestionStatistics.Where(s => s.TotalTime.HasValue && s.Correct)
                     .OrderBy(a => a.TotalTime).ToList()[(int)(Question.QuestionStatistics.Count(s => s.TotalTime.HasValue && s.Correct) / 2)].TotalTime : 0,

            });
            //return Ok(_mapper.Map<List<QuestionStatistic>,List<QuestionStatisticViewModel>>(Question.QuestionStatistics));
        }

       
        [HttpGet("[action]")]
        public async Task<IActionResult> GetQuestionsStatistics()
        {

            //Get Question
            var Questions = await _applicationDbContext.QuestionBase
                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)
                .Include(q => q.QuestionStatistics)
                .ToListAsync();

           var CQs = await _applicationDbContext.SimpleClickableQuestions
                .Include(q => q.QuestionStatistics)
                .Where(q => false && q.QuestionStatistics.Count(s => s.Correct) < 0.3 * q.QuestionStatistics.Count())
                .ToListAsync();

            var KQs = await _applicationDbContext.KeyboardQuestion
                .Include(q => q.QuestionStatistics)
                .Where(q => false && q.QuestionStatistics.Count(s => s.Correct) < 0.3 * q.QuestionStatistics.Count())
                .ToListAsync();

            var MCs = await _applicationDbContext.MultipleChoiceQuestion
                .Include(q => q.QuestionStatistics)
                .Where(q => false && q.QuestionStatistics.Count(s => s.Correct) < 0.3 * q.QuestionStatistics.Count())
                .ToListAsync();

            var Qs = CQs.Select(q => new
            {
                Id = q.Id,
                Type = CLICKABLE_QUESTION_PARAMETER,
                Code = q.Code,
                Image = $"{Mapping.MappingProfile.FILES_PATH}/{q.BackgroundImageURL}" ,
                Width = q.BackgroundImageWidth,
                Height = q.BackgroundImageHeight,
                Total = q.QuestionStatistics.Count(),
                TotalCorrect = q.QuestionStatistics.Count(s => s.Correct),

            }).ToList();

            Qs.AddRange(KQs.Select(q => new
            {
                Id = q.Id,
                Type = KEYBOARD_QUESTION_PARAMETER,
                Code = q.Code,
                Image = $"{Mapping.MappingProfile.FILES_PATH}/{q.ImageURL}",
                Width = 0,
                Height = 0,
                Total = q.QuestionStatistics.Count(),
                TotalCorrect = q.QuestionStatistics.Count(s => s.Correct),
            }).ToList());

            Qs.AddRange(MCs.Select(q => new
            {
                Id = q.Id,
                Type = MUTLIPLE_CHOICE_QUESTION_PARAMETER,
                Code = q.Code,
                Image = $"{Mapping.MappingProfile.FILES_PATH}/{q.ImageURL}",
                Width = 0,
                Height = 0,
                Total = q.QuestionStatistics.Count(),
                TotalCorrect = q.QuestionStatistics.Count(s => s.Correct),
            }).ToList());

            var LastWeekDate = DateTime.Now.AddDays(-7);



            var RWeek = await _applicationDbContext.QuestionStatistic
                .Where(s => false && s.DateCreated.Value >= LastWeekDate)
                .GroupBy(s => s.DateCreated.Value.Day)
                .OrderBy(g => g.FirstOrDefault().DateCreated)
                .ToListAsync();


            return Ok(new
            {
                TotalQuestionsInDB = Questions.Count,

                TotalPlayedToday = Questions.Select(q =>
                q.QuestionStatistics.Where(s =>
                s.DateCreated.Value.Day == DateTime.Now.Day
                && s.DateCreated.Value.Year == DateTime.Now.Year
                && s.DateCreated.Value.Month == DateTime.Now.Month
                )
                .Count()).Sum(),

                
                TotalPlayedByTopic = 
                Questions.GroupBy(q => q.Subtopic.Topic)
                .Select((g) => new { 
                    Topic = g.Key.Name,
                    Total = g.Select(qq => qq.QuestionStatistics.Count()).Sum()
                }).ToList(),

                SolvedLessThanThirtyPercent = Qs.Where(q => q.Total >= 50),

                RWeek = RWeek.Select(g => new { 
                 Date = g.FirstOrDefault().DateCreated.Value.ToString("dd.MM.yyyy"),
                 Total = g.Count()
                })
            });
        }


        [HttpGet("[action]")]
        public async Task<IActionResult> GetQuestionsStatistics_TOPIC()
        {
            //Get Question
            var Topics = await _applicationDbContext.Topics
            
                .ToListAsync();

            var Qs_Topic = await _applicationDbContext.QuestionStatistic
                .GroupBy(s => s.Question.Subtopic.Topic)
                .Select(s => new
                {
                    Topic = s.Key.Name,
                    Count = s.Count()
                }).ToListAsync();

            return Ok(new
            {
                TotalPlayedByTopic = Qs_Topic                
            });
        }


        [HttpGet("[action]")]
        public async Task<IActionResult> GetQuestionsStatistics_7DAY()
        {
            var LastWeekDate = DateTime.Now.AddDays(-9);
            var SinceOctober = DateTime.ParseExact("01.10.2022", "dd.MM.yyyy", CultureInfo.InvariantCulture);

            var RWeek = await _applicationDbContext.QuestionStatistic
                .Where(s =>s.DateCreated.Value >= LastWeekDate)
                
                .ToListAsync();

            var PDFStats = await _applicationDbContext.CourseMapPDFStatistics
                .Where(s => s.DateCreated.Value >= LastWeekDate)
              
                .ToListAsync();


            /*var OctoberStats = await _applicationDbContext.QuestionStatistic
                .Where(s => s.DateCreated.Value >= SinceOctober)
                .GroupBy(s => s.DateCreated.Value.Date)
                .OrderBy(g => g.Key)
                .Select(g => new { 
                    Date = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var allDates = new List<DateTime>();

            for (var dt = SinceOctober; dt <= DateTime.Today; dt = dt.AddDays(1))
            {
                allDates.Add(dt);
            }

            var OctoberStatsEveryDay = allDates.Select(d =>
            {
                var countGroup = OctoberStats.FirstOrDefault(g => g.Date == d);

                return new
                {
                    Date = d,
                    Count = countGroup != null ? countGroup.Count : 0
                };
            });*/


            return Ok(new
            {
                RWeek = RWeek
                .GroupBy(s => s.DateCreated.Value.Day)
                .OrderBy(g => g.FirstOrDefault().DateCreated)
                .Select(g => new {
                    Date = g.FirstOrDefault().DateCreated.Value.ToString("dd.MM.yyyy"),
                    Total = g.Count()
                }),

                NPlayers = RWeek.GroupBy(a => a.Player).Distinct().Count(),

                PDFWeek = PDFStats
                .GroupBy(s => s.DateCreated.Value.Day)
                .OrderBy(g => g.FirstOrDefault().DateCreated)
                .Select(g => new {
                    Date = g.FirstOrDefault().DateCreated.Value.ToString("dd.MM.yyyy"),
                    Total = g.Count()
                }),

                //OctoberStats = OctoberStats,
                //OctoberStatsEveryDay = OctoberStatsEveryDay

            });
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> CopyQuestion([FromBody] CopyQuestionViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            //Get Question
            var Question = await _applicationDbContext.QuestionBase
                
                .FirstOrDefaultAsync(q => q.Id == VM.QuestionId);

            if (Question is null)
                return NotFound("Question Not Found");

            if (string.IsNullOrEmpty(VM.Code))
                return NotFound("Code cannot be empty");

            var CodeExists = await _applicationDbContext.QuestionBase
                .AnyAsync(q => q.Code == VM.Code);

            if (CodeExists)
                return BadRequest("Code already exists");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            switch (Question.Type)
            {
                case CLICKABLE_QUESTION_PARAMETER:
                    {
                        var CQ = await _applicationDbContext.SimpleClickableQuestions
                            .Include(q => q.ClickCharts)
                            .Include(q => q.ClickImages)
                            .FirstOrDefaultAsync(q => q.Id ==VM.QuestionId);

                        var Copy = (SimpleClickableQuestion)_applicationDbContext.Entry(CQ).CurrentValues.ToObject();
                        Copy.Id = 0;
                        Copy.Code = VM.Code;
                        Copy.Owners.Add(new Models.Ownership.QuestionOwner()
                        {
                            OwnerId = Owner.Id
                        });

                        _applicationDbContext.SimpleClickableQuestions.Add(Copy);

                        break;


                    }

                case KEYBOARD_QUESTION_PARAMETER:
                    {
                        var KQ = await _applicationDbContext.KeyboardQuestion
                            .Include(q => q.Answers)
                            .ThenInclude(a => a.AnswerElements)
                            .FirstOrDefaultAsync(q => q.Id == VM.QuestionId);

                        var Copy = (KeyboardQuestion)_applicationDbContext.Entry(KQ).CurrentValues.ToObject();
                        Copy.Id = 0;
                        Copy.Code = VM.Code;
                        Copy.Owners.Add(new Models.Ownership.QuestionOwner()
                        {
                            OwnerId = Owner.Id
                        });

                        _applicationDbContext.KeyboardQuestion.Add(Copy);

                        break;
                    }

                case MUTLIPLE_CHOICE_QUESTION_PARAMETER:
                    {
                        var MQ = await _applicationDbContext.MultipleChoiceQuestion
                            .Include(q => q.Choices)
                            .FirstOrDefaultAsync(q => q.Id == VM.QuestionId);

                        var Copy = (MultipleChoiceQuestion)_applicationDbContext.Entry(MQ).CurrentValues.ToObject();
                        Copy.Id = 0;
                        Copy.Code = VM.Code;
                        Copy.Owners.Add(new Models.Ownership.QuestionOwner()
                        {
                            OwnerId = Owner.Id
                        });
                        _applicationDbContext.MultipleChoiceQuestion.Add(Copy);


                        break;
                    }

                    case ENERGY_BALANCE_QUESTION_PARAMETER_UPDATED:
                    {
                        var MQ = await _applicationDbContext.EnergyBalanceQuestionUpdated
                            .Include(q => q.ControlVolumes)

                            .Include(q => q.EnergyBalanceTerms)
                            .ThenInclude(ebt => ebt.Questions)
                            .ThenInclude(ebtq => ebtq.Answers)
                            .ThenInclude(a => a.AnswerElements)

                            .Include(q => q.BoundaryConditionLines)
                            .ThenInclude(a => a.AnswerElements)

                             .Include(q => q.InitialConditionLines)
                            .ThenInclude(a => a.AnswerElements)

                            .FirstOrDefaultAsync(q => q.Id == VM.QuestionId);

                        var Copy = (EnergyBalanceQuestionUpdated)_applicationDbContext.Entry(MQ).CurrentValues.ToObject();
                        Copy.Id = 0;
                        Copy.Code = VM.Code;
                        Copy.Owners.Add(new Models.Ownership.QuestionOwner()
                        {
                            OwnerId = Owner.Id
                        });

                        _applicationDbContext.EnergyBalanceQuestionUpdated.Add(Copy);
                        await _applicationDbContext.SaveChangesAsync();

                        //Control volumes
                        foreach (var cv in MQ.ControlVolumes.ToList())
                        {
                            var vcCopy = (EnergyBalanceQuestion_ControlVolume)_applicationDbContext.Entry(cv).CurrentValues.ToObject();
                            vcCopy.Id = 0;

                            Copy.ControlVolumes.Add(vcCopy);
                        }

                        await _applicationDbContext.SaveChangesAsync();

                        //Boundary conditions
                        foreach (var bc in MQ.BoundaryConditionLines.ToList())
                        {
                            var bcCopy = (EnergyBalanceQuestion_GeneralAnswer)_applicationDbContext.Entry(bc).CurrentValues.ToObject();
                            bcCopy.Id = 0;
                            Copy.BoundaryConditionLines.Add(bcCopy);

                            await _applicationDbContext.SaveChangesAsync();

                            foreach (var a in bc.AnswerElements.ToList())
                            {
                                var newAnswerE = (EnergyBalanceQuestion_GeneralAnswerElement)_applicationDbContext.Entry(a).CurrentValues.ToObject();
                                newAnswerE.Id = 0;

                                bcCopy.AnswerElements.Add(newAnswerE);
                                await _applicationDbContext.SaveChangesAsync();
                            }
                        }

                       

                        await _applicationDbContext.SaveChangesAsync();

                        //Initial conditions
                        foreach (var ic in MQ.InitialConditionLines.ToList())
                        {
                            var icCopy = (EnergyBalanceQuestion_GeneralAnswer)_applicationDbContext.Entry(ic).CurrentValues.ToObject();
                            icCopy.Id = 0;

                            Copy.InitialConditionLines.Add(icCopy);
                            await _applicationDbContext.SaveChangesAsync();

                            foreach (var a in ic.AnswerElements.ToList())
                            {
                                var newAnswerE = (EnergyBalanceQuestion_GeneralAnswerElement)_applicationDbContext.Entry(a).CurrentValues.ToObject();
                                newAnswerE.Id = 0;

                                icCopy.AnswerElements.Add(newAnswerE);
                                await _applicationDbContext.SaveChangesAsync();

                            }

                        }

                        //Energy balance terms
                        foreach (var t in MQ.EnergyBalanceTerms.ToList())
                        {
                            var tCopy = (EnergyBalanceQuestion_EBTerm)_applicationDbContext.Entry(t).CurrentValues.ToObject();
                            tCopy.Id = 0;
                            Copy.EnergyBalanceTerms.Add(tCopy);
                            await _applicationDbContext.SaveChangesAsync();

                            foreach (var q in t.Questions.ToList())
                            {
                                var qCopy = (EnergyBalanceQuestion_EBTerm_Question)_applicationDbContext.Entry(q).CurrentValues.ToObject();
                                qCopy.Id = 0;

                                tCopy.Questions.Add(qCopy);
                                await _applicationDbContext.SaveChangesAsync();

                                foreach(var answr in q.Answers.ToList())
                                {
                                    var ansrCopy = (EnergyBalanceQuestion_GeneralAnswer)_applicationDbContext.Entry(answr).CurrentValues.ToObject();

                                    qCopy.Answers.Add(ansrCopy);
                                    ansrCopy.Id = 0;
                                    await _applicationDbContext.SaveChangesAsync();

                                    foreach (var a in answr.AnswerElements.ToList())
                                    {
                                        var newAnswerE = (EnergyBalanceQuestion_GeneralAnswerElement)_applicationDbContext.Entry(a).CurrentValues.ToObject();
                                        newAnswerE.Id = 0;

                                        ansrCopy.AnswerElements.Add(newAnswerE);
                                        await _applicationDbContext.SaveChangesAsync();

                                    }

                                }

                            }

                        }

                        await _applicationDbContext.SaveChangesAsync();

                        break;
                    }

                case FREE_BODY_DIAGRAM_QUESTION_PARAMETER:
                    {
                        var MQ = await _applicationDbContext.FreebodyDiagramQuestion
                            .Include(q => q.ObjectBodies)

                            .ThenInclude(ob => ob.VectorTerms)
                            .ThenInclude(ebtq => ebtq.Answers)
                            .ThenInclude(a => a.AnswerElements)

                            .FirstOrDefaultAsync(q => q.Id == VM.QuestionId);

                        var Copy = (FreebodyDiagramQuestion)_applicationDbContext.Entry(MQ).CurrentValues.ToObject();
                        Copy.Id = 0;
                        Copy.Code = VM.Code;
                        Copy.Owners.Add(new Models.Ownership.QuestionOwner()
                        {
                            OwnerId = Owner.Id
                        });
                        _applicationDbContext.FreebodyDiagramQuestion.Add(Copy);


                        break;
                    }

                default:
                    {
                        break;
                    }
            }
            

            await _applicationDbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditClickablePartLocation([FromBody] RedrawClickablePartViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            ClickablePart Part = null;

            if(VM.type == CLICKABLE_TYPE.IMAGE)
            {
                var _Part = await _applicationDbContext.ClickImage
                    .FirstOrDefaultAsync(i => i.Id == VM.Id);

                await UpdateQuestionEditDateTime(_Part.QuestionId);

                Part = _Part;
            }

            if (VM.type == CLICKABLE_TYPE.CHART)
            {
                var _Part = await _applicationDbContext.ClickChart
                   .FirstOrDefaultAsync(i => i.Id == VM.Id);

                await UpdateQuestionEditDateTime(_Part.QuestionId);


                Part = _Part;
            }

            Part.X = VM.X;
            Part.Y = VM.Y;
            Part.Width = VM.Width;
            Part.Height = VM.Height;

            

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditClickablePartBackgroundImage(int PartId, CLICKABLE_TYPE PartType, IFormFile Picture)
        {
            ClickablePart Part = null;

            if (PartType == CLICKABLE_TYPE.IMAGE)
            {
                var _Part = await _applicationDbContext.ClickImage
                    .FirstOrDefaultAsync(i => i.Id == PartId);
                await UpdateQuestionEditDateTime(_Part.QuestionId);


                Part = _Part;
            }

            if (PartType == CLICKABLE_TYPE.CHART)
            {
                var _Part = await _applicationDbContext.ClickChart
                   .FirstOrDefaultAsync(i => i.Id == PartId);
                await UpdateQuestionEditDateTime(_Part.QuestionId);

                Part = _Part;
            }

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return Ok("Picture Extenstion Not Valid");
            }

            //Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/SimpleClickableQuestions/ClickablePartsImages",
                "BackgroundImage");

            var URL = await SaveFile(path, Picture);
            Part.BackgroundImage = URL;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        public async Task UpdateQuestionEditDateTime(int QuestionId)
        {
            var Question = await _applicationDbContext.QuestionBase
                       .FirstOrDefaultAsync(q => q.Id == QuestionId);

            var User = await GetUser(_httpContextAccessor, _applicationDbContext);

            Question.EditedById = User.Id;
            Question.DateModified = DateTime.Now;            
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionPDFStatistic(int QuestionId, string Player, bool Correct)
        {

            var question = await _applicationDbContext.QuestionBase
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (question is null)
                return NotFound("Question not found");

            question.QuestionPDFStatistics.Add(new QuestionPDFStatistic() {
                Player = Player,
                Correct = Correct,

            });

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetStudentReport([FromBody] StudentReportViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var From = DateTime.ParseExact(VM.From, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            var To = DateTime.ParseExact(VM.To, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);

            var Statsitics = await _applicationDbContext.QuestionStatistic
                .Include((s) => s.Question)
                .ThenInclude(q => q.Subtopic)
                .ThenInclude(q => q.Topic)
                .Include((s) => s.Question)
                .ThenInclude(q => q.LevelOfDifficulty)
                .Where(s =>
                (string.IsNullOrEmpty(VM.Code) ? true : (s.Key == VM.Code ||s.Player == VM.Code)) 
                &&
                ((s.DateCreated >= From) && (s.DateCreated <= To))
                && s.DataPoolId == VM.datapool_id
                )
                .ToListAsync();

            var SeriesStastics = await _applicationDbContext.QuestionSeriesStatistic
                .Include(s => s.Series)
                .ThenInclude(sr => sr.Elements)
                .Where(s =>
                (string.IsNullOrEmpty(VM.Code) ? true : (s.MapKey == VM.Code || s.Player == VM.Code))
                &&
                ((s.DateCreated >= From) && (s.DateCreated <= To))
                && s.DataPoolId == VM.datapool_id
                ).ToListAsync();

            var MapPDFStatistics = await _applicationDbContext.CourseMapPDFStatistics
                .Include(s => s.Element)
                .ThenInclude(e => e.Map)
                .Where(s =>
                (string.IsNullOrEmpty(VM.Code) ? true : (s.Player == VM.Code))
                &&
                ((s.DateCreated >= From) && (s.DateCreated <= To))
                && s.Element.Map.DataPoolId == VM.datapool_id
                ).ToListAsync();

            var QuestionPDFStatistics = await _applicationDbContext.QuestionPDFStatistic
                .Include(s => s.Question)
                .Where(s =>
                (string.IsNullOrEmpty(VM.Code) ? true : (s.Player == VM.Code))
                &&
                ((s.DateCreated >= From) && (s.DateCreated <= To))
                && s.Question.DataPoolId == VM.datapool_id
                ).ToListAsync();

            var MapLinkStatistics = await _applicationDbContext.CourseMapLinkStatistics
                .Include(s => s.Element)
                .ThenInclude(e => e.Map)
                .Where(s =>
                (string.IsNullOrEmpty(VM.Code) ? true : (s.Player == VM.Code))
                &&
                ((s.DateCreated >= From) && (s.DateCreated <= To))
                && s.Element.Map.DataPoolId == VM.datapool_id
                ).ToListAsync();

            var SKeys = await _applicationDbContext.CourseMapKeys
                .Include(sk => sk.Map)
                .Where(s =>
                ((s.DateCreated >= From) && (s.DateCreated <= To) && s.DataPoolId == VM.datapool_id)
                )
                .ToListAsync();


            var DATA_POOL = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(dp => dp.Id == VM.datapool_id);

            if (DATA_POOL is null)
                return NotFound("Datapool not found");

            var DailyQuestionStats = await _applicationDbContext.QuestionStatistic
                .Where(s =>
                ((s.DateCreated >= From) && (s.DateCreated <= To))
                && s.DataPoolId == VM.datapool_id)
                .GroupBy(s => s.DateCreated.Value.Date)
                .OrderBy(g => g.Key)
                .Select(g => new {
                    Date = g.Key,
                    Count = g.Count(),
                    CountCorrect = g.Count(s => s.Correct),

                })
                .ToListAsync();


            var allDates = new List<DateTime>();

            for (var dt = From; dt <= To; dt = dt.AddDays(1))
            {
                allDates.Add(dt);
            }

            var DailyQuestionStatsEveryDay = allDates.Select(d =>
            {
                var countGroup = DailyQuestionStats.FirstOrDefault(g => g.Date == d);

                return new
                {
                    Date = d,
                    Count = countGroup != null ? countGroup.Count : 0,
                    CountCorrect = countGroup != null ? countGroup.CountCorrect : 0
                };
            });

            return Ok(new {
                Statsitics = Statsitics
                .OrderBy(s => s.DateCreated)
                .Select(s => new {
                    Key = s.Key,
                    Player = s.Player,
                    Correct = s.Correct,
                    QuestionCode = s.Question.Code,
                    QuestionId = s.Question.Id,
                    DateCreated = s.DateCreated.Value.ToString("dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture),
                    Topic = s.Question.Subtopic.Topic.Name,
                    Subtopic = s.Question.Subtopic.Name,
                    LevelOfDifficulty = s.Question.LevelOfDifficulty.Name,
                    TotalTime = s.TotalTime
                }),

                Keys = Statsitics.Where(s => !string.IsNullOrEmpty(s.Key)).Select((s) => s.Key).Distinct(),

                Players = Statsitics.Where(s => !string.IsNullOrEmpty(s.Player)).GroupBy(s => s.Player)
                .Select((g) => new { 
                    Player = g.Key,
                    TotalGames = g.Count(),
                    TotalGamesCorrect = g.Where(s => s.Correct).Count(),
                    TotalPlayTime = g.Sum(s => s.TotalTime)

                }).OrderByDescending(r => r.TotalGames),

                SuccessfulPlayers = Statsitics
                .Where(s => !string.IsNullOrEmpty(s.Player))
                .GroupBy(s => s.Player)
                .Select((g) => new {
                    Player = g.Key,
                    TotalGames = g.Count(),
                    TotalGamesCorrect = g.Where(s => s.Correct).Count(),
                    TotalPlayTime = g.Sum(a => a.TotalTime)

                }).OrderByDescending(r => r.TotalGamesCorrect),

                SuccessfulGames = Statsitics.GroupBy(s => s.Question).Select((g) => new {
                    Id = g.Key.Id,
                    QuestionCode = g.Key.Code,
                    Type = g.Key.Type,

                    QuestionImage = $"{FILES_PATH}/{g.Key.Base_ImageURL}",

                    TotalGames = g.Count(),
                    TotalGamesCorrect = g.Count(s => s.Correct),

                }).Where(q => q.TotalGames > 0).OrderByDescending(r => r.TotalGamesCorrect).Take(10),

                UnsuccessfulGames = Statsitics.GroupBy(s => s.Question).Select((g) => new {
                    Id = g.Key.Id,
                    QuestionCode = g.Key.Code,
                    Type = g.Key.Type,

                    QuestionImage = $"{FILES_PATH}/{g.Key.Base_ImageURL}",

                    TotalGames = g.Count(),
                    TotalGamesIncorrect = g.Count(s => !s.Correct),

                }).Where(q => q.TotalGames > 0).OrderByDescending(r => r.TotalGamesIncorrect).Take(10),

                SolutionKeys = SKeys,

                SeriesStastics = SeriesStastics
                .OrderBy(s => s.DateCreated)
                .Select(s => new {
                    Series = s.Series.Code,

                    Key = s.MapKey,
                    Player = s.Player,

                    Map = s.MapName,
                    MapElement = s.MapElementName,

                    SuccessRate = s.SuccessRate,
                    TotalTime = s.TotalTime,
                    OnMobile = s.OnMobile,

                    DateCreated = s.DateCreated.Value.ToString("dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture),
                }),

                SeriesStasticsGrouped = SeriesStastics
                .GroupBy(s => s.Series)
                .OrderByDescending(g => g.Count())
                .Select(g => new {
                    Id = g.Key.Id,
                    Series = g.Key.Code,
                    Count = g.Count(),

                    NumberOfQuestions = g.Key.IsRandom ? g.Key.RandomSize : g.Key.Elements.Count,

                    PlayTime = g.Select(sg => sg.TotalTime),

                    TotalPlayTime = g.Sum(sg => sg.TotalTime),
                    MedianPlayTime = g.Select(sg => sg.TotalTime).OrderBy(a => a).Skip(g.Select(s => s.TotalTime).Count()/2).FirstOrDefault()
                }),

                SeriesStasticsUniqueCount = SeriesStastics.GroupBy(s => s.Series).Count(),
                SeriesStasticsOnMobileCount = SeriesStastics.Count(s => s.OnMobile),


                MapPDFStastics = MapPDFStatistics
                .OrderBy(s => s.DateCreated)
                .Select(s => new {
                    Player = s.Player,
                    Map = s.Element.Map.Title,
                    MapElement = s.Element.Title,
                    OnMobile = s.OnMobile,

                    DateCreated = s.DateCreated.Value.ToString("dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture),
                }),

                MapLinkStastics = MapLinkStatistics
                .OrderBy(s => s.DateCreated)
                .Select(s => new {
                    Player = s.Player,
                    Map = s.Element.Map.Title,
                    MapElement = s.Element.Title,
                    
                    DateCreated = s.DateCreated.Value.ToString("dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture),
                }),

                QuestionPDFStastics = QuestionPDFStatistics
                .OrderBy(s => s.DateCreated)
                .Select(s => new {
                    Player = s.Player,
                    Question = s.Question.Code,
                    CorrectAnswer = s.Correct,

                    DateCreated = s.DateCreated.Value.ToString("dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture),
                }),

                MapPDFStasticsGrouped = MapPDFStatistics
                .GroupBy(s => s.Element.Map)
                .OrderByDescending(g => g.Count())
                .Select(g => new {
                    Id = g.Key.Id,
                    Map = g.Key.Title,
                    VisitedElements = g.GroupBy(a => a.Element).Select(r => new { Name = r.Key.Title, Count = r.Count()}).OrderByDescending(a => a.Count),
                    Count = g.Count()
                }),

                MapLinkStasticsGrouped = MapLinkStatistics
                .GroupBy(s => s.Element.Map)
                .OrderByDescending(g => g.Count())
                .Select(g => new {
                    Id = g.Key.Id,

                    Map = g.Key.Title,
                    VisitedElements = g.GroupBy(a => a.Element).Select(r => new { Name = r.Key.Title, Count = r.Count() }).OrderByDescending(a => a.Count),
                    Count = g.Count()
                }),

                QuestionPDFStasticsGrouped = QuestionPDFStatistics
                .GroupBy(s => s.Question)
                .OrderByDescending(g => g.Count())
                .Select(g => new {
                    Id = g.Key.Id,
                    Type = g.Key.Type,
                    QuestionImage = $"{FILES_PATH}/{g.Key.Base_ImageURL}",

                    Question = g.Key.Code,
                    Count = g.Count(),
                    CountWrong = g.Count(a => !a.Correct)

                }),

                MapPDFStasticsUniqueMapCount = MapPDFStatistics.GroupBy(s => s.Element.Map).Count(),

                DataPool = DATA_POOL.Name,

                DailyQuestionStatsEveryDay = DailyQuestionStatsEveryDay,

                From=From.ToString("dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture),
                To=To.ToString("dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture)
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetGraphicalStudentReport([FromBody] StudentReportViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var From = DateTime.ParseExact(VM.From, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            var To = DateTime.ParseExact(VM.To, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
          
            var DailyQuestionStats = await _applicationDbContext.QuestionStatistic
                .Where(s =>
                ((s.DateCreated >= From) && (s.DateCreated <= To))
                && s.DataPoolId == VM.datapool_id)
                .GroupBy(s => s.DateCreated.Value.Date)
                .OrderBy(g => g.Key)
                .Select(g => new {
                    Date = g.Key,
                    Count = g.Count(),
                    CountCorrect = g.Count(s => s.Correct),

                })
                .ToListAsync();

            var HourlyQuestionStats = await _applicationDbContext.QuestionStatistic
                .Where(s =>
                ((s.DateCreated >= From) && (s.DateCreated <= To))
                && s.DataPoolId == VM.datapool_id)
                .GroupBy(s => s.DateCreated.Value.Hour)
                .OrderBy(g => g.Key)
                .Select(g => new {
                    Hour = g.Key,
                    Count = g.Count(),
                    CountCorrect = g.Count(s => s.Correct),

                })
                .ToListAsync();

            var allDates = new List<DateTime>();

            for (var dt = From; dt <= To; dt = dt.AddDays(1))
            {
                allDates.Add(dt);
            }

            var DailyQuestionStatsEveryDay = allDates.Select(d =>
            {
                var countGroup = DailyQuestionStats.FirstOrDefault(g => g.Date == d);

                return new
                {
                    Date = d,
                    Count = countGroup != null ? countGroup.Count : 0,
                    CountCorrect = countGroup != null ? countGroup.CountCorrect : 0
                };
            });

            var allHours = new List<DateTime>();
            var Today_12am = DateTime.Today;
            var Tomorrow_12am = Today_12am.AddDays(1);

            for (var dt = Today_12am; dt < Tomorrow_12am; dt = dt.AddHours(1))
            {
                allHours.Add(dt);
            }

            var FinalHourlyQuestionStats = allHours.Select(h =>
            {
                var countGroup = HourlyQuestionStats.FirstOrDefault(g => g.Hour == h.Hour);

                return new
                {
                    Hour = h.Hour,
                    Count = countGroup != null ? countGroup.Count : 0,
                    CountCorrect = countGroup != null ? countGroup.CountCorrect : 0
                };
            });

            return Ok(new
            {
                DailyQuestionStatsEveryDay = DailyQuestionStatsEveryDay,
                HourlyQuestionStatsAllDays = FinalHourlyQuestionStats,
            });
        }

        [HttpGet("[action]/{Player}")]
        public async Task<IActionResult> GetStudentStatistics(string Player)
        {
            var Date = DateTime.Now.AddMonths(-3);


            var Statistics = await _applicationDbContext.QuestionStatistic
                .Where(s => s.Player == Player)
                .ToListAsync();

            var PlayerRank = "-";

            if (Statistics.Count != 0)
            {
                var Rank = await _applicationDbContext.QuestionStatistic
                .Where(s => s.DateCreated >= Date && !string.IsNullOrEmpty(s.Player))
                .GroupBy(s => s.Player)
                .Select((g) => new
                {
                    Player = g.Key,
                    Correct = (float)(g.Count((sc) => sc.Correct))///g.Count())
                })
                .OrderByDescending((a) => a.Correct)
                .ToListAsync();

                PlayerRank =""+ (Rank.FindIndex((r) => r.Player == Player) + 1) + "/"+ Rank.Count;
            }           

            return Ok(new { 
                Total = Statistics.Count,
                Correct = Statistics.Count(s => s.Correct),
                Rank= PlayerRank
            });
        }



        public class Code_Number
        {
            public char Code { get; set; }

            public int Number { get; set; }
        }



    }

}
