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
using QuizAPI.Models.QuestionGroupsSubgroup;
using QuizAPI.Models.Questions;
using QuizAPI.Models.Questions.EnergyBalanceQuestion;
using QuizAPI.Models.Questions.EnergyBalanceQuestion.ViewModels;
using QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated;
using QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated.ViewModels;
using QuizAPI.Models.Questions.KeyboardQuestion;
using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using QuizAPI.Models.Questions.MultipleChoiceQuestion;
using QuizAPI.Models.Questions.MultipleChoiceQuestion.ViewModels;
using QuizAPI.Models.Questions.SimpleClickableQuestion;
using QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels;
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
    public class EnergyBalanceQuestionUpdatedController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;

        private readonly int ENERGY_BALANCE_QUESTION_UPDATED_PARAMETER = +5;

        private readonly string PROF_WILKO_ID = "b19e0712-bd5c-4bb2-ac5b-7e1713765cdc";

        IHttpContextAccessor _httpContextAccessor;

        public EnergyBalanceQuestionUpdatedController(
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
            var Question = await _applicationDbContext.EnergyBalanceQuestionUpdated

                //Meta data
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)

                //Owners
                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)

                //Control volumes
                .Include(q => q.ControlVolumes)
                
                //EB Terms
                .Include(q => q.EnergyBalanceTerms)
                .ThenInclude(t => t.Questions)
                .ThenInclude(tq => tq.Keyboard)

                .Include(q => q.EnergyBalanceTerms)
                .ThenInclude(t => t.Questions)
                .ThenInclude(tq => tq.Answers)
                .ThenInclude(answr => answr.AnswerElements)
                 .ThenInclude(e => e.NumericKey)
                .ThenInclude(k => k.NumericKey)

                .Include(q => q.EnergyBalanceTerms)
                .ThenInclude(t => t.Questions)
                .ThenInclude(tq => tq.Answers)
                .ThenInclude(answr => answr.AnswerElements)
                .ThenInclude(e => e.Image)
                .ThenInclude(e => e.Image)

                //Boundary conditions
                .Include(q => q.BoundaryConditions)
                .ThenInclude(bc => bc.Answers)
                .ThenInclude(answr => answr.AnswerElements)
                .ThenInclude(e => e.NumericKey)
                .ThenInclude(k => k.NumericKey)

                .Include(q => q.BoundaryConditions)
                .ThenInclude(bc => bc.Answers)
                .ThenInclude(answr => answr.AnswerElements)
                .ThenInclude(e => e.Image)
                .ThenInclude(e => e.Image)

                //Boundary conditions
                .Include(q => q.BoundryConditionKeyboard)

                .Include(q => q.BoundaryConditionLines)
                .ThenInclude(answr => answr.AnswerElements)
                .ThenInclude(e => e.Image)
                .ThenInclude(e => e.Image)

                .Include(q => q.BoundaryConditionLines)
                .ThenInclude(answr => answr.AnswerElements)
                .ThenInclude(e => e.NumericKey)
                .ThenInclude(k => k.NumericKey)

                //Initial conditions
                .Include(q => q.InitialConditionKeyboard)

                .Include(q => q.InitialConditionLines)
                .ThenInclude(answr => answr.AnswerElements)
                .ThenInclude(e => e.Image)
                .ThenInclude(e => e.Image)

                .Include(q => q.InitialConditionLines)
                .ThenInclude(answr => answr.AnswerElements)
                .ThenInclude(e => e.NumericKey)
                .ThenInclude(k => k.NumericKey)

                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound();

            return Ok(_mapper.Map<EnergyBalanceQuestionUpdated, EnergyBalanceQuestionUpdatedViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestion([FromBody] QuestionBaseViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            //Check Question Exists
            var Question = await _applicationDbContext.EnergyBalanceQuestionUpdated

                //Control volumes
                .Include(q => q.ControlVolumes)

                //EB Terms
                .Include(q => q.EnergyBalanceTerms)
                .ThenInclude(t => t.Questions)
                .ThenInclude(tq => tq.Keyboard)

                .Include(q => q.EnergyBalanceTerms)
                .ThenInclude(t => t.Questions)
                .ThenInclude(tq => tq.Answers)
                .ThenInclude(answr => answr.AnswerElements)
                 .ThenInclude(e => e.NumericKey)
                .ThenInclude(k => k.NumericKey)

                .Include(q => q.EnergyBalanceTerms)
                .ThenInclude(t => t.Questions)
                .ThenInclude(tq => tq.Answers)
                .ThenInclude(answr => answr.AnswerElements)
                .ThenInclude(e => e.Image)
                .ThenInclude(e => e.Image)

                //Boundary conditions
                .Include(q => q.BoundaryConditionLines)
                .ThenInclude(bc => bc.AnswerElements)

                //Intial conditions
                .Include(q => q.InitialConditionLines)
                .ThenInclude(ic => ic.AnswerElements)

                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            var SeriesElements = await _applicationDbContext.QuestionSeriesElement
                .Where(se => se.QuestionId == Question.Id)
                .ToListAsync();

            _applicationDbContext.QuestionSeriesElement.RemoveRange(SeriesElements);
            await _applicationDbContext.SaveChangesAsync();

            _applicationDbContext.EnergyBalanceQuestionUpdated.Remove(Question);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SetControlVolumeAsCorrect(int Id)
        {
            var question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(q => q.ControlVolumes)
                .FirstOrDefaultAsync(q => q.ControlVolumes.Any(cv => cv.Id == Id));

            if (question is null)
                return NotFound("Control volume not found");

            var correctCV = question.ControlVolumes.FirstOrDefault(cv => cv.Id == Id);

            foreach(var cv in question.ControlVolumes)
            {
                cv.Correct = false;
            }

            correctCV.Correct = true;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SetControlVolumeComment(int Id, string Comment)
        {
            var question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(q => q.ControlVolumes)
                .FirstOrDefaultAsync(q => q.ControlVolumes.Any(c => c.Id == Id));

            if (question is null)
                return NotFound("Control volume not found");

            var cv = question.ControlVolumes.FirstOrDefault(c => c.Id == Id);
            cv.Comment = Comment;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SetBCICComment(int Id, string Comment)
        {
            var condition = await _applicationDbContext.EnergyBalanceQuestion_GeneralAnswers
                .FirstOrDefaultAsync(a => Id == a.Id);

            if (condition is null)
                return NotFound("Condition not found");

            condition.Comment = Comment;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }


        [HttpPost("[action]")]
        public async Task<IActionResult> EditControlVolumePicture(int Id, IFormFile Picture)
        {
            var question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(q => q.ControlVolumes)
                .FirstOrDefaultAsync(q => q.ControlVolumes.Any(cv => cv.Id == Id));

            if (question is null)
                return NotFound("Control volume not found");

            var CV = question.ControlVolumes.FirstOrDefault(cv => cv.Id == Id);

            if (Picture is null)
                return BadRequest("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            //Picture
            var path = Path.Combine(
                "wwwroot/SimpleClickableQuestions",
                $"Question_{CV.Question.Code.ToString()}");

            var URL = await SaveFile(path, Picture);
            CV.ImageURL = URL;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteVolumePicture(int Id)
        {
            var question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(q => q.ControlVolumes)
                .FirstOrDefaultAsync(q => q.ControlVolumes.Any(cv => cv.Id == Id));

            if (question is null)
                return NotFound("Control volume not found");

            var CV = question.ControlVolumes.FirstOrDefault(cv => cv.Id == Id);

            CV.ImageURL = null;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }


        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteControlVolume(int Id)
        {
            var question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(q => q.ControlVolumes)
                .FirstOrDefaultAsync(q => q.ControlVolumes.Any(cv => cv.Id == Id));

            if (question is null)
                return NotFound("Control volume not found");

            var removeCV = question.ControlVolumes.FirstOrDefault(cv => cv.Id == Id);

            if (removeCV.Correct)
            {
                return BadRequest("This control volume is correct - assign another CV as correct and retry");
            }

            question.ControlVolumes.Remove(removeCV);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteEBTerm(int Id)
        {
            var question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(q => q.EnergyBalanceTerms)
                .ThenInclude(t => t.Questions)

                .Include(q => q.EnergyBalanceTerms)
                .ThenInclude(t => t.Questions)
                .ThenInclude(tq => tq.Answers)
                .ThenInclude(answr => answr.AnswerElements)
                
                .FirstOrDefaultAsync(q => q.EnergyBalanceTerms.Any(t => t.Id == Id));

            if (question is null)
                return NotFound("Energy balance term not found");

            var removeEBT = question.EnergyBalanceTerms.FirstOrDefault(t => t.Id == Id);

            if (question.EnergyBalanceTerms.Count(t => t.Id != removeEBT.Id) == 0)
            {
                return BadRequest("Energy balance question should have atleast one energy balance term");
            }

            if (question.EnergyBalanceTerms.Count(t => t.Id != removeEBT.Id && !t.IsDummy) == 0)
            {
                return BadRequest("Energy balance question should have atleast one energy balance term that is not dummy");
            }

            question.EnergyBalanceTerms.Remove(removeEBT);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteEBTermQuestion(int Id)
        {
            var term = await _applicationDbContext.EnergyBalanceQuestion_EBTerm
                .Include(t => t.Questions)
                .ThenInclude(tq => tq.Answers)
                .ThenInclude(answr => answr.AnswerElements)
                .FirstOrDefaultAsync(t => t.Questions.Any(q => q.Id == Id));

            if (term is null)
                return NotFound("Energy balance term question not found");

            var removeQ = term.Questions.FirstOrDefault(q => q.Id == Id);

            if (term.Questions.Count(t => t.Id != removeQ.Id) == 0)
            {
                return BadRequest("Energy balance term should have atleast one question");
            }

            term.Questions.Remove(removeQ);

            _applicationDbContext.EnergyBalanceQuestion_EBTerm_Question.Remove(removeQ);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteBoundaryCondition(int Id)
        {
            var question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                 .Include(q => q.BoundaryConditions)
                 .ThenInclude(tq => tq.Answers)
                   .ThenInclude(answr => answr.AnswerElements)
                 .FirstOrDefaultAsync(q => q.BoundaryConditions.Any(bc => bc.Id == Id));

            if (question is null)
                return NotFound("Boundary condition not found");

            var removeBC = question.BoundaryConditions.FirstOrDefault(bc => bc.Id == Id);

            question.BoundaryConditions.Remove(removeBC);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionText([FromBody] EnergyBalanceQuestionUpdatedEditGeneralLatexViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .FirstOrDefaultAsync(q => q.Id == VM.Id);

            if (question is null)
                return NotFound("Question not found");
          

            question.QuestionText = VM.QuestionText;
        
            await _applicationDbContext.SaveChangesAsync();

            return Ok(question);

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditQuestionBackgroundImage(int QuestionId, IFormFile Picture)
        {
            //Check Question Exists
            var Question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return BadRequest($"Question not found");

            if (Picture is null)
                return BadRequest("Please provide picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture extenstion not valid");
            }

            //Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/SimpleClickableQuestions",
                $"Question_{Question.Id.ToString()}");

            var URL = await SaveFile(path, Picture);

            Question.Base_ImageURL = URL;
            Question.ThumbnailSize = (int)Picture.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(URL);
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> EditEBTermCodeLatexText([FromBody] EnergyBalanceQuestion_EBTermViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(q => q.EnergyBalanceTerms)
                .FirstOrDefaultAsync(q => q.EnergyBalanceTerms.Any(t => t.Id == VM.Id));

            if(question is null)
                return NotFound("Energy balance term not found");

            //Check code and latex not null
            if (string.IsNullOrEmpty(VM.Code) || string.IsNullOrEmpty(VM.Latex))
                return BadRequest("Energy balance term should have a code and a LaTex");

            //Check code and Latex are unique
            if(question.EnergyBalanceTerms.Any(t => t.Id != VM.Id && (t.Code == VM.Code || t.Latex == VM.Latex)))
                return BadRequest("Repeated code/LaTeX");

            var editedEBT = question.EnergyBalanceTerms.FirstOrDefault(t => t.Id == VM.Id);

            editedEBT.Code = VM.Code;
            editedEBT.Latex = VM.Latex;
            editedEBT.LatexText = VM.LatexText;
            editedEBT.Comment = VM.Comment;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditEBTermQuestionLatex([FromBody] EnergyBalanceQuestion_EBTerm_QuestionViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var term = await _applicationDbContext.EnergyBalanceQuestion_EBTerm
                 .Include(t => t.Questions)
                 
                 .FirstOrDefaultAsync(t => t.Questions.Any(q => q.Id == VM.Id));

            if (term is null)
                return NotFound("Energy balance term question not found");

            //Check code and latex not null
            if (string.IsNullOrEmpty(VM.LatexCode))
                return BadRequest("Energy balance term should have a code and a LaTex");

            //Check code and Latex are unique
            if (term.Questions.Any(q => q.Id != VM.Id && (q.LatexCode == VM.LatexCode)))
                return BadRequest("Repeated LaTeX");

            var editedQ = term.Questions.FirstOrDefault(q => q.Id == VM.Id);

            editedQ.LatexCode = VM.LatexCode;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditEBTermQuestionFlow([FromBody] EnergyBalanceQuestion_EBTerm_QuestionViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var term = await _applicationDbContext.EnergyBalanceQuestion_EBTerm
                 .Include(t => t.Questions)

                 .FirstOrDefaultAsync(t => t.Questions.Any(q => q.Id == VM.Id));

            if (term is null)
                return NotFound("Energy balance term question not found");

            var editedQ = term.Questions.FirstOrDefault(q => q.Id == VM.Id);

            editedQ.Inflow = VM.Inflow;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }


        [HttpPost("[action]")]
        public async Task<IActionResult> EditEBTermDirections
        (
         int TermId,

         bool East,
         bool West,
         bool North,
         bool South,
         bool Center,
         bool IsDummy
        )
        {
            var question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                           .Include(q => q.EnergyBalanceTerms)
                           .FirstOrDefaultAsync(q => q.EnergyBalanceTerms.Any(t => t.Id == TermId));

            if (question is null)
                return NotFound("Energy balance term not found");

            //Check code and Latex are unique
            if (IsDummy && question.EnergyBalanceTerms.Count(t => t.Id != TermId && !t.IsDummy) < 1)
                return BadRequest("Atleast one energy balance term should be non-dummy");

            var editedEBT = question.EnergyBalanceTerms.FirstOrDefault(t => t.Id == TermId);

            editedEBT.East = East;
            editedEBT.West = West;

            editedEBT.South = South;
            editedEBT.North = North;

            editedEBT.Center = Center;

            editedEBT.IsDummy = IsDummy;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }


        [HttpPost("[action]")]
        public async Task<IActionResult> EditBCCodeLatexText([FromBody] EnergyBalanceQuestion_BCViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(q => q.BoundaryConditions)
                .FirstOrDefaultAsync(q => q.BoundaryConditions.Any(bc => bc.Id == VM.Id));

            if (question is null)
                return BadRequest("Boundary condition not found");

            //Check code and latex not null
            if (string.IsNullOrEmpty(VM.Code) || string.IsNullOrEmpty(VM.Latex))
                return BadRequest("Boundary condition should have a code and a LaTex");

            //Check code and Latex are unique
            if (question.BoundaryConditions.Any(bc => bc.Id != VM.Id && (bc.Code == VM.Code || bc.Latex == VM.Latex)))
                return BadRequest("Repeated code/LaTeX");

            var editedBC = question.BoundaryConditions.FirstOrDefault(bc => bc.Id == VM.Id);

            editedBC.Code = VM.Code;
            editedBC.Latex = VM.Latex;
            editedBC.LatexText = VM.LatexText;

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

            string ControlVolumes,
            string EnergyBalanceTerms,

            int BoundaryConditionsKeyboardId,
            string BoundaryConditions,

            int InitialConditionsKeyboardId,
            string InitialConditions,

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
            var controlVolumes = Newtonsoft.Json.JsonConvert.DeserializeObject<List<EnergyBalanceQuestion_ControlVolumeViewModel>>(ControlVolumes);
            var energyBalanceTerms = Newtonsoft.Json.JsonConvert.DeserializeObject<List<EnergyBalanceQuestion_EBTermViewModel>>(EnergyBalanceTerms);
            var boundryConditions = Newtonsoft.Json.JsonConvert.DeserializeObject<List<EnergyBalanceQuestion_GeneralAnswerViewModel>>(!string.IsNullOrEmpty(BoundaryConditions) ? BoundaryConditions : "");
            var initialConditions = Newtonsoft.Json.JsonConvert.DeserializeObject<List<EnergyBalanceQuestion_GeneralAnswerViewModel>>(!string.IsNullOrEmpty(InitialConditions) ? InitialConditions : "");

            if (boundryConditions is null) boundryConditions = new List<EnergyBalanceQuestion_GeneralAnswerViewModel>();
            if (initialConditions is null) initialConditions = new List<EnergyBalanceQuestion_GeneralAnswerViewModel>();

            if (controlVolumes is null)
                return BadRequest("Invalid data - control volumes");

            if (energyBalanceTerms is null)
                return BadRequest("Invalid data - energy balance terms");

            //Check control volumes
            if (controlVolumes.Count == 0)
                return BadRequest("Please provide control volumes");

            if (controlVolumes.Count(cv => cv.Correct) != 1)
                return BadRequest("A single control volume should be labeled as correct");

            //Check energy balance terms
            if (energyBalanceTerms.Count == 0)
                return BadRequest("Please provide energy balance terms");

            if (energyBalanceTerms.Any(et => string.IsNullOrEmpty(et.Code) || string.IsNullOrEmpty(et.Latex)))
                return BadRequest("Energy balance terms should have a code and a latex");

            if (!energyBalanceTerms.Any(et => !et.IsDummy))
                return BadRequest("Atleast one balance terms should be non-dummy");

            if (energyBalanceTerms.Any(et => !et.Questions.Any()))
                return BadRequest("Energy balance terms should have at least a question");

            if (energyBalanceTerms.Any(et => et.Questions.Any(q => string.IsNullOrEmpty(q.LatexCode))))
                return BadRequest("Energy balance term questions should have a code");

            if (energyBalanceTerms.Any(et => et.Questions.Any(q => !q.Answers.Any())))
                return BadRequest("Energy balance term questions should have answers");

            if (energyBalanceTerms.Select(t => t.Code).Distinct().Count() != energyBalanceTerms.Count())
                return BadRequest("Energy balance term should have unique codes");

            if (energyBalanceTerms.Select(t => t.Latex).Distinct().Count() != energyBalanceTerms.Count())
                return BadRequest("Energy balance term should have unique LaTeX ");

            if (energyBalanceTerms.Any(et => (et.East || et.West || et.South || et.North || et.Center) && et.IsDummy))
                return BadRequest("Energy balance terms should have correct directions");

            if (energyBalanceTerms.Any(et => !(et.East || et.West || et.South || et.North || et.Center) && !et.IsDummy))
                return BadRequest("Energy balance terms should have correct directions");

            //Check boundary conditions
            if (Picture is null)
                return BadRequest("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            //Check keyboards
            var ebtKeyboardIds = energyBalanceTerms
                .Select(t => t.Questions.Select(q => q.KeyboardId))
                .SelectMany(r => r)
                .ToList();

            var bcKeyboard = _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
               .FirstOrDefault(k => k.Id == BoundaryConditionsKeyboardId);

            var icKeyboard = _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
               .FirstOrDefault(k => k.Id == InitialConditionsKeyboardId);

             var EBTKeyboards = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .Where(k => ebtKeyboardIds.Any(q => q == k.Id))
                .ToListAsync();

            if(ebtKeyboardIds.Count != EBTKeyboards.Count)
                return NotFound("Some energy balance keyboards are not found");

            if (boundryConditions.Any() && bcKeyboard is null)
                return NotFound("Boundary conditions' keyboard not found");

            if (initialConditions.Any() && bcKeyboard is null)
                return NotFound("Initial conditions' keyboard not found");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Create question
            var Question = new EnergyBalanceQuestionUpdated()
            {
                Type = ENERGY_BALANCE_QUESTION_UPDATED_PARAMETER,

                Code = Code,
                LevelOfDifficulty = LOD,
                SubtopicId = Subtopic.Id,

                QuestionText = QuestionText,

                AddedBy = Owner,
                DataPoolId = DATA_POOL.Id
            };

            if (bcKeyboard != null) Question.BoundryConditionKeyboardId = bcKeyboard.Id;
            if (icKeyboard != null) Question.InitialConditionKeyboardId = icKeyboard.Id;

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

            //Add control volumes
            Question.ControlVolumes.AddRange(controlVolumes
                .Select(cv => new EnergyBalanceQuestion_ControlVolume() {
                    Correct = cv.Correct,
                    X=cv.X,
                    Y=cv.Y,
                    Width=cv.Width,
                    Height=cv.Height,

                    Comment = cv.Comment,

                    DataPoolId = DATA_POOL.Id
                }));

            _applicationDbContext.EnergyBalanceQuestionUpdated.Add(Question);
            await _applicationDbContext.SaveChangesAsync();

            //Add energy balance terms
            foreach(var term in energyBalanceTerms)
            {
                var new_ebterm = new EnergyBalanceQuestion_EBTerm()
                {
                    Code = term.Code,
                    Latex = term.Latex,
                    LatexText = term.LatexText,

                    West = term.West,
                    East = term.East,
                    South = term.South,
                    North = term.North,
                    Center = term.Center,

                    IsDummy = term.IsDummy,

                    Comment = term.Comment,

                    DataPoolId = DATA_POOL.Id
                };

                Question.EnergyBalanceTerms.Add(new_ebterm);
                await _applicationDbContext.SaveChangesAsync();

                foreach(var ebt_Question in term.Questions)
                {
                    var new_ebterm_question = new EnergyBalanceQuestion_EBTerm_Question()
                    {
                        LatexCode = ebt_Question.LatexCode,
                        Inflow = ebt_Question.Inflow,

                        KeyboardId = ebt_Question.KeyboardId,

                        DataPoolId = DATA_POOL.Id,
                    };

                    var ebt_keyboard = EBTKeyboards.FirstOrDefault(k => k.Id == ebt_Question.KeyboardId);

                    new_ebterm.Questions.Add(new_ebterm_question);
                    await _applicationDbContext.SaveChangesAsync();

                    foreach(var answer in ebt_Question.Answers)
                    {
                        var new_answer = new EnergyBalanceQuestion_GeneralAnswer()
                        {
                            DataPoolId = DATA_POOL.Id
                        };

                        new_ebterm_question.Answers.Add(new_answer);
                        await _applicationDbContext.SaveChangesAsync();

                        foreach(var answer_element in answer.AnswerElements.OrderBy(a => a.Order))
                        {
                            var imageId = ebt_keyboard
                                .VariableKeyImages.FirstOrDefault(r => r.ImageId == answer_element.ImageId);

                            var numericKeyId = ebt_keyboard
                                .NumericKeys.FirstOrDefault(r => r.NumericKeyId == answer_element.NumericKeyId);

                            var new_answer_element = new EnergyBalanceQuestion_GeneralAnswerElement()
                            {
                                DataPoolId = DATA_POOL.Id,

                                ImageId = answer_element.ImageId.HasValue ? new Nullable<int>(imageId.Id) : null,

                                Value = answer_element.Value,

                                NumericKeyId = answer_element.NumericKeyId.HasValue ? new Nullable<int>(numericKeyId.Id) : null,
                            };

                            new_answer.AnswerElements.Add(new_answer_element);

                            await _applicationDbContext.SaveChangesAsync();
                        }
                    }
                }
            }

            //Add boundary conditions
            foreach(var BC in boundryConditions)
            {
                var new_answer = new EnergyBalanceQuestion_GeneralAnswer()
                {
                    Comment = BC.Comment,
                    DataPoolId = DATA_POOL.Id,
                };

                Question.BoundaryConditionLines.Add(new_answer);
                await _applicationDbContext.SaveChangesAsync();


                foreach (var answer_element in BC.AnswerElements.OrderBy(a => a.Order))
                {
                    var imageId = bcKeyboard
                        .VariableKeyImages.FirstOrDefault(r => r.ImageId == answer_element.ImageId);

                    var numericKeyId = bcKeyboard
                        .NumericKeys.FirstOrDefault(r => r.NumericKeyId == answer_element.NumericKeyId);

                    var new_answer_element = new EnergyBalanceQuestion_GeneralAnswerElement()
                    {
                        DataPoolId = DATA_POOL.Id,

                        ImageId = answer_element.ImageId.HasValue ? new Nullable<int>(imageId.Id) : null,

                        Value = answer_element.Value,

                        NumericKeyId = answer_element.NumericKeyId.HasValue ? new Nullable<int>(numericKeyId.Id) : null,
                    };

                    new_answer.AnswerElements.Add(new_answer_element);

                    await _applicationDbContext.SaveChangesAsync();
                }

             }

            //Add boundary conditions
            foreach (var IC in initialConditions)
            {
                var new_answer = new EnergyBalanceQuestion_GeneralAnswer()
                {
                    Comment = IC.Comment,
                    DataPoolId = DATA_POOL.Id,
                };

                Question.InitialConditionLines.Add(new_answer);
                await _applicationDbContext.SaveChangesAsync();


                foreach (var answer_element in IC.AnswerElements.OrderBy(a => a.Order))
                {
                    var imageId = bcKeyboard
                        .VariableKeyImages.FirstOrDefault(r => r.ImageId == answer_element.ImageId);

                    var numericKeyId = bcKeyboard
                        .NumericKeys.FirstOrDefault(r => r.NumericKeyId == answer_element.NumericKeyId);

                    var new_answer_element = new EnergyBalanceQuestion_GeneralAnswerElement()
                    {
                        DataPoolId = DATA_POOL.Id,

                        ImageId = answer_element.ImageId.HasValue ? new Nullable<int>(imageId.Id) : null,

                        Value = answer_element.Value,

                        NumericKeyId = answer_element.NumericKeyId.HasValue ? new Nullable<int>(numericKeyId.Id) : null,
                    };

                    new_answer.AnswerElements.Add(new_answer_element);

                    await _applicationDbContext.SaveChangesAsync();
                }

            }

            await _applicationDbContext.SaveChangesAsync();
           
            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddEBTermQuestion(
           int TermId,
           string QuestionCodeLateX,
           bool Inflow,
           int KeyboardId,

           string Answers
           )
        {
            var EBTerm = await _applicationDbContext.EnergyBalanceQuestion_EBTerm
                .Include(t => t.Questions)
                .FirstOrDefaultAsync(t => t.Id == TermId);

            if (EBTerm is null)
                return NotFound("Energy balance term not found");

            if (string.IsNullOrEmpty(QuestionCodeLateX))
                return BadRequest("Question should have a LaTeX code");

            //Check latex is unique 
            if(EBTerm.Questions.Any(q=> q.LatexCode == QuestionCodeLateX))
                return BadRequest("LaTeX code is repeated");

            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .FirstOrDefaultAsync(k => k.Id == KeyboardId);

            if (Keyboard is null)
                return NotFound("Keyboard not found");

            var answers = Newtonsoft.Json.JsonConvert.DeserializeObject
                <List<EnergyBalanceQuestion_GeneralAnswerViewModel>>(Answers);

            if (answers is null)
                return BadRequest("Please provide answers");

            if(!answers.Any())
                return BadRequest("Please provide answers");

            var question = new EnergyBalanceQuestion_EBTerm_Question()
            {
                LatexCode = QuestionCodeLateX,
                Inflow = Inflow,
                KeyboardId = Keyboard.Id,
                DataPoolId = EBTerm.DataPoolId
            };

            EBTerm.Questions.Add(question);

            await _applicationDbContext.SaveChangesAsync();

            foreach(var answer in answers)
            {
                var new_answer = new EnergyBalanceQuestion_GeneralAnswer()
                {
                    DataPoolId = EBTerm.DataPoolId,
                };

                question.Answers.Add(new_answer);
                await _applicationDbContext.SaveChangesAsync();

                foreach (var answer_element in answer.AnswerElements.OrderBy(a => a.Order))
                {
                    var imageId = Keyboard
                        .VariableKeyImages.FirstOrDefault(r => r.ImageId == answer_element.ImageId);

                    var numericKeyId = Keyboard
                        .NumericKeys.FirstOrDefault(r => r.NumericKeyId == answer_element.NumericKeyId);

                    var new_answer_element = new EnergyBalanceQuestion_GeneralAnswerElement()
                    {
                        DataPoolId = EBTerm.DataPoolId,

                        ImageId = answer_element.ImageId.HasValue ? new Nullable<int>(imageId.Id) : null,

                        Value = answer_element.Value,

                        NumericKeyId = answer_element.NumericKeyId.HasValue ? new Nullable<int>(numericKeyId.Id) : null,
                    };

                    new_answer.AnswerElements.Add(new_answer_element);

                    await _applicationDbContext.SaveChangesAsync();
                }
            };

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEBTerm(
           int QuestionId,
           string Code,
           string Latex,
           string LatexText,

           bool East,
           bool West,
           bool Center,
           bool North,
           bool South,
           bool IsDummy,

           string Questions
           )
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(q => q.EnergyBalanceTerms) 
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Question not found");

            if (string.IsNullOrEmpty(Code) || string.IsNullOrEmpty(Latex))
                return BadRequest("Energy balance term should have Code/LaTeX");

            //Check latex is unique 
            if (Question.EnergyBalanceTerms.Any(t => t.Code == Code || t.Latex == Latex))
                return BadRequest("Code/LaTeX is repeated");

            var questions = Newtonsoft.Json.JsonConvert.DeserializeObject
                <List<EnergyBalanceQuestion_EBTerm_QuestionViewModel>>(Questions);

            //Check questions exist
            if (questions is null)
                return BadRequest("Please provide questions");

            if (!questions.Any())
                return BadRequest("Please provide questions");

            //Check questions have Latex
            if(questions.Any(q => string.IsNullOrEmpty(q.LatexCode)))
                return BadRequest("Please provide Latex code for questions");

            if (questions.GroupBy(q => q.LatexCode).Count() != questions.Count())
                return BadRequest("Please provide unique Latex code for questions");

            //Check questions have keyboard
            var KeyboardIds = questions.Select(q => q.KeyboardId).Distinct();

            var Keyboards = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .Where(k => KeyboardIds.Any(id => id == k.Id))
                .ToListAsync();

            if (Keyboards.Count() != KeyboardIds.Count())
                return BadRequest("At least one keyboard selected not found");

            var EBTerm = new EnergyBalanceQuestion_EBTerm()
            {
                Code = Code,
                Latex = Latex,
                LatexText = LatexText,

                East = East,
                West = West,

                South = South,
                North = North,

                Center = Center,

                IsDummy = IsDummy,

                DataPoolId = Question.DataPoolId,

            };

            Question.EnergyBalanceTerms.Add(EBTerm);
            await _applicationDbContext.SaveChangesAsync();

            foreach (var ebt_Question in questions)
            {
                var new_ebterm_question = new EnergyBalanceQuestion_EBTerm_Question()
                {
                    LatexCode = ebt_Question.LatexCode,
                    Inflow = ebt_Question.Inflow,
                    KeyboardId = ebt_Question.KeyboardId,

                    DataPoolId = Question.DataPoolId,
                };

                var ebt_keyboard = Keyboards.FirstOrDefault(k => k.Id == ebt_Question.KeyboardId);

                EBTerm.Questions.Add(new_ebterm_question);
                await _applicationDbContext.SaveChangesAsync();

                foreach (var answer in ebt_Question.Answers)
                {
                    var new_answer = new EnergyBalanceQuestion_GeneralAnswer()
                    {
                        DataPoolId = Question.DataPoolId
                    };

                    new_ebterm_question.Answers.Add(new_answer);
                    await _applicationDbContext.SaveChangesAsync();

                    foreach (var answer_element in answer.AnswerElements.OrderBy(a => a.Order))
                    {
                        var imageId = ebt_keyboard
                            .VariableKeyImages.FirstOrDefault(r => r.ImageId == answer_element.ImageId);

                        var numericKeyId = ebt_keyboard
                            .NumericKeys.FirstOrDefault(r => r.NumericKeyId == answer_element.NumericKeyId);

                        var new_answer_element = new EnergyBalanceQuestion_GeneralAnswerElement()
                        {
                            DataPoolId = Question.DataPoolId,

                            ImageId = answer_element.ImageId.HasValue ? new Nullable<int>(imageId.Id) : null,

                            Value = answer_element.Value,

                            NumericKeyId = answer_element.NumericKeyId.HasValue ? new Nullable<int>(numericKeyId.Id) : null,
                        };

                        new_answer.AnswerElements.Add(new_answer_element);

                        await _applicationDbContext.SaveChangesAsync();
                    }
                }
            }

            

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }



        [HttpPost("[action]")]
        public async Task<IActionResult> SetBoundaryConditionKeyboard(
           int QuestionId,
           int KeyboardId
        )
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(t => t.BoundaryConditionLines)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Energy balance question not found");

            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .FirstOrDefaultAsync(k => k.Id == KeyboardId && k.DataPoolId == Question.DataPoolId);

            if (Keyboard is null)
                return NotFound("Keyboard not found");

            if (Question.BoundryConditionKeyboardId == Keyboard.Id)
                return BadRequest("Same keyboard");
         
            Question.BoundaryConditionLines.RemoveAll(a => true);
            Question.BoundryConditionKeyboardId = Keyboard.Id;

           await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddBoundaryCondition(
          int QuestionId,
          string Answers
       )
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(t => t.BoundryConditionKeyboard)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Energy balance question not found");

            var KeyboardId = Question.BoundryConditionKeyboardId;

            if (KeyboardId is null)
                return BadRequest("Please add a boundary condition keyboard");

            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .FirstOrDefaultAsync(k => k.Id == KeyboardId);

            var answers = Newtonsoft.Json.JsonConvert.DeserializeObject
               <List<EnergyBalanceQuestion_GeneralAnswerViewModel>>(Answers);

            if (answers is null)
                return BadRequest("Please provide answers");

            if (!answers.Any())
                return BadRequest("Please provide answers");

            foreach (var answer in answers)
            {
                var new_answer = new EnergyBalanceQuestion_GeneralAnswer()
                {
                    DataPoolId = Question.DataPoolId,
                };

                Question.BoundaryConditionLines.Add(new_answer);
                await _applicationDbContext.SaveChangesAsync();

                foreach (var answer_element in answer.AnswerElements.OrderBy(a => a.Order))
                {
                    var imageId = Keyboard
                        .VariableKeyImages.FirstOrDefault(r => r.ImageId == answer_element.ImageId);

                    var numericKeyId = Keyboard
                        .NumericKeys.FirstOrDefault(r => r.NumericKeyId == answer_element.NumericKeyId);

                    var new_answer_element = new EnergyBalanceQuestion_GeneralAnswerElement()
                    {
                        DataPoolId = Question.DataPoolId,

                        ImageId = answer_element.ImageId.HasValue ? new Nullable<int>(imageId.Id) : null,

                        Value = answer_element.Value,

                        NumericKeyId = answer_element.NumericKeyId.HasValue ? new Nullable<int>(numericKeyId.Id) : null,
                    };

                    new_answer.AnswerElements.Add(new_answer_element);

                    await _applicationDbContext.SaveChangesAsync();
                }
            };

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveBoundaryCondition(
          int Id
       )
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(t => t.BoundaryConditionLines)
                .FirstOrDefaultAsync(q => q.BoundaryConditionLines.Any(a => a.Id == Id));

            if (Question is null)
                return NotFound("Boundary condition not found");

            var BC = Question.BoundaryConditionLines.FirstOrDefault(a => a.Id == Id);

            Question.BoundaryConditionLines.Remove(BC);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddInitialCondition(
         int QuestionId,
         string Answers
      )
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(t => t.InitialConditionKeyboard)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Energy balance question not found");

            var KeyboardId = Question.InitialConditionKeyboardId;

            if (KeyboardId is null)
                return BadRequest("Please add a boundary condition keyboard");

            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .FirstOrDefaultAsync(k => k.Id == KeyboardId);

            var answers = Newtonsoft.Json.JsonConvert.DeserializeObject
               <List<EnergyBalanceQuestion_GeneralAnswerViewModel>>(Answers);

            if (answers is null)
                return BadRequest("Please provide answers");

            if (!answers.Any())
                return BadRequest("Please provide answers");

            foreach (var answer in answers)
            {
                var new_answer = new EnergyBalanceQuestion_GeneralAnswer()
                {
                    DataPoolId = Question.DataPoolId,
                };

                Question.InitialConditionLines.Add(new_answer);
                await _applicationDbContext.SaveChangesAsync();

                foreach (var answer_element in answer.AnswerElements.OrderBy(a => a.Order))
                {
                    var imageId = Keyboard
                        .VariableKeyImages.FirstOrDefault(r => r.ImageId == answer_element.ImageId);

                    var numericKeyId = Keyboard
                        .NumericKeys.FirstOrDefault(r => r.NumericKeyId == answer_element.NumericKeyId);

                    var new_answer_element = new EnergyBalanceQuestion_GeneralAnswerElement()
                    {
                        DataPoolId = Question.DataPoolId,

                        ImageId = answer_element.ImageId.HasValue ? new Nullable<int>(imageId.Id) : null,

                        Value = answer_element.Value,

                        NumericKeyId = answer_element.NumericKeyId.HasValue ? new Nullable<int>(numericKeyId.Id) : null,
                    };

                    new_answer.AnswerElements.Add(new_answer_element);

                    await _applicationDbContext.SaveChangesAsync();
                }
            };

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveInitialCondition(
              int Id
           )
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(t => t.InitialConditionLines)
                .FirstOrDefaultAsync(q => q.InitialConditionLines.Any(a => a.Id == Id));

            if (Question is null)
                return NotFound("Boundary condition not found");

            var IC = Question.InitialConditionLines.FirstOrDefault(a => a.Id == Id);

            Question.InitialConditionLines.Remove(IC);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SetInitialConditionKeyboard(
           int QuestionId,
           int KeyboardId
        )
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .Include(t => t.InitialConditionLines)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Energy balance question not found");

            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .FirstOrDefaultAsync(k => k.Id == KeyboardId && k.DataPoolId == Question.DataPoolId);

            if (Keyboard is null)
                return NotFound("Keyboard not found");

            if (Question.InitialConditionKeyboardId == Keyboard.Id)
                return BadRequest("Same keyboard");

            Question.InitialConditionLines.RemoveAll(a => true);
            Question.InitialConditionKeyboardId = Keyboard.Id;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddControlVolume(
           int QuestionId,
           int X,
           int Y,
           int Width,
           int Height,
           bool UseNewImage,
           IFormFile Picture
           )
        {
           
            var Question = await _applicationDbContext.EnergyBalanceQuestionUpdated
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Question not found");

            var cv = new EnergyBalanceQuestion_ControlVolume()
            {
                Correct = false,

                X = X,
                Y = Y,
                Width = Width,
                Height = Height,

                DataPoolId = Question.DataPoolId
            };

            Question.ControlVolumes.Add(cv);

            await _applicationDbContext.SaveChangesAsync();

            if (UseNewImage) {
                if (Picture is null)
                    return BadRequest("Please provide picture");

                //Verify Extension
                var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

                if (!fileExtensionIsValid)
                {
                    return BadRequest("Picture extenstion not valid");
                }

                //Picture
                var path = Path.Combine(
                    "wwwroot/SimpleClickableQuestions",
                    $"Question_{Question.Code.ToString()}");

                var URL = await SaveFile(path, Picture);
                cv.ImageURL = URL;

                await _applicationDbContext.SaveChangesAsync();
            }

            return Ok();

        }
    }
}
