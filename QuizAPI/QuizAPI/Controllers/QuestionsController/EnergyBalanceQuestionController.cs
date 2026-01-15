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
    public class EnergyBalanceQuestionController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;
        private readonly int CLICKABLE_QUESTION_PARAMETER = +1;
        private readonly int KEYBOARD_QUESTION_PARAMETER = +2;
        private readonly int MUTLIPLE_CHOICE_QUESTION_PARAMETER = +3;
        private readonly int ENERGY_BALANCE_QUESTION_PARAMETER = +4;

        private readonly string PROF_WILKO_ID = "b19e0712-bd5c-4bb2-ac5b-7e1713765cdc";

        IHttpContextAccessor _httpContextAccessor;

        public EnergyBalanceQuestionController(
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
            var Question = await _applicationDbContext.EnergyBalanceQuestion
                .Include(q => q.LevelOfDifficulty)

                .Include(q => q.Subtopic)
                .ThenInclude(s => s.Topic)
                .Include(q => q.QuestionAttribures)

                 .Include(q => q.Labels)

                .Include(q => q.ClickableParts)
                .ThenInclude(cp => cp.Relations)

                 .Include(q => q.ClickableParts)
                .ThenInclude(cp => cp.Background_Image)


                .Include(q => q.Questions)
                .ThenInclude(cp => cp.Keyboard)
                .ThenInclude(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)

                .Include(q => q.Questions)
                .ThenInclude(cp => cp.Keyboard)
                .ThenInclude(k => k.VariableKeys)
                .ThenInclude(vk => vk.VariableKey)
                .ThenInclude(vk => vk.VariablesChars)

                .Include(q => q.Questions)
                .ThenInclude(cp => cp.Keyboard)
                .ThenInclude(k => k.VariableKeyImages)
                .ThenInclude(vk => vk.Image)

                .Include(q => q.Questions)
                .ThenInclude(ci => ci.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(e => e.NumericKey)
                .ThenInclude(nk => nk.NumericKey)

                .Include(q => q.Questions)
                .ThenInclude(ci => ci.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(e => e.Image)
                .ThenInclude(e => e.Image)

                //Boundry Conditions

                .Include(cp => cp.BoundryConditionKeyboard)
                .ThenInclude(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)

                 .Include(cp => cp.BoundryConditionKeyboard)
                .ThenInclude(k => k.VariableKeys)
                .ThenInclude(nk => nk.VariableKey)

                .Include(cp => cp.BoundryConditionKeyboard)
                .ThenInclude(k => k.VariableKeyImages)
                .ThenInclude(nk => nk.Image)

                .Include(q => q.BoundryConditions)
                .ThenInclude(ci => ci.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(e => e.NumericKey)
                .ThenInclude(nk => nk.NumericKey)

                .Include(q => q.BoundryConditions)
                .ThenInclude(ci => ci.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(e => e.Image)
                .ThenInclude(e => e.Image)
                //

                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound();

            return Ok(_mapper.Map<EnergyBalanceQuestion, EnergyBalanceQuestionViewModel>(Question));
        }
        
        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionSingleStep(
            string Code,
            string Latex,
            string FLatex,
            float ArrowRadius,
            int SubtopicId,
            int LODId,
            int BoundryConditionsKeyboardId,
            bool Public,
            List<string> Attributes,
            IFormFile Picture,
            int Width,
            int Height,
            IFormFile PDF,
            IFormFile Video,
            string  _Questions,
            string _ClickableParts,
            string _BoundryConditions,
            List<string> Labels,
            int DataPoolId
            )
        {
           

            //Check Code not Null
            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code Can't Be Empty");

            if (string.IsNullOrEmpty(Latex))
                return BadRequest("General text Can't Be Empty");
            
            if (string.IsNullOrEmpty(FLatex))
                return BadRequest("Fluxes text Can't Be Empty");

            if (ArrowRadius < 1)
                return BadRequest("Please provide valid arrow radius");

            if (Picture is null)
                return BadRequest("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var CodeTaken = await _applicationDbContext.QuestionBase
                .AnyAsync(q => q.Code == Code && q.DataPoolId == DATA_POOL.Id);

            if (CodeTaken)
                return BadRequest("Code Taken, Choose Different Code");

            //Get Level Of Difficulty
            var LOD = await _applicationDbContext.LevelsOfDifficulty
                .FirstOrDefaultAsync(l => l.Id ==LODId);

            if (LOD is null)
                return BadRequest("Level Of Difficulty Not Found");

            //Subtopic
            var Subtopic = await _applicationDbContext.Subtopics
                .FirstOrDefaultAsync(s => s.Id == SubtopicId);

            if (Subtopic is null)
                return BadRequest("Subtopic Not Found");

            var ClickableParts = Newtonsoft.Json.JsonConvert.DeserializeObject<List<AddEBQsinglestep_clickable>>(_ClickableParts);
            var Questions = Newtonsoft.Json.JsonConvert.DeserializeObject<List<AddEBQsinglestep_question>>(_Questions);
            var BoundryConditions = Newtonsoft.Json.JsonConvert.DeserializeObject<List<AddEBQsinglestep_boundrycondition>>(_BoundryConditions);

            if (ClickableParts is null)
                return BadRequest("Invalid Data Of Click Parts");

            if (Questions is null)
                return BadRequest("Invalid Data Of Questioneers");

            if (BoundryConditions is null)
                return BadRequest("Invalid Data Of Boundary Conditions");

            //Check clickable parts
            if (ClickableParts.Count == 0)
                return BadRequest("Please provide clickable parts");

            if (ClickableParts.Any(cp => !cp.Relations.Any()))
                return BadRequest("Please provide clickable parts with relations");

            if (ClickableParts.Any(cp => cp.Relations.Any(r => !r.IsDummy &&(!r.Directions.Any() || !r.Questions.Any()))))
                return BadRequest("Please provide clickable parts with proper relations");

            //Check questioneers
            if (Questions.Any(p => p.Answers.Count == 0 ))
                return BadRequest("Please provide answers to all questioneers");

            if (Questions.Any(p =>  string.IsNullOrEmpty(p.Latex)))
                return BadRequest("Please provide LaTex to all questioneers");

            if (Questions.Any(p => string.IsNullOrEmpty(p.Code)))
                return BadRequest("Please provide Code to all questioneers");

            if (Questions.Select(p => p.Code).Distinct().Count() != Questions.Select(p => p.Code).Count())
                return BadRequest("Please provide distinct Code to all questioneers");


            //Labels
            if (!Labels.Any())
                return BadRequest("Please provide labels");

            if (Labels.Distinct().Count() != Labels.Count)
                return BadRequest("Please provide distinct labels");

            //Check Keyboards
            var KeyboardIds = Questions.Select(p => p.KeyboardId).ToList();
            KeyboardIds = KeyboardIds.Distinct().ToList();


            var Keyboards = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .Where(k => KeyboardIds.Any(kId => kId == k.Id) && k.DataPoolId == DATA_POOL.Id)
                .ToListAsync();

            if (Keyboards.Count != KeyboardIds.Count  || Keyboards.Count == 0)
                return BadRequest("Some keyboards not found");

            //Boundry Conditions

            var BoundryConditionKeyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .FirstOrDefaultAsync(k => k.Id == BoundryConditionsKeyboardId && k.DataPoolId == DATA_POOL.Id);

            if (BoundryConditionKeyboard is null && BoundryConditionsKeyboardId != 0)
                return NotFound("Boundary conditions keyboard not found");


            if (Questions.Any(p => string.IsNullOrEmpty(p.Code)))
                return BadRequest("Please provide Code to all Boundary conditions boxes");

            if (BoundryConditions.Count != BoundryConditions.Select(bc => bc.Code).Distinct().Count())
                return BadRequest("Provide Unique Boundary conditions codes");

            //Check Background Images
            var BIs = await _applicationDbContext.BackgroundImage
                .Where((bi) =>
                
                ClickableParts.Where((cp => cp.BackgroundImageId.HasValue))
                .Any(cp => cp.BackgroundImageId == bi.Id))
                .ToListAsync(); 

            if(BIs.Count != ClickableParts.Where((cp => cp.BackgroundImageId.HasValue))
                .Select(cp => cp.BackgroundImageId).Distinct().Count())
                return BadRequest("Some background images not found");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var Question = new EnergyBalanceQuestion()
            {
                Code = Code,
                Type = ENERGY_BALANCE_QUESTION_PARAMETER,
                LevelOfDifficulty = LOD,
                SubtopicId = Subtopic.Id,
                BoundryConditionKeyboardId = BoundryConditionKeyboard != null ? new Nullable<int>(BoundryConditionKeyboard.Id) : null,
                Public = Public,
                EBLatex = Latex,
                EBFLatex = FLatex,
                ArrowRadius = (int)ArrowRadius,
                QuestionAttribures = Attributes.Select(a => new QuestionAttribure()
                {
                    Name = a
                }).ToList(),
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

            //Labels
            Question.Labels.AddRange(Labels.Select(l => new EB_Label()
            {
                Name = l,
                DataPoolId = DATA_POOL.Id
            }).ToList());

            _applicationDbContext.EnergyBalanceQuestion.Add(Question);
            await _applicationDbContext.SaveChangesAsync();

            //Questions
            foreach (var q in Questions)
            {
                var new_q = new EB_Question()
                {
                    Code = q.Code,
                    Latex = q.Latex,
                    KeyboardId = Keyboards.FirstOrDefault(k => k.Id == q.KeyboardId).Id,
                    Ingoing = q.Ingoing.HasValue ? q.Ingoing : false,
                    DataPoolId = DATA_POOL.Id

                };

                Question.Questions.Add(new_q);
                await _applicationDbContext.SaveChangesAsync();

                foreach (var a in q.Answers)
                {
                    var new_a = new EB_Answer()
                    {
                       
                        Type = (int)EB_ANSWER_TYPE.CONDUCTION,
                        DataPoolId = DATA_POOL.Id
                    };

                    new_q.Answers.Add(new_a);
                    await _applicationDbContext.SaveChangesAsync();

                    foreach (var aa in a.AnswerElements.OrderBy(aavm=> aavm.Order))
                    {
                        var new_aa = new EB_AnswerElement()
                        {

                            ImageId = aa.ImageId.HasValue ?
                        new Nullable<int>(Keyboards.FirstOrDefault(k => k.Id == q.KeyboardId).VariableKeyImages.FirstOrDefault(r => r.ImageId == aa.ImageId).Id) : null,

                            Value = aa.Value,

                            NumericKeyId = aa.NumericKeyId.HasValue ?
                        new Nullable<int>(Keyboards.FirstOrDefault(k => k.Id == q.KeyboardId).NumericKeys.FirstOrDefault(r => r.NumericKeyId == aa.NumericKeyId).Id) : null,
                            DataPoolId = DATA_POOL.Id
                        };

                        new_a.AnswerElements.Add(new_aa);
                        await _applicationDbContext.SaveChangesAsync();

                    }
                }
            }

            /*
            Question.Questions.AddRange(Questions.Select(q => new EB_Question()
            {
                Code = q.Code,
                Latex = q.Latex,
                KeyboardId = Keyboards.FirstOrDefault(k => k.Id == q.KeyboardId).Id,
                Ingoing = q.Ingoing.HasValue ? q.Ingoing : false,
                Answers = q.Answers.Select((cd_an) => new EB_Answer()
                {
                    AnswerElements = cd_an.AnswerElements.OrderBy(ae => ae.Order).Select((ae) => new EB_AnswerElement()
                    {

                        ImageId = ae.ImageId.HasValue ?
                        new Nullable<int>(Keyboards.FirstOrDefault(k => k.Id == q.KeyboardId).VariableKeyImages.FirstOrDefault(r => r.ImageId == ae.ImageId).Id) : null,

                        Value = ae.Value,

                        NumericKeyId = ae.NumericKeyId.HasValue ?
                        new Nullable<int>(Keyboards.FirstOrDefault(k => k.Id == q.KeyboardId).NumericKeys.FirstOrDefault(r => r.NumericKeyId == ae.NumericKeyId).Id) : null

                    }).ToList(),
                    Type = (int)EB_ANSWER_TYPE.CONDUCTION
                }).ToList()
            }).ToList());
            */

            //Boundry Conditions
            foreach (var bc in BoundryConditions)
            {
                var new_bc = new EB_BoundryCondition()
                {
                    Code = bc.Code,
                    DataPoolId = DATA_POOL.Id

                };
                Question.BoundryConditions.Add(new_bc); 
                await _applicationDbContext.SaveChangesAsync();

                foreach(var a in bc.Answers)
                {
                    var new_a = new EB_Answer()
                    {
                        Type = (int)EB_ANSWER_TYPE.CONDUCTION,
                        DataPoolId = DATA_POOL.Id
                    };

                    new_bc.Answers.Add(new_a);
                    await _applicationDbContext.SaveChangesAsync();

                    foreach (var aa in a.AnswerElements.OrderBy(aavm => aavm.Order))
                    {
                        var new_aa = new EB_AnswerElement()
                        {

                            ImageId = aa.ImageId.HasValue ? new Nullable<int>(BoundryConditionKeyboard.VariableKeyImages.FirstOrDefault(r => r.ImageId == aa.ImageId).Id) : null,

                            Value = aa.Value,

                            NumericKeyId = aa.NumericKeyId.HasValue ? new Nullable<int>(BoundryConditionKeyboard.NumericKeys.FirstOrDefault(r => r.NumericKeyId == aa.NumericKeyId).Id) : null,
                            DataPoolId = DATA_POOL.Id
                        };

                        new_a.AnswerElements.Add(new_aa);
                        await _applicationDbContext.SaveChangesAsync();

                    }
                }
            }

            /*
            Question.BoundryConditions.AddRange(BoundryConditions.Select(q => new EB_BoundryCondition()
            {
                Code = q.Code,

                Answers = q.Answers.Select((cd_an) => new EB_Answer()
                {
                    AnswerElements = cd_an.AnswerElements.OrderBy(ae => ae.Order).Select((ae) => new EB_AnswerElement()
                    {

                        ImageId = ae.ImageId.HasValue ?
                        new Nullable<int>(BoundryConditionKeyboard.VariableKeyImages.FirstOrDefault(r => r.ImageId == ae.ImageId).Id) : null,

                        Value = ae.Value,

                        NumericKeyId = ae.NumericKeyId.HasValue ?
                        new Nullable<int>(BoundryConditionKeyboard.NumericKeys.FirstOrDefault(r => r.NumericKeyId == ae.NumericKeyId).Id) : null

                    }).ToList(),
                    Type = (int)EB_ANSWER_TYPE.CONDUCTION
                }).ToList()
            }).ToList());
            */

            //Clickable Parts
            Question.ClickableParts.AddRange(ClickableParts.Select(ci =>
             new EB_ClickablePart()
                {
                    X = ci.X,
                    Y = ci.Y,

                    RelativeToImageX = ci.RelativeToImageX,
                    RelativeToImageY = ci.RelativeToImageY,

                    NorthX = ci.NorthX,
                    NorthY = ci.NorthY,

                    SouthX = ci.SouthX,
                    SouthY = ci.SouthY,

                    EastX = ci.EastX,
                    EastY = ci.EastY,

                    WestX = ci.WestX,
                    WestY = ci.WestY,

                    Width = ci.Width,
                    Height = ci.Height,

                    Background_ImageId = ci.BackgroundImageId,

                    Relations = ci.Relations.Select((r) =>
                    {
                        var List = new List<EB_Q_L_D_Relation>();

                        foreach(var question in r.Questions)
                        {
                            List.Add(new EB_Q_L_D_Relation()
                            {
                                EB_Question = Question.Questions.FirstOrDefault((q) => q.Code == question),
                                Label = Question.Labels.FirstOrDefault((q) => q.Name == r.Label),
                                Correct = r.Correct,
                                IsDummy = r.IsDummy,
                                DataPoolId = DATA_POOL.Id
                            });
                        }

                        foreach (var d in r.Directions)
                        {
                            List.Add(new EB_Q_L_D_Relation()
                            {
                                Label = Question.Labels.FirstOrDefault((q) => q.Name == r.Label),
                                Direction = d,
                                IsDummy = r.IsDummy,
                                DataPoolId = DATA_POOL.Id

                            });
                        }

                        /*Console.WriteLine("*****");
                        Console.WriteLine("Label = " + r.Label);
                        Console.WriteLine("List = " + List.Count);
                        Console.WriteLine("Questions = " + string.Join(',', r.Questions));
                        Console.WriteLine("Directions = " + string.Join(',', r.Directions));
                        Console.WriteLine("*****");*/

                        return List;
                    }).SelectMany(r => r)
                    .ToList(),
                 DataPoolId = DATA_POOL.Id

             }));

            

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
        
        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestion([FromBody] QuestionBaseViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            //Check Question Exists
            var Question = await _applicationDbContext.EnergyBalanceQuestion
                

                 .Include(q => q.Labels)

                .Include(q => q.ClickableParts)
                .ThenInclude(cp => cp.Relations)


                .Include(q => q.Questions)
                .ThenInclude(cp => cp.Keyboard)
                .ThenInclude(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)


                .Include(q => q.Questions)
                .ThenInclude(ci => ci.Answers)
                .ThenInclude(a => a.AnswerElements)
               

                .Include(q => q.BoundryConditions)
                .ThenInclude(ci => ci.Answers)
                .ThenInclude(a => a.AnswerElements)
           

                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            var SeriesElements = await _applicationDbContext.QuestionSeriesElement
                .Where(se => se.QuestionId == Question.Id)
                .ToListAsync();

            _applicationDbContext.QuestionSeriesElement.RemoveRange(SeriesElements);
            await _applicationDbContext.SaveChangesAsync();

            _applicationDbContext.EnergyBalanceQuestion.Remove(Question);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditGeneralLatex(string Latex, int Id, int DataPoolId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            //Check Question Exists
            var Question = await _applicationDbContext.EnergyBalanceQuestion


                .FirstOrDefaultAsync(q => q.Id == Id);

            if (Question is null)
                return NotFound("Question Not Found");

            if (string.IsNullOrEmpty(Latex))
                return BadRequest("General text Can't Be Empty");

            Question.EBLatex = Latex;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditFluxesLatex(string Latex, int Id, int DataPoolId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            //Check Question Exists
            var Question = await _applicationDbContext.EnergyBalanceQuestion


                .FirstOrDefaultAsync(q => q.Id == Id);

            if (Question is null)
                return NotFound("Question Not Found");


            if (string.IsNullOrEmpty(Latex))
                return BadRequest("Fluxes text Can't Be Empty");

            Question.EBFLatex = Latex;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditQuestionImage(int QuestionId, IFormFile Picture)
        {
            //Check Question Exists
            var Question = await _applicationDbContext.EnergyBalanceQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound($"Question {QuestionId} Not Found");

            if (Picture is null)
                return BadRequest("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            //Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/KeyboardQuestions",
                $"Question_{Question.Id.ToString()}",
                "Image");

            var URL = await SaveFile(path, Picture);

            Question.Base_ImageURL = URL;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> EditLabelLatex(int LabelId, string Latex)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Question = await _applicationDbContext.EnergyBalanceQuestion
                .Include(q => q.Labels) 
                .FirstOrDefaultAsync(q => q.Labels.Any(l => l.Id == LabelId));

            if (Question is null)
                return NotFound("Label Not Found");

            if(Question.Labels.Any( l=> l.Name == Latex && l.Id != LabelId))
                return BadRequest("Label LaTeX already used");

            var Label = Question.Labels.FirstOrDefault(l => l.Id == LabelId);


            Label.Name = Latex;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionCode(int QuestionId, string Code)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            if (string.IsNullOrEmpty(Code))
                return NotFound("Code can't be empty");

            var Question = await _applicationDbContext.EnergyBalanceQuestion
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Questions.Any(qq => qq.Id == QuestionId));

            if (Question is null)
                return NotFound("Question Not Found");

            if (Question.Questions.Any(qq => qq.Code == Code && qq.Id != QuestionId))
                return BadRequest("Question LaTeX already used");

            var qu = Question.Questions.FirstOrDefault(qq => qq.Id == QuestionId);

            qu.Code = Code;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> FlipQuestion(int QuestionId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Question = await _applicationDbContext.EnergyBalanceQuestion
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Questions.Any(qq => qq.Id == QuestionId));

            if (Question is null)
                return NotFound("Question Not Found");

            var qu = Question.Questions.FirstOrDefault(qq => qq.Id == QuestionId);

            qu.Ingoing = !qu.Ingoing;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionLatex(int QuestionId, string Latex)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            if (string.IsNullOrEmpty(Latex))
                return NotFound("Latex can't be empty");

            var Question = await _applicationDbContext.EnergyBalanceQuestion
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Questions.Any(qq => qq.Id == QuestionId));

            if (Question is null)
                return NotFound("Question Not Found");

            if (Question.Questions.Any(qq => qq.Latex == Latex && qq.Id != QuestionId))
                return BadRequest("Question LaTeX already used");

            var qu = Question.Questions.FirstOrDefault(qq => qq.Id == QuestionId);


            qu.Latex = Latex;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionLabel(int QuestionId, string Latex)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Question = await _applicationDbContext.EnergyBalanceQuestion
                .Include(q => q.Labels)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Question Not Found");

            if (string.IsNullOrEmpty(Latex))
                return NotFound("Name can't be empty");

            if (Question.Labels.Any(l => l.Name == Latex))
                return BadRequest("Label Name already used");

            var Label = new EB_Label()
            {
                DataPoolId = Question.DataPoolId,
                Name = Latex
            };

            Question.Labels.Add(Label);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveLabel(int QuestionId, int LabelId)
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestion
                  .Include(q => q.ClickableParts)
                  .ThenInclude(cp => cp.Relations)
                  .Include(q => q.Labels)
                  .Include(q => q.Questions)
                  .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Question not found");

            var Label = Question.Labels.FirstOrDefault(l => l.Id == LabelId);

            if (Label is null)
                return NotFound("Label not found");

            Question.Labels.Remove(Label);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DummyUnDummyLabel(int QuestionId, int LabelId)
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestion
                  .Include(q => q.ClickableParts)
                  .ThenInclude(cp => cp.Relations)
                  .Include(q => q.Labels)
                  .Include(q => q.Questions)
                  .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Question not found");

            var Label = Question.Labels.FirstOrDefault(l => l.Id == LabelId);

            if (Label is null)
                return NotFound("Label not found");
            
            var rmv_Relations = Question.ClickableParts[0].Relations
                .Where(r => r.LabelId == Label.Id && !r.EB_QuestionId.HasValue && r.IsDummy)
                .ToList();

            var kp_Relations = Question.ClickableParts[0].Relations
                .Where(r => r.LabelId == Label.Id && r.EB_QuestionId.HasValue && r.IsDummy)
                .ToList();

            //UnDummy
            if (rmv_Relations.Any() || kp_Relations.Any())
            {
                foreach(var r in rmv_Relations)
                {
                    Question.ClickableParts[0].Relations.Remove(r);

                }

                foreach (var r in kp_Relations)
                {
                    r.IsDummy = false;
                }
            }
            //Make Dummy
            else
            {
                if(!Question.ClickableParts[0].Relations.Any(r => r.EB_QuestionId.HasValue))
                {
                    return BadRequest("Please add atleast a question to relationship so that label can be made Dummy!");
                }

                var delete_Relations = Question.ClickableParts[0].Relations
                .Where(r => r.LabelId == Label.Id && !r.EB_QuestionId.HasValue)
                .ToList();

                foreach (var r in delete_Relations)
                {
                    Question.ClickableParts[0].Relations.Remove(r);

                }

                var keep_Relations = Question.ClickableParts[0].Relations
               .Where(r => r.LabelId == Label.Id && r.EB_QuestionId.HasValue)
               .ToList();

                foreach (var r in keep_Relations)
                {
                    r.IsDummy = true;
                }
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveRelation(int QuestionId, int RelationId)
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestion
                  .Include(q => q.ClickableParts)
                  .ThenInclude(cp => cp.Relations)
                  .Include(q => q.Labels)
                  .Include(q => q.Questions)
                  .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Question not found");

            var Relation = Question.ClickableParts[0].Relations.FirstOrDefault(r => r.Id == RelationId);

            if (Relation is null)
                return NotFound("Relation not found");

            Question.ClickableParts[0].Relations.Remove(Relation);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveAnswer(int Q_QuestionId, int AnswerId)
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestion
                  .Include(q => q.Questions)
                  .ThenInclude(qq => qq.Answers)
                  .ThenInclude(a => a.AnswerElements)
                  .FirstOrDefaultAsync(q => q.Questions.Any(qq => qq.Id == Q_QuestionId));

            if (Question is null)
                return NotFound("Question not found");

            var Q_Question = Question.Questions.FirstOrDefault(q => q.Answers.Any(a => a.Id == AnswerId));

            var Answer = Q_Question.Answers.FirstOrDefault(a => a.Id == AnswerId);

            if (Answer is null)
                return NotFound("Answer not found");

            if (Q_Question.Answers.Count < 2)
                return NotFound("Question should have atleast one answer!");

            Q_Question.Answers.Remove(Answer);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestioneer(int Q_QuestionId)
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestion
                  .Include(q => q.Questions)
                  .ThenInclude(qq => qq.Answers)
                  .ThenInclude(a => a.AnswerElements)
                  .FirstOrDefaultAsync(q => q.Questions.Any(qq => qq.Id == Q_QuestionId));

            if (Question is null)
                return NotFound("Question not found");

            var Q_Question = Question.Questions.FirstOrDefault(qq => qq.Id == Q_QuestionId);


            if (Q_Question is null)
                return NotFound("Question not found");

            if (Question.Questions.Count < 2)
                return NotFound("Question should have atleast one questioneer!");

            Question.Questions.Remove(Q_Question);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddNewQuestion
            (int QuestionId,
            string Code,
            string Latex,
            string _Question

            )
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestion
                  .Include(q => q.Questions)
                  .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("Question not found");

            if(string.IsNullOrEmpty(Code))
                return BadRequest("Repeated Code");

            if (string.IsNullOrEmpty(Latex))
                return BadRequest("Repeated Latex");

            if (Question.Questions.Any(qq => qq.Code == Code))
                return BadRequest("Repeated Code");

            if (Question.Questions.Any(qq => qq.Latex == Latex))
                return BadRequest("Repeated Latex");

            var AddQuestion = Newtonsoft.Json.JsonConvert.DeserializeObject<AddEBQsinglestep_question>(_Question);

            if (AddQuestion is null)
                return BadRequest("Invalid Data Of Questioneer");

            if (AddQuestion.Answers.Count == 0)
                return BadRequest("No answers provided");

            var KeyboardId = AddQuestion.KeyboardId;

            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .Where(k => KeyboardId == k.Id && k.DataPoolId == Question.DataPoolId)
                .FirstOrDefaultAsync();

            if (Keyboard is null)
                return NotFound("Keyboard not found");

            var new_q = new EB_Question()
            {
                Code = AddQuestion.Code,
                Latex = AddQuestion.Latex,
                KeyboardId = Keyboard.Id,
                Ingoing = AddQuestion.Ingoing.HasValue ? AddQuestion.Ingoing : false,
                DataPoolId = Question.DataPoolId

            };

            Question.Questions.Add(new_q);
            await _applicationDbContext.SaveChangesAsync();

            foreach (var a in AddQuestion.Answers)
            {
                var new_a = new EB_Answer()
                {

                    Type = (int)EB_ANSWER_TYPE.CONDUCTION,
                    DataPoolId = Question.DataPoolId
                };

                new_q.Answers.Add(new_a);
                await _applicationDbContext.SaveChangesAsync();

                foreach (var aa in a.AnswerElements.OrderBy(aavm => aavm.Order))
                {
                    var new_aa = new EB_AnswerElement()
                    {

                        ImageId = aa.ImageId.HasValue ?
                    new Nullable<int>(Keyboard.VariableKeyImages.FirstOrDefault(r => r.ImageId == aa.ImageId).Id) : null,

                        Value = aa.Value,

                        NumericKeyId = aa.NumericKeyId.HasValue ?
                    new Nullable<int>(Keyboard.NumericKeys.FirstOrDefault(r => r.NumericKeyId == aa.NumericKeyId).Id) : null,
                        DataPoolId = Question.DataPoolId
                    };

                    new_a.AnswerElements.Add(new_aa);
                    await _applicationDbContext.SaveChangesAsync();

                }
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }



        [HttpPost("[action]")]
        public async Task<IActionResult> AddRelation([FromBody] AddEB_RelationViewModel VM)
        {
            var Question = await _applicationDbContext.EnergyBalanceQuestion
                .Include(q => q.ClickableParts)
                .ThenInclude(cp => cp.Relations)
                .Include(q => q.Labels)
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == VM.QuestionId);

            if (Question is null)
                return NotFound("Question not found");

            var Label = Question.Labels.FirstOrDefault(l => l.Id == VM.LabelId);

            if (Label is null)
                return NotFound("Label not found");

            var Questions = Question.Questions.Where(qq => VM.QuestionIds.Any(i => i == qq.Id)).ToList();

            if(Questions.Count != VM.QuestionIds.Distinct().Count())
                return NotFound("Some questioneers not found");

            if(Question.ClickableParts[0].Relations
                .Any(r => r.LabelId == Label.Id && !r.EB_QuestionId.HasValue && VM.Directions.Any(d => d == r.Direction)))
                return BadRequest("Repeated Directions");

            if (Question.ClickableParts[0].Relations.Any(r => r.LabelId == Label.Id && 
            r.EB_QuestionId.HasValue && VM.QuestionIds.Any(i => i == r.EB_QuestionId)))
                return BadRequest("Repeated Questions");

            var IsDummy = Question.ClickableParts[0].Relations.Any(r => r.LabelId == Label.Id && r.IsDummy);

            Question.ClickableParts[0].Relations.AddRange(VM.Directions.Select(d => new EB_Q_L_D_Relation()
            {
                DataPoolId = Question.DataPoolId,
                Direction = d,
                Correct = true,
                IsDummy = IsDummy,
                LabelId = Label.Id

            }).ToList());

            Question.ClickableParts[0].Relations.AddRange(VM.QuestionIds.Select(i => new EB_Q_L_D_Relation()
            {
                DataPoolId = Question.DataPoolId,
                EB_QuestionId = i,
                Correct = true,
                IsDummy = IsDummy,
                LabelId = Label.Id

            }).ToList());

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionAnswer([FromBody] AddKeyboardQuestionAnswerViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Question = await _applicationDbContext.EnergyBalanceQuestion
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .ThenInclude(a=> a.AnswerElements)

                .Include(q => q.Questions)
                .ThenInclude(q => q.Keyboard)
                .ThenInclude(k => k.VariableKeyImages)
                .ThenInclude(vk => vk.Image)

                .Include(q => q.Questions)
                .ThenInclude(q => q.Keyboard)
                .ThenInclude(k => k.NumericKeys)
                .FirstOrDefaultAsync(q => q.Questions.Any(qq => qq.Answers.Any(a => a.Id == VM.AnswerId)));

            if (Question is null)
                return NotFound("Question Not Found");

            //Check Answer Has Elements
            if (VM.Answer.Count == 0)
                return BadRequest("Answer Can't Be Empty");

            if (VM.Answer.All(a => a.ImageId is null && a.NumericKeyId is null))
                return BadRequest("Answer Should Include Numeric/Variable Values");

            //Check Answer Elements Exist in Keyboard
            var ImageIds = VM.Answer.Where((ae) => ae.ImageId.HasValue)
                .Select((ae) => ae.ImageId).ToList();

            var NumericIds = VM.Answer.Where((ae) => ae.NumericKeyId.HasValue)
                .Select((ae) => ae.NumericKeyId).ToList();


            var Answer = Question.Questions.FirstOrDefault(qq => qq.Answers.Any(a => a.Id == VM.AnswerId))
                .Answers.FirstOrDefault(a => a.Id == VM.AnswerId);

            var Keyboard = Question.Questions.FirstOrDefault(qq => qq.Answers.Any(a => a.Id == VM.AnswerId)).Keyboard;


            if (ImageIds.Any(id =>Keyboard.VariableKeyImages.All(i => i.ImageId != id)))
                return BadRequest("Some Variable Keys Used Do Not Exist In Keyboard");

            if (NumericIds.Any(id =>Keyboard.NumericKeys.All(i => i.NumericKeyId != id)))
                return BadRequest("Some Numeric Keys Used Do Not Exist In Keyboard");

            Answer.AnswerElements.Clear();

            foreach (var e in VM.Answer.OrderBy(a => a.Order))
            {
                var AddEelemnt = new EB_AnswerElement()
                {
                    ImageId = e.ImageId.HasValue ? new Nullable<int>(Keyboard.VariableKeyImages.FirstOrDefault(r => r.ImageId == e.ImageId).Id) : null,

                    Value = e.Value,

                    NumericKeyId = e.NumericKeyId.HasValue ?
                    new Nullable<int>(Keyboard.NumericKeys.FirstOrDefault(r => r.NumericKeyId == e.NumericKeyId).Id) : null

                };

                Answer.AnswerElements.Add(AddEelemnt);
                await _applicationDbContext.SaveChangesAsync();

            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionAnswer([FromBody] AddKeyboardQuestionAnswerViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Question = await _applicationDbContext.EnergyBalanceQuestion
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .ThenInclude(a => a.AnswerElements)

                .Include(q => q.Questions)
                .ThenInclude(q => q.Keyboard)
                .ThenInclude(k => k.VariableKeyImages)
                .ThenInclude(vk => vk.Image)

                .Include(q => q.Questions)
                .ThenInclude(q => q.Keyboard)
                .ThenInclude(k => k.NumericKeys)
                .FirstOrDefaultAsync(q => q.Questions.Any(qq => qq.Id == VM.QuestionId));

            if (Question is null)
                return NotFound("Question Not Found");

            //Check Answer Has Elements
            if (VM.Answer.Count == 0)
                return BadRequest("Answer Can't Be Empty");

            if (VM.Answer.All(a => a.ImageId is null && a.NumericKeyId is null))
                return BadRequest("Answer Should Include Numeric/Variable Values");

            //Check Answer Elements Exist in Keyboard
            var ImageIds = VM.Answer.Where((ae) => ae.ImageId.HasValue)
                .Select((ae) => ae.ImageId).ToList();

            var NumericIds = VM.Answer.Where((ae) => ae.NumericKeyId.HasValue)
                .Select((ae) => ae.NumericKeyId).ToList();


            var Q_Question = Question.Questions.FirstOrDefault(qq => qq.Id == VM.QuestionId);

            var Keyboard = Question.Questions.FirstOrDefault(qq => qq.Id == VM.QuestionId).Keyboard;


            if (ImageIds.Any(id => Keyboard.VariableKeyImages.All(i => i.ImageId != id)))
                return BadRequest("Some Variable Keys Used Do Not Exist In Keyboard");

            if (NumericIds.Any(id => Keyboard.NumericKeys.All(i => i.NumericKeyId != id)))
                return BadRequest("Some Numeric Keys Used Do Not Exist In Keyboard");

            var Answer = new EB_Answer()
            {
                Type = 0,
                DataPoolId = Q_Question.DataPoolId,
                QuestioneerId = Q_Question.Id
            };

            Q_Question.Answers.Add(Answer);
            await _applicationDbContext.SaveChangesAsync();

            foreach (var e in VM.Answer.OrderBy(a => a.Order))
            {
                var AddEelemnt = new EB_AnswerElement()
                {
                    ImageId = e.ImageId.HasValue ? new Nullable<int>(Keyboard.VariableKeyImages.FirstOrDefault(r => r.ImageId == e.ImageId).Id) : null,

                    Value = e.Value,

                    NumericKeyId = e.NumericKeyId.HasValue ?
                    new Nullable<int>(Keyboard.NumericKeys.FirstOrDefault(r => r.NumericKeyId == e.NumericKeyId).Id) : null

                };

                Answer.AnswerElements.Add(AddEelemnt);
                await _applicationDbContext.SaveChangesAsync();

            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

    }
}
