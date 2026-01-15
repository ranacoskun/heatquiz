using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;
using QuizAPI.Models.Questions;
using QuizAPI.Models.Questions.DiagramsQuestion;
using QuizAPI.Models.Questions.DiagramsQuestion.ViewModals;
using QuizAPI.Models.Questions.PVDiagramQuestion;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.QuestionsController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class PVDiagramQuestionController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;
        
        private readonly int PV_DIAGRAM_QUESTION_UPDATED_PARAMETER = +8;

        private readonly string PROF_WILKO_ID = "b19e0712-bd5c-4bb2-ac5b-7e1713765cdc";

        IHttpContextAccessor _httpContextAccessor;

        public PVDiagramQuestionController(
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

        [HttpGet("[action]/{QuestionId}")]
        public async Task<IActionResult> GetQuestion_PORTAL(int QuestionId)
        {
            //Get Question
            var Question = await _applicationDbContext.PVDiagramQuestion

                //Meta data
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)

                //Owners
                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)

                //Points + Relations
                .Include(q => q.Groups)
                .ThenInclude(q => q.Points)

                .Include(q => q.Groups)
                .ThenInclude(q => q.Relations)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound();

            return Ok(_mapper.Map<PVDiagramQuestion, PVDiagramQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionSingleStep(
            string Code,
            int SubtopicId,
            int LODId,

            string QuestionText,


            bool IsPermutableScoreEvaluation,

            IFormFile Picture,
            int Width,
            int Height,

            IFormFile PDF,

            string Groups,

            int DataPoolId
            )
        {

            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code Can't Be Empty");

            if (string.IsNullOrEmpty(QuestionText))
                return BadRequest("Question text Can't Be Empty");

            //Check datapool exists
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check Code Not Taken
            var CodeTaken = await _applicationDbContext.QuestionBase
                .AnyAsync(q => q.Code == Code && q.DataPoolId == DATA_POOL.Id);

            if (CodeTaken)
                return BadRequest("Code Taken, Choose Different Code");

            //Get Level Of Difficulty
            var LOD = await _applicationDbContext.LevelsOfDifficulty
                .FirstOrDefaultAsync(l => l.Id == LODId);

            if (LOD is null)
                return BadRequest("Level Of Difficulty Not Found");

            //Subtopic
            var Subtopic = await _applicationDbContext.Subtopics
                .FirstOrDefaultAsync(s => s.Id == SubtopicId);

            if (Subtopic is null)
                return BadRequest("Subtopic Not Found");
            
            if (Picture is null)
                return BadRequest("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            //Parse all data
            var groups = Newtonsoft.Json.JsonConvert.DeserializeObject
                <List<PVDiagramQuestion_GroupViewModel>>
                (Groups);

            if (!groups.Any())
                return BadRequest("Please add groups");

            if (groups.Any(a => string.IsNullOrEmpty(a.Code)))
                return BadRequest("Groups should have codes");

            if (groups.Any(a => !a.Points.Any()))
                return BadRequest("Groups should atleast one point");

            if (groups.Any(a => a.Points.Any(r => string.IsNullOrEmpty(r.Name))))
                return BadRequest("Points should have names");

            if (groups.Any(a => a.Points.Count != a.Points.GroupBy(r => r.Name).Count()))
                return BadRequest("Points should have unique names");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Create question
            var Question = new PVDiagramQuestion()
            {
                Type = PV_DIAGRAM_QUESTION_UPDATED_PARAMETER,

                Code = Code,
                LevelOfDifficulty = LOD,
                SubtopicId = Subtopic.Id,

                QuestionText = QuestionText,
              
                IsPermutableScoreEvaluation = IsPermutableScoreEvaluation,

                AddedBy = Owner,
                DataPoolId = DATA_POOL.Id
            };

            //Assign owners
            Question.Owners.Add(new Models.Ownership.QuestionOwner()
            {
                Owner = Owner,
                DataPoolId = DATA_POOL.Id
            });

            var ProfWilko = await _applicationDbContext.Users
                .FirstOrDefaultAsync(u => u.Id == PROF_WILKO_ID);

            if (ProfWilko != null)
            {
                Question.Owners.Add(new Models.Ownership.QuestionOwner()
                {
                    OwnerId = ProfWilko.Id,
                    DataPoolId = DATA_POOL.Id
                });
            }

            //Picture
            var path = Path.Combine(
                "wwwroot/SimpleClickableQuestions",
                $"Question_{Question.Code.ToString()}");

            var URL = await SaveFile(path, Picture);

            Question.Base_ImageURL = URL;
            Question.Base_ImageURL_Width = Width;
            Question.Base_ImageURL_Height = Height;

            if (PDF != null)
            {
                //Verify Extension
                var PDFvalidExtenstions = new List<string>() { ".pdf" };
                var PDFfileExtensionIsValid = PDFvalidExtenstions.Any(ve => PDF.FileName.EndsWith(ve));

                if (!PDFfileExtensionIsValid)
                {
                    return BadRequest("PDF Extenstion Not Valid");
                }

                //PDF
                var PDFpath = Path.Combine(
                    "wwwroot/SimpleClickableQuestions",
                    $"Question_{Question.Code.ToString()}");

                var PDFURL = await SaveFile(path, PDF);
                Question.PDFURL = PDFURL;
                Question.PDFSize = (int)PDF.Length;

            }

            _applicationDbContext.PVDiagramQuestion.Add(Question);
            await _applicationDbContext.SaveChangesAsync();

            foreach(var g in groups){
                var points = g.Points.OrderBy(a => a.Id);
                var relations = g.Relations;

                var prePointIds = points.Select(p => p.Id).ToList();
                var newPointsIds = new List<int>();

                var newGroup = new PVDiagramQuestion_Group()
                {
                    Code = g.Code,

                    IsClosedLoop = g.IsClosedLoop,
                    IsPointsOnly = g.IsPointsOnly,

                    LineColor = g.LineColor,
                    LineWidth = g.LineWidth,
                    
                    DataPoolId = DATA_POOL.Id
                };

                Question.Groups.Add(newGroup);
                await _applicationDbContext.SaveChangesAsync();

                //Add Points and relations
                foreach (var p in points)
                {
                    var newPoint = new PVDiagramQuestion_Point()
                    {

                        Name = p.Name,

                        X = p.X,
                        Y = p.Y,

                        CX = p.CX,
                        CY = p.CY,

                        MarginX = p.MarginX,
                        MarginY = p.MarginY,

                        InnerColor = p.InnerColor,
                        OuterColor = p.OuterColor,

                        IsPoistionConsiderable = p.IsPoistionConsiderable,
                        PositionComment = p.PositionComment,

                        IsShapeConsiderable = p.IsShapeConsiderable,
                        ShapeComment = p.ShapeComment,

                        CurveShape = p.CurveShape,

                        DataPoolId = DATA_POOL.Id,
                    };

                    newGroup.Points.Add(newPoint);

                    await _applicationDbContext.SaveChangesAsync();

                    newPointsIds.Add(newPoint.Id);
                }

                foreach (var r in relations)
                {
                    var preFId = r.FirstPointId;
                    var preSId = r.SecondPointId;

                    var fId = newPointsIds[preFId];
                    var sId = newPointsIds[preSId];

                    var newRelation = new PVDiagramQuestion_Relation()
                    {
                        Type = r.Type,

                        FirstPointId = fId,

                        SecondPointId = sId,

                        Value = r.Value,

                        Comment = r.Comment,

                        DataPoolId = DATA_POOL.Id
                    };

                    newGroup.Relations.Add(newRelation);

                    await _applicationDbContext.SaveChangesAsync();
                }
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateGroupInfo([FromBody] PVDiagramQuestion_GroupViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            //Get group
            var group = await _applicationDbContext.PVDiagramQuestion_Group
                .FirstOrDefaultAsync(g => g.Id == VM.Id);

            if (group is null)
                return BadRequest("Group not found");

            if (string.IsNullOrEmpty(VM.Code))
                return BadRequest("Group should have a code");

            //Update
            group.Code = VM.Code;
            group.LineColor = VM.LineColor;
            group.LineWidth = VM.LineWidth;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateConditionComment(int Id, bool IsPoint, bool IsPositionComment, string Comment)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            if (IsPoint)
            {
                var point = await _applicationDbContext.PVDiagramQuestionPoint
                    .FirstOrDefaultAsync(a => a.Id == Id);

                if (point is null)
                    return BadRequest("Point not found");

                if (IsPositionComment)
                {
                    point.PositionComment = Comment;
                }
                else
                {
                    point.ShapeComment = Comment;
                }
            }
            else
            {
                var relation = await _applicationDbContext.PVDiagramQuestionRelation
                    .FirstOrDefaultAsync(a => a.Id == Id);

                if (relation is null)
                    return BadRequest("Relation not found");

                relation.Comment = Comment;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
