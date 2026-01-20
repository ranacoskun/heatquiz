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
using QuizAPI.Models.DefaultValues.QuestionImage;
using QuizAPI.Models.Questions;
using QuizAPI.Models.Questions.KeyboardQuestion;
using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.QuestionsController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class KeyboardQuestionController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;
        IHttpContextAccessor _httpContextAccessor;
        private readonly string PROF_WILKO_ID = "b19e0712-bd5c-4bb2-ac5b-7e1713765cdc";
        private readonly int CLICKABLE_QUESTION_PARAMETER = +1;
        private readonly int KEYBOARD_QUESTION_PARAMETER = +2;
        private readonly int MUTLIPLE_CHOICE_QUESTION_PARAMETER = +3;
        public KeyboardQuestionController(
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

        [HttpGet("[action]/{DatapoolId}")]
        public async Task<IActionResult> GetAllQuestions(int DatapoolId)
        {
            //Get Question
            var Question = await _applicationDbContext.KeyboardQuestion
                .Include(q => q.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(ae => ae.NumericKey)
                .ThenInclude(nk => nk.NumericKey)

                .Include(q => q.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(ae => ae.Image)

                .Where(a => a.DataPoolId == DatapoolId)
                .Select(q => new
                {
                    Type = q.Type,

                    Latex = q.Latex,

                    AdditionalInfo = q.AdditionalInfo,

                    IsEnergyBalance = q.IsEnergyBalance,
                    DisableDivision = q.DisableDevision,

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

                    Keyboard = new
                    {
                        Name = q.Keyboard.Name,
                    },

                    Answers = q.Answers.Select(a => new {
                        AnswerElements = a.AnswerElements.Select(ae => new
                        {
                            Id = ae.Id,
                            NumericKey = new {
                                Id = ae.NumericKeyId,

                                NumericKey = ae.NumericKey.NumericKey
                            },
                            Image = new {
                                Id = ae.ImageId,
                                Variation = new {
                                    Key = new
                                    {
                                        Code = ae.Image.Image.Key.Code
                                    },
                                    TextPresentation = ae.Image.Image.TextPresentation
                                },
                                ReplacementCharacter = ae.Image.ReplacementCharacter
                            },
                            Value = ae.Value
                        }).OrderBy(r => r.Id)
                    })

                })
                .ToListAsync();

            return Ok((Question));

        }

        public IActionResult Index()
        {
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetQuestions_APP([FromBody] SCQGetQuestionForAppViewModel RequestVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Questions = await _applicationDbContext.KeyboardQuestion
                /* .Where(q =>
                   q.GroupId == RequestVM.Group
                && (RequestVM.GetAll || q.SubgroupId == RequestVM.Subgroup)
                && (q.LevelOfDifficultyId == RequestVM.LevelOfDifficulty)
                )*/
                .ToListAsync();


            return Ok(_mapper.Map<List<KeyboardQuestion>, List<KeyboardQuestionViewModel>>(Questions));
        }

        [HttpGet("[action]/{QuestionId}")]
        public async Task<IActionResult> GetKeyboardQuestionWrongAnswers_PORTAL(int QuestionId)
        {
            var Question = await _applicationDbContext.KeyboardQuestion
                .Include(q => q.AnswerStatistics)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);


            if (Question is null)
                return NotFound("");

            var Data = Question.AnswerStatistics
                .GroupBy((a) => a.AnswerLatex)
                .Select(g => 
                new {
                    Latex = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending((e) => e.Count)
                .ToList();

            return Ok(Data);
        }

        [HttpGet("[action]/{QuestionId}")]
        public async Task<IActionResult> GetQuestion_APP(int QuestionId)
        {
            var Question = await _applicationDbContext.KeyboardQuestion
                .Include(q => q.Keyboard)
                .ThenInclude(k => k.NumericKeys)
                .Include(q => q.Keyboard)
                .ThenInclude(k => k.VariableKeys)
                .ThenInclude(vk => vk.VariableKey)
                .ThenInclude(vk => vk.VariablesChars)
                .Include(q => q.Information)
                .Include(q => q.QuestionMap31Extension)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);


            if (Question is null)
                return NotFound("");

            return Ok(_mapper.Map<KeyboardQuestion, KeyboardQuestionViewModel>(Question));
        }

        [HttpGet("[action]/{QuestionId}")]
        public async Task<IActionResult> GetQuestion_PORTAL(int QuestionId)
        {
            var Question = await _applicationDbContext.KeyboardQuestion
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(st => st.Topic)
                .Include(q => q.AddedBy)
                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)

                .Include(q => q.Keyboard)
                .ThenInclude(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)

                .Include(q => q.Keyboard)
                .ThenInclude(k => k.VariableKeys)
                .ThenInclude(vk => vk.VariableKey)
                .ThenInclude(vk => vk.VariablesChars)
                .Include(q => q.QuestionMap31Extension)

                .Include(q => q.Keyboard)
                .ThenInclude(k => k.VariableKeyImages)
                .ThenInclude(vk => vk.Image)

                .Include(q => q.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(e => e.NumericKey)
                .ThenInclude(k => k.NumericKey)

                .Include(q => q.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(e => e.Image)
                .ThenInclude(e => e.Image)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("");

            foreach(var a in Question.Answers)
            {
                a.AnswerElements = a.AnswerElements.OrderBy(e => e.Id).ToList();
            }

            return Ok(_mapper.Map<KeyboardQuestion, KeyboardQuestionViewModel>(Question));
        }

        [HttpGet("[action]/{QuestionId}")]
        public async Task<IActionResult> GetQuestionSeriesMapRelations_PORTAL(int QuestionId)
        {
            //Get Question
            var Question = await _applicationDbContext.KeyboardQuestion
                .Include(q => q.SeriesElements)
                .ThenInclude(e => e.Series)
                .ThenInclude(s => s.AddedBy)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound();

            var Series = Question.SeriesElements.Select(e => e.Series).Distinct().ToList();

            var Maps = await _applicationDbContext.CourseMap
                .Include(m => m.Elements)
                .Where(m => m.Elements.Any(e => Series.Any(s => s.Id == e.QuestionSeriesId)))
                .ToListAsync();

            return Ok(Series.Select(s => new
            {
                Id = s.Id,
                Code = s.Code,
                AddedBy = s.AddedBy.Name,
                Maps = Maps.Where(m => m.Elements.Any(e => e.QuestionSeriesId == s.Id))
                    .Select(m => _mapper.Map<CourseMap, CourseMapViewModel>(m))
            })
            );
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditQuestionImage(int QuestionId, IFormFile Picture)
        {
            //Check Question Exists
            var Question = await _applicationDbContext.KeyboardQuestion
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

            Question.ImageURL = URL;
            Question.Base_ImageURL = URL;
            Question.ImageSize = (int)Picture.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<KeyboardQuestion, KeyboardQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditQuestionPDF(int QuestionId, IFormFile PDF)
        {
            //Check Question Exists
            var Question = await _applicationDbContext.KeyboardQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound($"Question {QuestionId} Not Found");

            if (PDF is null)
                return BadRequest("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".pdf" };

            var fileExtensionIsValid = validExtenstions.Any(ve => PDF.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            // Generate a Path for The Picture
            var path = Path.Combine(
                 "wwwroot/KeyboardQuestions",
                 $"Question_{Question.Id.ToString()}",
                 "PDF");

            var URL = await SaveFile(path, PDF);

            Question.PDFURL = URL;
            Question.PDFSize = PDF.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<KeyboardQuestion, KeyboardQuestionViewModel>(Question));
        }

       
        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionLatex([FromBody] EditKeyboardQuestionLatexViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Question = await _applicationDbContext.KeyboardQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            RestClient client = new RestClient("https://math.now.sh/?");
            XmlDocument doc = new XmlDocument();

            var DB_filename = Path.Combine(
                           "NumericKeys",
                           $"{Path.GetRandomFileName()}.jpg");

            var filename = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    DB_filename);

            int Width;
            int Height;
            var save_result = SaveLatex(client, doc, QuestionVM.Latex, filename, out Width, out Height);

            if(save_result.Key != System.Net.HttpStatusCode.OK)
            {
                return BadRequest("Not Valid Latex Code");
            }

            Question.AnswerForLatex = DB_filename;
            Question.LatexWidth = Width;
            Question.LatexHeight = Height;
            Question.Latex = QuestionVM.Latex;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<KeyboardQuestion, KeyboardQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionAdditionalInfo([FromBody] EditKeyboardQuestionAdditionalInfoViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Question = await _applicationDbContext.KeyboardQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            Question.AdditionalInfo = QuestionVM.AdditionalInfo;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> FlipDisableDevision([FromBody] EditKeyboardQuestionAdditionalInfoViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Question = await _applicationDbContext.KeyboardQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            Question.DisableDevision = !Question.DisableDevision;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<KeyboardQuestion, KeyboardQuestionViewModel>(Question));
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionSingleStep([FromForm] AddKeyboardQuestionSingleStepViewModel QuestionVM)
        {
            //if (!ModelState.IsValid)
           //     return BadRequest("Model Not Valid");

            //Check Code not Null
            if (string.IsNullOrEmpty(QuestionVM.Code))
                return BadRequest("Code Can't Be Empty");

            if (string.IsNullOrEmpty(QuestionVM.AnswerForLatex))
                return BadRequest("Question text Can't Be Empty");

            //Check Image
            if (!QuestionVM.DefaultImageId.HasValue && QuestionVM.Picture is null)
                return BadRequest("Please provide a picture or choose a default image");

            //Verify Extension && Default Image exist
            QuestionImage DefaultImage = null;

            if (QuestionVM.Picture != null)
            {
                var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtensionIsValid = validExtenstions.Any(ve => QuestionVM.Picture.FileName.EndsWith(ve));

                if (!fileExtensionIsValid)
                {
                    return BadRequest("Picture Extenstion Not Valid");
                }
            }
            else
            {
                DefaultImage = await _applicationDbContext.QuestionImages
                              .FirstOrDefaultAsync(i => i.Id == QuestionVM.DefaultImageId);

                if (DefaultImage is null)
                    return BadRequest("Data not found");
            }


            var DATA_POOL = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(dp => dp.Id == QuestionVM.DataPoolId);

            if(DATA_POOL is null)
                return NotFound("DATA_POOL not found");

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

            //Subtopic
            var Subtopic = await _applicationDbContext.Subtopics
                .FirstOrDefaultAsync(s => s.Id == QuestionVM.SubtopicId);

            if (Subtopic is null)
                return BadRequest("Subtopic Not Found");

            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeyImages)
                .FirstOrDefaultAsync(k => k.Id == QuestionVM.KeyboardId && k.DataPoolId == DATA_POOL.Id);

            if (Keyboard is null)
                return BadRequest("Keyboard not Found");

            var ParsedModel = Newtonsoft.Json.JsonConvert.DeserializeObject<ParseKeyboardQuestionAnswersViewModel>(QuestionVM.AnswersString);

            if (ParsedModel is null)
                return BadRequest("Invalid Data Of Click Parts");

            if (ParsedModel.Answers.Count == 0)
                return BadRequest("Please Provide Answers");

            RestClient client = new RestClient("https://math.now.sh/?");
            XmlDocument doc = new XmlDocument();

            var DB_filename = Path.Combine(
                           "NumericKeys",
                           $"{Path.GetRandomFileName()}.jpg");

            var filename = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    DB_filename);

            int Width;
            int Height;
            var save_result = SaveLatex(client, doc, QuestionVM.AnswerForLatex, filename, out Width, out Height);

            if (save_result.Key != System.Net.HttpStatusCode.OK)
            {
                return BadRequest(save_result.Value);
            }

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);



            //Create Question
            var Question = new KeyboardQuestion()
            {
                Code = QuestionVM.Code,
                Type = KEYBOARD_QUESTION_PARAMETER,
                LevelOfDifficulty = LOD,
                SubtopicId = Subtopic.Id,
                Public = QuestionVM.Public,
                IsEnergyBalance = QuestionVM.IsEnergyBalance.HasValue ? QuestionVM.IsEnergyBalance.Value : false,
                DisableDevision = QuestionVM.DisableDevision,
                AdditionalInfo = QuestionVM.AdditionalInfo,

                QuestionAttribures = QuestionVM.Attributes.Select(a => new QuestionAttribure()
                {
                    Name = a
                }).ToList(),

                Latex = QuestionVM.AnswerForLatex,
                AnswerForLatex = DB_filename,
                LatexWidth = Width,
                LatexHeight = Height,              

               
                KeyboardId = Keyboard.Id,
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

            //Save Files
            var path = Path.Combine(
                                "wwwroot/SimpleClickableQuestions",
                                $"Question_{Question.Code.ToString()}");

            var URL = "";

            //Picture
            if (QuestionVM.Picture != null)
            {
                URL = await SaveFile(path, QuestionVM.Picture);

                Question.ImageURL = URL;
                Question.ImageSize = (int)QuestionVM.Picture.Length;
                Question.Base_ImageURL = URL;
            }
            else
            {
                var pathToImage = DefaultImage.ImageURL;
                pathToImage = Path.Combine("wwwroot", pathToImage);

                URL = await CopyFile(pathToImage, path);

                Question.ImageURL = URL;
                Question.Base_ImageURL = URL;
            }
            

            if (QuestionVM.PDF != null)
            {
                //Verify Extension
                var PDFvalidExtenstions = new List<string>() { ".pdf" };
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


            _applicationDbContext.KeyboardQuestion.Add(Question);
            await _applicationDbContext.SaveChangesAsync();

            foreach (var a in ParsedModel.Answers)
            {
                var answer = new KeyboardQuestionAnswer()
                {
                    DataPoolId = DATA_POOL.Id
                };

                Question.Answers.Add(answer);
                await _applicationDbContext.SaveChangesAsync();
                
                foreach(var e in a.Answer.OrderBy(e => e.Order))
                {
                    var element = new KeyboardQuestionAnswerElement()
                    {
                        ImageId = e.ImageId.HasValue ? new Nullable<int>(Keyboard.VariableKeyImages.FirstOrDefault(r => r.ImageId == e.ImageId).Id) : null,

                        Value = e.Value,

                        NumericKeyId = e.NumericKeyId.HasValue ?
                        new Nullable<int>(Keyboard.NumericKeys.FirstOrDefault(r => r.NumericKeyId == e.NumericKeyId).Id) : null,
                        DataPoolId = DATA_POOL.Id

                    };

                    answer.AnswerElements.Add(element);

                    await _applicationDbContext.SaveChangesAsync();
                }

            }

            return Ok(_mapper.Map<KeyboardQuestion, KeyboardQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionAnswer([FromBody] AddKeyboardQuestionAnswerViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Question = await _applicationDbContext.KeyboardQuestion
                .Include(q => q.Keyboard)
                .ThenInclude(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)

                .Include(q => q.Keyboard)
                .ThenInclude(k => k.VariableKeyImages)
                .ThenInclude(vk => vk.Image)

                .Include(q => q.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(e => e.NumericKey)
                .ThenInclude(k => k.NumericKey)

                .Include(q => q.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(e => e.Image)
                .ThenInclude(e => e.Image)
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            //Check Answer Has Elements
            if (QuestionVM.Answer.Count == 0)
                return BadRequest("Answer Can't Be Empty");

            if (QuestionVM.Answer.All(a => a.ImageId is null && a.NumericKeyId is null))
                return BadRequest("Answer Should Include Numeric/Variable Values");

            //Check Answer Elements Exist in Keyboard
            var ImageIds = QuestionVM.Answer.Where((ae) => ae.ImageId.HasValue)
                .Select((ae) => ae.ImageId).ToList();

            var NumericIds = QuestionVM.Answer.Where((ae) => ae.NumericKeyId.HasValue)
                .Select((ae) => ae.NumericKeyId).ToList();

            if (ImageIds.Any(id => Question.Keyboard.VariableKeyImages.All(i => i.ImageId != id)))
                return BadRequest("Some Variable Keys Used Do Not Exist In Keyboard");

            if (NumericIds.Any(id => Question.Keyboard.NumericKeys.All(i => i.NumericKeyId != id)))
                return BadRequest("Some Numeric Keys Used Do Not Exist In Keyboard");

            var Answer = new KeyboardQuestionAnswer()
            {
                
            };

            Question.Answers.Add(Answer);

            foreach (var e in QuestionVM.Answer.OrderBy(a => a.Order))
            {
                var AddEelemnt = new KeyboardQuestionAnswerElement()
                {
                    ImageId = e.ImageId.HasValue ? new Nullable<int>(Question.Keyboard.VariableKeyImages.FirstOrDefault(r => r.ImageId == e.ImageId).Id) : null,

                    Value = e.Value,

                    NumericKeyId = e.NumericKeyId.HasValue ?
                    new Nullable<int>(Question.Keyboard.NumericKeys.FirstOrDefault(r => r.NumericKeyId == e.NumericKeyId).Id) : null

                };

                Answer.AnswerElements.Add(AddEelemnt);
                await _applicationDbContext.SaveChangesAsync();

            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<KeyboardQuestion, KeyboardQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionAnswer([FromBody] AddKeyboardQuestionAnswerViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Question = await _applicationDbContext.KeyboardQuestion
                .Include(q => q.Keyboard)
                .ThenInclude(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)

                .Include(q => q.Keyboard)
                .ThenInclude(k => k.VariableKeyImages)
                .ThenInclude(vk => vk.Image)

                .Include(q => q.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(e => e.NumericKey)
                .ThenInclude(k => k.NumericKey)

                .Include(q => q.Answers)
                .ThenInclude(a => a.AnswerElements)
                .ThenInclude(e => e.Image)
                .ThenInclude(e => e.Image)
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            var Answer = Question.Answers.FirstOrDefault(a => a.Id == QuestionVM.AnswerId);

            if (Answer is null)
                return NotFound("Question Answer Not Found");

            //Check Answer Has Elements
            if (QuestionVM.Answer.Count == 0)
                return BadRequest("Answer Can't Be Empty");

            if (QuestionVM.Answer.All(a => a.ImageId is null && a.NumericKeyId is null))
                return BadRequest("Answer Should Include Numeric/Variable Values");

            //Check Answer Elements Exist in Keyboard
            var ImageIds = QuestionVM.Answer.Where((ae) => ae.ImageId.HasValue)
                .Select((ae) => ae.ImageId).ToList();

            var NumericIds = QuestionVM.Answer.Where((ae) => ae.NumericKeyId.HasValue)
                .Select((ae) => ae.NumericKeyId).ToList();

            if (ImageIds.Any(id => Question.Keyboard.VariableKeyImages.All(i => i.ImageId != id)))
                return BadRequest("Some Variable Keys Used Do Not Exist In Keyboard");

            if (NumericIds.Any(id => Question.Keyboard.NumericKeys.All(i => i.NumericKeyId != id)))
                return BadRequest("Some Numeric Keys Used Do Not Exist In Keyboard");

            Answer.AnswerElements.Clear();
            await _applicationDbContext.SaveChangesAsync();


            foreach (var e in QuestionVM.Answer.OrderBy(a => a.Order))
            {
                var AddEelemnt = new KeyboardQuestionAnswerElement()
                {
                    ImageId = e.ImageId.HasValue ? new Nullable<int>(Question.Keyboard.VariableKeyImages.FirstOrDefault(r => r.ImageId == e.ImageId).Id) : null,

                    Value = e.Value,

                    NumericKeyId = e.NumericKeyId.HasValue ?
                    new Nullable<int>(Question.Keyboard.NumericKeys.FirstOrDefault(r => r.NumericKeyId == e.NumericKeyId).Id) : null

                };

                Answer.AnswerElements.Add(AddEelemnt);
                await _applicationDbContext.SaveChangesAsync();

            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<KeyboardQuestion, KeyboardQuestionViewModel>(Question));
        }



        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestion([FromBody] QuestionBaseViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            //Check Question Exists
            var Question = await _applicationDbContext.KeyboardQuestion
                .Include(q => q.SeriesElements)
                .Include(q => q.QuestionAttribures)
                .Include(q => q.AnswerStatistics)
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            var SeriesElements = Question.SeriesElements;

            _applicationDbContext.QuestionSeriesElement.RemoveRange(SeriesElements);
            _applicationDbContext.KeyboardQuestion.Remove(Question);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestionAnswer([FromBody] RemoveKeyboardQuestionAnswerViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            //Check Question Exists
            var Question = await _applicationDbContext.KeyboardQuestion
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            var Answer = Question.Answers.FirstOrDefault(a => a.Id == QuestionVM.AnswerId);

            if (Answer is null)
                return NotFound("Question Answer Not Found");

            if (Question.Answers.Count == 1)
                return BadRequest("Cannot Delete Answer Because it is the Only Answer Left");

            _applicationDbContext.KeyboardQuestionAnswer.Remove(Answer);

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<KeyboardQuestion, KeyboardQuestionViewModel>(Question));

        }
    }
}
