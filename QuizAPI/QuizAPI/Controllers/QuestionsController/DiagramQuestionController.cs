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
    public class DiagramQuestionController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;

        private readonly int DIAGRAM_QUESTION_UPDATED_PARAMETER = +7;

        private readonly string PROF_WILKO_ID = "b19e0712-bd5c-4bb2-ac5b-7e1713765cdc";

        IHttpContextAccessor _httpContextAccessor;

        public DiagramQuestionController(
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
            var Question = await _applicationDbContext.DiagramQuestion

                //Meta data
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)

                //Owners
                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)

                //Plots
                .Include(q => q.Plots)
                .ThenInclude(p => p.Sections)

                .Include(q => q.Plots)
                .ThenInclude(p => p.Relations)


                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound();

            return Ok(_mapper.Map<DiagramQuestion, DiagramQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestion([FromBody] QuestionBaseViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            //Get Question
            var Question = await _applicationDbContext.DiagramQuestion

                //Meta data
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)

                //Owners
                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)

                //Plots
                .Include(q => q.Plots)
                .ThenInclude(p => p.Sections)

                .Include(q => q.Plots)
                .ThenInclude(p => p.Relations)


                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            var SeriesElements = await _applicationDbContext.QuestionSeriesElement
                .Where(se => se.QuestionId == Question.Id)
                .ToListAsync();

            _applicationDbContext.QuestionSeriesElement.RemoveRange(SeriesElements);
            await _applicationDbContext.SaveChangesAsync();

            _applicationDbContext.DiagramQuestion.Remove(Question);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")] 
        public async Task<IActionResult> EditQuestionText([FromBody] DiagramQuestionViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var question = await _applicationDbContext.DiagramQuestion
                .FirstOrDefaultAsync(q => q.Id == VM.Id);

            if (question is null)
                return NotFound("Question not found");

            if (string.IsNullOrEmpty(VM.QuestionText))
                return BadRequest("Question should have text explaining task");

            question.QuestionText = VM.QuestionText;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionImage(int QuestionId, IFormFile Picture, int Height)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var question = await _applicationDbContext.DiagramQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (question is null)
                return NotFound("Question not found");

            if (Picture is null)
                return BadRequest("Please provide an image");
            //Picture
            var path = Path.Combine(
                "wwwroot/SimpleClickableQuestions",
                $"Question_{question.Code.ToString()}");

            var URL = await SaveFile(path, Picture);
            question.Base_ImageURL = URL;
            question.Base_ImageURL_Height = Height;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }
        
        [HttpPost("[action]")] 
        public async Task<IActionResult> EditPlotNameCode([FromBody] DiagramQuestion_PlotViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var question = await _applicationDbContext.DiagramQuestion
                .Include(q => q.Plots) 
                .FirstOrDefaultAsync(q => q.Plots.Any(p => p.Id == VM.Id));

            if (question is null)
                return NotFound("Plot not found");

            if (string.IsNullOrEmpty(VM.Title) || string.IsNullOrEmpty(VM.Code))
                return BadRequest("Question should have text explaining task");

            if(question.Plots.Any(p => p.Id != VM.Id && p.Code == VM.Code))
                return BadRequest("Plot code must be unique");

            var plot = question.Plots.FirstOrDefault(p => p.Id == VM.Id);

            plot.Title = VM.Title;
            plot.Code = VM.Code;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionSingleStep(
            string Code,
            int SubtopicId,
            int LODId,

            string QuestionText,

            IFormFile Picture,
            int Width,
            int Height,

            IFormFile PDF,
            IFormFile Video,

            string Plots,

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

            //parse lists of data
            var plots = Newtonsoft.Json.JsonConvert.DeserializeObject
                <List<DiagramQuestion_PlotViewModel>>
                (Plots);

            //Check plots codes and titles
            if (plots.Any(a => string.IsNullOrEmpty(a.Code)))
                return BadRequest("Plots should have codes");

            if (plots.Count != plots.GroupBy(a => a.Code).Count())
                return BadRequest("Repeated plot code");

            if (plots.Any(a => string.IsNullOrEmpty(a.Title)))
                return BadRequest("Plots should have titles");

            if (plots.Count != plots.GroupBy(a => a.Title).Count())
                return BadRequest("Repeated plot title");

            //Check plots have sections
            if (plots.Any(a => a.Sections.Count < 2))
                return BadRequest("Plots should atleast one section");

            //Check not all sections are frozen
            if (plots.Any(a => a.Sections.Take(a.Sections.Count-1).All(s => s.IsFrozen)))
               return BadRequest("Plot sections cannot be all frozen");

            if (Picture is null)
                return BadRequest("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            
            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Create question
            var Question = new DiagramQuestion()
            {
                Type = DIAGRAM_QUESTION_UPDATED_PARAMETER,

                Code = Code,
                LevelOfDifficulty = LOD,
                SubtopicId = Subtopic.Id,

                QuestionText = QuestionText,

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

            if (Video != null)
            {
                //Verify Extension
                var VIDEOvalidExtenstions = new List<string>() { ".mp4" };
                var VIDEOfileExtensionIsValid = VIDEOvalidExtenstions.Any(ve => Video.FileName.EndsWith(ve));

                if (!VIDEOfileExtensionIsValid)
                {
                    return BadRequest("VIDEO Extenstion Not Valid");
                }

                //VIDEO
                var VIDEOpath = Path.Combine(
                    "wwwroot/SimpleClickableQuestions",
                    $"Question_{Question.Code.ToString()}");

                var VIDEOURL = await SaveFile(path, Video);
                Question.VIDEOURL = VIDEOURL;
                Question.VIDEOSize = (int)Video.Length;

            }

            _applicationDbContext.DiagramQuestion.Add(Question);
            await _applicationDbContext.SaveChangesAsync();

            //Add control volumes
            foreach (var p in plots)
            {
                var new_plot = new DiagramQuestion_Plot()
                {
                    Code = p.Code,
                    Title = p.Title,
                    DataPoolId = DATA_POOL.Id,
                    Height = p.Height,
                    OriginX = p.OriginX,
                    OriginY = p.OriginY,
                    x1 = p.x1,
                    y1 = p.y1,

                    x2 = p.x2,
                    y2 = p.y2,
                };
                Question.Plots.Add(new_plot);

                await _applicationDbContext.SaveChangesAsync();
                
                foreach(var s in p.Sections.OrderBy(a => a.x)){
                    var new_section = _mapper.Map<DiagramQuestion_Section>(s);

                    new_plot.Sections.Add(new_section);
                    await _applicationDbContext.SaveChangesAsync();
                }

                foreach (var r in p.Relations)
                {
                    var first_section = new_plot.Sections.FirstOrDefault(s => s.x == r.First.x);
                    var other_section = new_plot.Sections.FirstOrDefault(s => s.x == r.Other.x);

                    var new_relation = new DiagramQuestion_SectionRelations() {
                        FirstId = first_section.Id,
                        OtherId = other_section.Id,
                        RelationType = r.RelationType,
                        RelationValue = r.RelationValue,
                        RelationValue2 = r.RelationValue2,
                        RelationValue3 = r.RelationValue3
                    };

                    new_plot.Relations.Add(new_relation);
                    await _applicationDbContext.SaveChangesAsync();
                }
            }

            await _applicationDbContext.SaveChangesAsync();
            
            return Ok();
        }
    }
}
