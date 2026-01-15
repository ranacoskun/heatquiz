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
using QuizAPI.Models.Questions.FreebodyDiagramQuestion;
using QuizAPI.Models.Questions.FreebodyDiagramQuestion.ViewModels;
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
    public class FreebodyDiagramQuestionController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;

        private readonly int FREE_BODY_DIAGRAM_QUESTION_PARAMETER = +6;

        private readonly string PROF_WILKO_ID = "b19e0712-bd5c-4bb2-ac5b-7e1713765cdc";

        IHttpContextAccessor _httpContextAccessor;

        public FreebodyDiagramQuestionController(
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
            var Question = await _applicationDbContext.FreebodyDiagramQuestion

                //Meta data
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)

                //Owners
                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)

                //Object bodies
                .Include(q => q.ObjectBodies)
                .ThenInclude(ob => ob.VectorTerms)
                .ThenInclude(tq => tq.Keyboard)


                .Include(q => q.ObjectBodies)
                .ThenInclude(ob => ob.VectorTerms)
                .ThenInclude(tq => tq.Answers)
                .ThenInclude(answr => answr.AnswerElements)
                .ThenInclude(e => e.NumericKey)
                .ThenInclude(k => k.NumericKey)

                .Include(q => q.ObjectBodies)
                .ThenInclude(ob => ob.VectorTerms)
                .ThenInclude(tq => tq.Answers)
                .ThenInclude(answr => answr.AnswerElements)
                .ThenInclude(e => e.Image)
                .ThenInclude(e => e.Image)

        
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound();

            return Ok(_mapper.Map<FreebodyDiagramQuestion, FreebodyDiagramQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestion([FromBody] QuestionBaseViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            var Question = await _applicationDbContext.FreebodyDiagramQuestion

                //Meta data
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)

                //Owners
                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)

                //Object bodies
                .Include(q => q.ObjectBodies)
                .ThenInclude(ob => ob.VectorTerms)
                .ThenInclude(tq => tq.Keyboard)


                .Include(q => q.ObjectBodies)
                .ThenInclude(ob => ob.VectorTerms)
                .ThenInclude(tq => tq.Answers)
                .ThenInclude(answr => answr.AnswerElements)
                .ThenInclude(e => e.NumericKey)
                .ThenInclude(k => k.NumericKey)

                .Include(q => q.ObjectBodies)
                .ThenInclude(ob => ob.VectorTerms)
                .ThenInclude(tq => tq.Answers)
                .ThenInclude(answr => answr.AnswerElements)
                .ThenInclude(e => e.Image)
                .ThenInclude(e => e.Image)


                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound();

            var SeriesElements = await _applicationDbContext.QuestionSeriesElement
                .Where(se => se.QuestionId == Question.Id)
                .ToListAsync();

            _applicationDbContext.QuestionSeriesElement.RemoveRange(SeriesElements);
            await _applicationDbContext.SaveChangesAsync();

            _applicationDbContext.FreebodyDiagramQuestion.Remove(Question);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionSingleStep(
            string Code,
            int SubtopicId,
            int LODId,

            string QuestionText,
            int ArrowLength,

            IFormFile Picture,
            int Width,
            int Height,

            IFormFile PDF,
            IFormFile Video,

            string ObjectBodies,

            int DataPoolId
            )
        {
            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code Can't Be Empty");

            if (string.IsNullOrEmpty(QuestionText))
                return BadRequest("Question text Can't Be Empty");

            if (ArrowLength <= 0)
                return BadRequest("Arrow length should be a positive integer");

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
            var OBs = Newtonsoft.Json.JsonConvert.DeserializeObject
                <List<FreebodyDiagramQuestion_FBDViewModel>>(ObjectBodies);

            if (OBs is null)
                return BadRequest("Invalid data");

          
            //Check control volumes
            if (OBs.Count == 0)
                return BadRequest("Please provide objects");

            if (OBs.Sum(a => a.VectorTerms.Count()) < 1)
                return BadRequest("Please provide vector terms and provide association for each");

            var vectorTerms = OBs.Select(a => a.VectorTerms).SelectMany(r => r).ToList();

            //Check terms
           
            if (vectorTerms.Any(a => string.IsNullOrEmpty(a.Code) || string.IsNullOrEmpty(a.Latex)))
                return BadRequest("Vector terms should have a code and a latex");

            if (vectorTerms.Select(a => a.Code).Distinct().Count() != vectorTerms.Count())
                 return BadRequest("Vector term should have unique codes");

            if (vectorTerms.Select(a => a.Latex).Distinct().Count() != vectorTerms.Count())
                return BadRequest("Vector terms should have unique LaTeX ");

            //if (vectorTerms.Any(a => !a.Answers.Any()))
            //    return BadRequest("Vector terms should have at least an answer");

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
            var KeyboardIds = vectorTerms
               .Select(bc => bc.KeyboardId)
               .Where(a => a.HasValue)
               .ToList();

            KeyboardIds = KeyboardIds.Distinct().ToList();

            var VTKeyboards = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .Where(k => KeyboardIds.Any(q => q == k.Id))
                .ToListAsync();

            if (VTKeyboards.Count != KeyboardIds.Count)
                return BadRequest("Keyboards are not found");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Create question
            var Question = new FreebodyDiagramQuestion()
            {
                Type = FREE_BODY_DIAGRAM_QUESTION_PARAMETER,

                Code = Code,
                LevelOfDifficulty = LOD,
                SubtopicId = Subtopic.Id,

                QuestionText = QuestionText,
                ArrowLength = ArrowLength,
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

            _applicationDbContext.FreebodyDiagramQuestion.Add(Question);
            await _applicationDbContext.SaveChangesAsync();

            //Add 
            foreach(var ob in OBs)
            {
                var new_ob = new FreebodyDiagramQuestion_FBD()
                {
                    X = ob.X,
                    Y = ob.Y,
                    Width = ob.Width,
                    Height = ob.Height,
                    Color = ob.Color,

                    Comment = ob.Comment,

                    DataPoolId = DATA_POOL.Id
                };

                Question.ObjectBodies.Add(new_ob);
                await _applicationDbContext.SaveChangesAsync();
                
                foreach(var term in ob.VectorTerms)
                {
                    var new_vt = new FreebodyDiagramQuestion_VectorTerm()
                    {
                        DataPoolId = DATA_POOL.Id,

                        Code = term.Code,
                        Latex = term.Latex,
                        LatexText = term.LatexText,
                        Comment = term.Comment,

                        ArrowColor = term.ArrowColor,
                        Linear = term.Linear,

                        Angle= term.Angle,
                        Clockwise = term.Clockwise,

                        KeyboardId = term.Answers.Any() ? term.KeyboardId : null
                    };

                    new_ob.VectorTerms.Add(new_vt);
                    await _applicationDbContext.SaveChangesAsync();

                    foreach (var answer in term.Answers)
                    {
                       
                        var bc_keyboard = VTKeyboards.FirstOrDefault(k => k.Id == term.KeyboardId);

                        if (bc_keyboard is null) continue;

                        var new_answer = new FreebodyDiagramQuestion_GeneralAnswer()
                        {
                            DataPoolId = DATA_POOL.Id,
                        };

                        new_vt.Answers.Add(new_answer);
                        await _applicationDbContext.SaveChangesAsync();

                        foreach (var answer_element in answer.AnswerElements.OrderBy(a => a.Order))
                        {
                            var imageId = bc_keyboard
                                .VariableKeyImages.FirstOrDefault(r => r.ImageId == answer_element.ImageId);

                            var numericKeyId = bc_keyboard
                                .NumericKeys.FirstOrDefault(r => r.NumericKeyId == answer_element.NumericKeyId);

                            var new_answer_element = new FreebodyDiagramQuestion_GeneralAnswerElement()
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
                      
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditQuestionBackgroundImage(int QuestionId, IFormFile Picture)
        {
            //Check Question Exists
            var Question = await _applicationDbContext.FreebodyDiagramQuestion
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

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }



        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionText([FromBody] FreebodyDiagramQuestionViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var question = await _applicationDbContext.FreebodyDiagramQuestion
                .FirstOrDefaultAsync(q => q.Id == VM.Id);

            if (question is null)
                return NotFound("Question not found");

            //Check code and latex not null
            if (string.IsNullOrEmpty(VM.QuestionText))
                return BadRequest("Question should have text explaining task");

            question.QuestionText = VM.QuestionText;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddObjectBody(
           [FromBody] FreebodyDiagramQuestion_FBDViewModel VM
           )
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var Question = await _applicationDbContext.FreebodyDiagramQuestion
                .FirstOrDefaultAsync(q => q.Id == VM.QuestionId);

            if (Question is null)
                return NotFound("Question not found");

            var ob = new FreebodyDiagramQuestion_FBD()
            {
                X = VM.X,
                Y = VM.Y,
                Width = VM.Width,
                Height = VM.Height,

                DataPoolId = Question.DataPoolId
            };

            Question.ObjectBodies.Add(ob);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteObjectBody(int Id)
        {
            var question = await _applicationDbContext.FreebodyDiagramQuestion
                .Include(q => q.ObjectBodies)
                .FirstOrDefaultAsync(q => q.ObjectBodies.Any(ob => ob.Id == Id));

            if (question is null)
                return NotFound("Body not found");

            var removeOB = question.ObjectBodies.FirstOrDefault(ob => ob.Id == Id);


            question.ObjectBodies.Remove(removeOB);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddVectorTerm(
           int QuestionId,
           string Code,
           string Latex,
           string LatexText,
           string ArrowColor,
           bool Linear,

           int SelectedObjectbodyId,

           float Angle,
           bool Clockwise,

           int KeyboardId,

           string Answers
           )
        {
            var Question = await _applicationDbContext.FreebodyDiagramQuestion
                .Include(t => t.ObjectBodies)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Question not found");

            if (string.IsNullOrEmpty(Code) || string.IsNullOrEmpty(Latex))
                return BadRequest("Question should have a Code/LaTeX");

            if (string.IsNullOrEmpty(ArrowColor))
                return BadRequest("Please specify arrow color");

            //Check latex is unique 
            if (Question.ObjectBodies.Any(b => b.VectorTerms.Any(t => t.Code == Code || t.Latex == Latex)))
                return BadRequest("Code/LaTeX are repeated");

            var selectedOB = Question.ObjectBodies.FirstOrDefault(ob => ob.Id == SelectedObjectbodyId);

            if (selectedOB is null)
                return BadRequest("Object body not found");

            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .FirstOrDefaultAsync(k => k.Id == KeyboardId);

          
            var answers = Newtonsoft.Json.JsonConvert.DeserializeObject
                <List<EnergyBalanceQuestion_GeneralAnswerViewModel>>(Answers);

            if (Keyboard != null && !Answers.Any())
                return NotFound("Please add answers");
            /*if (answers is null)
                return BadRequest("Please provide answers");

            if (!answers.Any())
                return BadRequest("Please provide answers");*/

            var VT = new FreebodyDiagramQuestion_VectorTerm()
            {
                Code = Code,
                Latex = Latex,
                LatexText = LatexText,
                ArrowColor = ArrowColor,
                Keyboard = Keyboard,
                DataPoolId = Question.DataPoolId,

                Linear = Linear,
                Angle = Angle,
                Clockwise = Clockwise
                
            };

            selectedOB.VectorTerms.Add(VT);

            await _applicationDbContext.SaveChangesAsync();

            if(Keyboard != null && answers.Any())
            {
                foreach (var answer in answers)
                {
                    var new_answer = new FreebodyDiagramQuestion_GeneralAnswer()
                    {
                        DataPoolId = Question.DataPoolId,
                    };

                    VT.Answers.Add(new_answer);
                    await _applicationDbContext.SaveChangesAsync();

                    foreach (var answer_element in answer.AnswerElements.OrderBy(a => a.Order))
                    {
                        var imageId = Keyboard
                            .VariableKeyImages.FirstOrDefault(r => r.ImageId == answer_element.ImageId);

                        var numericKeyId = Keyboard
                            .NumericKeys.FirstOrDefault(r => r.NumericKeyId == answer_element.NumericKeyId);

                        var new_answer_element = new FreebodyDiagramQuestion_GeneralAnswerElement()
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
            }

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteVectorTerm(int Id)
        {
            var question = await _applicationDbContext.FreebodyDiagramQuestion
                  .Include(q => q.ObjectBodies)
                  .ThenInclude(ob => ob.VectorTerms)
                  .FirstOrDefaultAsync(q => q.ObjectBodies.Any(ob => ob.VectorTerms.Any(t => t.Id == Id)));

            if (question is null)
                return BadRequest("Data not found");

            var allVTs = question
                .ObjectBodies
                .Select(ob => ob.VectorTerms)
                .SelectMany(r => r).ToList();

            //if(allVTs.Count() < 2)
            //    return BadRequest("Question should have atleast one vector term");

            var editedOB = question.ObjectBodies.FirstOrDefault(ob => ob.VectorTerms.Any(t => t.Id == Id));

            var editedVT = editedOB.VectorTerms.FirstOrDefault(t => t.Id == Id);

            editedOB.VectorTerms.Remove(editedVT);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditArrowLength(int QuestionId, int Length)
        {
            var question = await _applicationDbContext.FreebodyDiagramQuestion
             .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (question is null)
                return BadRequest("Data not found");

            if(Length <= 0)
                return BadRequest("Arrow length should be higher than zero");

            question.ArrowLength = Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }


        [HttpPost("[action]")]
        public async Task<IActionResult> EditVTCodeLatexTextAngleDirection([FromBody] FreebodyDiagramQuestion_VectorTermViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var question = await _applicationDbContext.FreebodyDiagramQuestion
                .Include(q => q.ObjectBodies)
                .ThenInclude(ob => ob.VectorTerms)
                .FirstOrDefaultAsync(q => q.ObjectBodies.Any(ob => ob.VectorTerms.Any(t => t.Id == VM.Id)));

            if (question is null)
                return BadRequest("Data not found");

            //Check code and latex not null
            if (string.IsNullOrEmpty(VM.Code) || string.IsNullOrEmpty(VM.Latex))
                return BadRequest("Boundary condition should have a code and a LaTex");

            //Check code and Latex are unique
            if (question.ObjectBodies.Any(ob =>  ob.VectorTerms.Any(t => t.Id != VM.Id && (t.Code == VM.Code || t.Latex == VM.Latex))))
                return BadRequest("Repeated code/LaTeX");

            var editedVT = question.ObjectBodies.FirstOrDefault(ob => ob.VectorTerms.Any(t => t.Id == VM.Id))
                .VectorTerms.FirstOrDefault(t => t.Id == VM.Id);

            editedVT.Code = VM.Code;
            editedVT.Latex = VM.Latex;
            editedVT.LatexText = VM.LatexText;

            editedVT.Angle = VM.Angle;
            editedVT.Clockwise = VM.Clockwise;

            editedVT.Comment = VM.Comment;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditVTColor([FromBody] FreebodyDiagramQuestion_VectorTermViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var vector_term = await _applicationDbContext.FreebodyDiagramQuestion_VectorTerm

                .FirstOrDefaultAsync(vt => vt.Id == VM.Id);

            if (vector_term is null)
                return BadRequest("Data not found");

            vector_term.ArrowColor = VM.ArrowColor;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditOBColor([FromBody] FreebodyDiagramQuestion_FBDViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var ob = await _applicationDbContext.FreebodyDiagramQuestion_FBD

                .FirstOrDefaultAsync(vt => vt.Id == VM.Id);

            if (ob is null)
                return BadRequest("Data not found");

            ob.Color = VM.Color;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditOBComment([FromBody] FreebodyDiagramQuestion_FBDViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var ob = await _applicationDbContext.FreebodyDiagramQuestion_FBD

                .FirstOrDefaultAsync(vt => vt.Id == VM.Id);

            if (ob is null)
                return BadRequest("Body not found");

            ob.Comment = VM.Comment;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }


        [HttpPost("[action]")]
        public async Task<IActionResult> EditVTAssociation(int VTId, int OBId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var question = await _applicationDbContext.FreebodyDiagramQuestion
                .Include(q => q.ObjectBodies)
                .ThenInclude(ob => ob.VectorTerms)
                .FirstOrDefaultAsync(q => q.ObjectBodies.Any(ob => ob.VectorTerms.Any(t => t.Id == VTId)));

            if (question is null)
                return BadRequest("Data not found");

            var editedVT = question.ObjectBodies.FirstOrDefault(ob => ob.VectorTerms.Any(t => t.Id == VTId))
                .VectorTerms.FirstOrDefault(t => t.Id == VTId);

            var newOB = question.ObjectBodies.FirstOrDefault(ob => ob.Id == OBId);

            if (newOB is null)
                return BadRequest("Selected body object not found");

            editedVT.BodyObjectId = newOB.Id;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditVTGroupAssociation(List<int> VTIds, int OBId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var question = await _applicationDbContext.FreebodyDiagramQuestion
                .Include(q => q.ObjectBodies)
                .ThenInclude(ob => ob.VectorTerms)
                .FirstOrDefaultAsync(q => 
                q.ObjectBodies.Any(ob => ob.VectorTerms.Any(t => VTIds.Any(vtId => vtId == t.Id))));

            if (question is null)
                return BadRequest("Data not found");

            var allVTs = question
                .ObjectBodies
                .Select(ob => ob.VectorTerms)
                .SelectMany(r => r).ToList();

            var editedVTs = allVTs.Where(t => VTIds.Any(vtId => vtId == t.Id));

            if (editedVTs.Count() != VTIds.Distinct().Count())
                return BadRequest("Data not found");
                
            var newOB = question.ObjectBodies.FirstOrDefault(ob => ob.Id == OBId);

            if (newOB is null)
                return BadRequest("Selected body object not found");

            foreach(var vt in editedVTs)
            {
                vt.BodyObjectId = newOB.Id;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }
    }
}
