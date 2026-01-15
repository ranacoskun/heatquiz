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
using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using QuizAPI.Models.Questions.MultipleChoiceQuestion;
using QuizAPI.Models.Questions.MultipleChoiceQuestion.ViewModels;
using QuizAPI.Models.Questions.SimpleClickableQuestion;
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
    public class MultipleChoiceQuestionController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;
        IHttpContextAccessor _httpContextAccessor;
        private readonly string PROF_WILKO_ID = "b19e0712-bd5c-4bb2-ac5b-7e1713765cdc";
        private readonly int CLICKABLE_QUESTION_PARAMETER = +1;
        private readonly int KEYBOARD_QUESTION_PARAMETER = +2;
        private readonly int MUTLIPLE_CHOICE_QUESTION_PARAMETER = +3;
        public MultipleChoiceQuestionController(
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

        [HttpGet("[action]/{DatapoolId}")]
        public async Task<IActionResult> GetAllQuestions(int DatapoolId)
        {
            //Get Question
            var Question = await _applicationDbContext.MultipleChoiceQuestion
                .Where(a => a.DataPoolId == DatapoolId)
                .Select(q => new
                {
                    Type = q.Type,

                    Code = q.Code,
                    ImageURL = q.ImageURL != null ? Mapping.MappingProfile.FILES_PATH + "/" + q.ImageURL : null,
                    PDFURL = q.PDFURL != null ? Mapping.MappingProfile.FILES_PATH + "/" + q.PDFURL : null,

                    Subtopic = new
                    {
                        Name = q.Subtopic.Name
                    },

                    LevelOfDifficulty = new
                    {
                        Name = q.LevelOfDifficulty.Name
                    },

                    Information = new
                    {
                        Code = q.Information.Code
                    },

                    Choices = q.Choices.Select(a => new { 
                        Latex = a.Latex,
                        ImageURL = a.ImageURL != null ? Mapping.MappingProfile.FILES_PATH + "/" + a.ImageURL : null,
                    }),

                    Latex = q.Latex,

                    AnswerForLatex = q.AnswerForLatex,
                })
              
                .ToListAsync();

            return Ok((Question));

        }

        [HttpGet("[action]/{QuestionId}")]
        public async Task<IActionResult> GetQuestion_APP(int QuestionId)
        {
            var Question = await _applicationDbContext.MultipleChoiceQuestion
                .Include(q => q.Choices)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("");

            return Ok(_mapper.Map<MultipleChoiceQuestion, MultipleChoiceQuestionViewModel>(Question));
        }

        [HttpGet("[action]/{QuestionId}")]
        public async Task<IActionResult> GetQuestion_PORTAL(int QuestionId)
        {
            var Question = await _applicationDbContext.MultipleChoiceQuestion
                .Include(q => q.LevelOfDifficulty)
                .Include(q => q.Subtopic)
                .ThenInclude(st => st.Topic)
                .Include(q => q.AddedBy)
                .Include(q => q.Owners)
                .ThenInclude(o => o.Owner)
                .Include(q => q.Choices)
                .Include(q => q.Information)

                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound("");

           

            return Ok(_mapper.Map<MultipleChoiceQuestion, MultipleChoiceQuestionViewModel>(Question));
        }

        [HttpGet("[action]/{QuestionId}")]
        public async Task<IActionResult> GetQuestionSeriesMapRelations_PORTAL(int QuestionId)
        {
            //Get Question
            var Question = await _applicationDbContext.MultipleChoiceQuestion
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
        public async Task<IActionResult> AddQuestionSingleStep([FromForm] AddMultipleChoiceQuestionSingleStepViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Code not Null
            if (string.IsNullOrEmpty(QuestionVM.Code))
                return BadRequest("Code Can't Be Empty");

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

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(dp => dp.Id == QuestionVM.DataPoolId);

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

            if(QuestionVM.ChoicesPerRow <= 0)
                return BadRequest("ChoicesPerRow Must be Positive");

            //Get Answers
            var ParsedModel = Newtonsoft.Json.JsonConvert.DeserializeObject<List<MultipleChoiceQuestionChoiceViewModel>>(QuestionVM.AnswersString);

            if (ParsedModel is null)
                return BadRequest("Invalid Answers");

            if (ParsedModel.Count == 0)
                return BadRequest("Please Provide Answers");

            if (ParsedModel.All(a => !a.Correct))
                return BadRequest("Please Add Atleast a Correct Answer");

            //Save Answer For Latex
            /*RestClient client = new RestClient("https://math.now.sh/?");
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
            }*/
           

            //Check MC Images 
            if (QuestionVM.MultipleChoiceImages.Count > ParsedModel.Count)
                return BadRequest("More images provided than multiple choices");

            if (QuestionVM.MultipleChoiceImages.Count < ParsedModel.Count(a => string.IsNullOrEmpty(a.Latex)))
                return BadRequest("Please provide an image for answers with no LaTex text");

            if (QuestionVM.MultipleChoiceImages.Count != ParsedModel.Count(a => !string.IsNullOrEmpty(a.ImageURL)))
                return BadRequest("Number of images does not match choices selected to have an image");

            //Get Owner
            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Create Question
            var Question = new MultipleChoiceQuestion() {
                Type = MUTLIPLE_CHOICE_QUESTION_PARAMETER,
                Code = QuestionVM.Code,
                AddedById = Owner.Id,
                LevelOfDifficulty = LOD,
                SubtopicId = Subtopic.Id,
                Public = QuestionVM.Public,
                IsEnergyBalance = QuestionVM.IsEnergyBalance,
                AdditionalInfo = QuestionVM.AdditionalInfo,
                ChoicesPerRow = QuestionVM.ChoicesPerRow,

                QuestionAttribures = QuestionVM.Attributes.Select(a => new QuestionAttribure()
                {
                    Name = a,
                    DataPoolId = DATA_POOL.Id
                }).ToList(),

                Latex = QuestionVM.AnswerForLatex,
                DataPoolId = DATA_POOL.Id
            };

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


            //Add Answers
            var Image_Files = new List<Key_Info>();

            var Index = 0;
            foreach (var a in ParsedModel.Where(a => !string.IsNullOrEmpty(a.Latex)))
            {

                /*DB_filename = Path.Combine(
                          "MultipleChoices",
                          $"{Path.GetRandomFileName()}.jpg");

                filename = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        DB_filename);

                Width = 0;
                Height = 0;

                save_result = SaveLatex_MultipleChoice(doc,a.Latex , filename, out Width, out Height);

                if (save_result.Key != System.Net.HttpStatusCode.OK)
                {
                    return BadRequest(save_result.Value);
                }*/

                Question.Choices.Add(new MultipleChoiceQuestionChoice()
                {
                    Latex = a.Latex,
                    Correct = a.Correct,
                    Text = a.Text,
                    DataPoolId = DATA_POOL.Id
                });

                if (!string.IsNullOrEmpty(a.ImageURL))
                {
                     path = Path.Combine(
                       "wwwroot/SimpleClickableQuestions",
                       $"Question_{Question.Code.ToString()}");

                    var Picture = QuestionVM.MultipleChoiceImages[Index];

                    URL = await SaveFile(path, Picture);
                    Question.Choices.Last().ImageURL = URL;

                    using (var ms = new MemoryStream())
                    {
                        Picture.CopyTo(ms);
                        var fileBytes = ms.ToArray();
                        Picture.CopyTo(ms);

                        System.Drawing.Image img = System.Drawing.Image.FromStream(ms);

                        Question.Choices.Last().Image_Width = img.Width;
                        Question.Choices.Last().Image_Height = img.Height;
                    }
                    

                    Index = Index + 1;

                }

            }

            /*foreach (var a in ParsedModel.Where(a => string.IsNullOrEmpty(a.Latex)))
            {              
                Question.Choices.Add(new MultipleChoiceQuestionChoice()
                {
                    Correct = a.Correct,
                    Text = a.Text,
                    Width = 0,
                    Height = 0
                });
            }*/



            //PDF
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

        
            Question.Owners.Add(new Models.Ownership.QuestionOwner()
            {
                OwnerId = Owner.Id,
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

            _applicationDbContext.MultipleChoiceQuestion.Add(Question);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<MultipleChoiceQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditQuestionImage(int QuestionId, IFormFile Picture)
        {
            //Check Question Exists
            var Question = await _applicationDbContext.MultipleChoiceQuestion
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

            return Ok(_mapper.Map<MultipleChoiceQuestion, MultipleChoiceQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditQuestionPDF(int QuestionId, IFormFile PDF)
        {
            //Check Question Exists
            var Question = await _applicationDbContext.MultipleChoiceQuestion
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

            return Ok(_mapper.Map<MultipleChoiceQuestion, MultipleChoiceQuestionViewModel>(Question));
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionLatex([FromBody] EditKeyboardQuestionLatexViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Question = await _applicationDbContext.MultipleChoiceQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            /*RestClient client = new RestClient("https://math.now.sh/?");
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

            if (save_result.Key != System.Net.HttpStatusCode.OK)
            {
                return BadRequest("Not Valid Latex Code");
            }

            Question.AnswerForLatex = DB_filename;
            Question.LatexWidth = Width;
            Question.LatexHeight = Height;*/

            Question.Latex = QuestionVM.Latex;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<MultipleChoiceQuestion, MultipleChoiceQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionAdditionalInfo([FromBody] EditKeyboardQuestionAdditionalInfoViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Question = await _applicationDbContext.MultipleChoiceQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            Question.AdditionalInfo = QuestionVM.AdditionalInfo;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<MultipleChoiceQuestion, MultipleChoiceQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionColumnsPerRow([FromBody] EditQuestionColumnsPerRowViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Question = await _applicationDbContext.MultipleChoiceQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            if (QuestionVM.ChoicesPerRow <= 0)
                return BadRequest("ChoicesPerRow Must be Positive");
            
            Question.ChoicesPerRow = QuestionVM.ChoicesPerRow;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionAnswer(int QuestionId, IFormFile Picture, string Latex, bool Correct, int Width, int Height)
        {
            //Check Question Exists
            var Question = await _applicationDbContext.MultipleChoiceQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound($"Question {QuestionId} Not Found");

            if ((Picture is null) && string.IsNullOrEmpty(Latex))
                return BadRequest("Please Provide Picture or Latex Code");

            if(Picture != null && string.IsNullOrEmpty(Latex))
            {
                //Verify Extension
                var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

                if (!fileExtensionIsValid)
                {
                    return BadRequest("Picture Extenstion Not Valid");
                }
                
                //Generate a Path for The Picture
                
                var path = Path.Combine(
                "wwwroot/MultipleChoices");

                var URL = await SaveFile(path, Picture);

                Question.Choices.Add(new MultipleChoiceQuestionChoice()
                {
                    Latex = Latex,
                    ImageURL = URL,
                    Correct = Correct,
                    Image_Width = Width,
                    Image_Height = Height,

                });

            }

            if (!string.IsNullOrEmpty(Latex) && Picture is null)
            {
                /*var DB_filename = Path.Combine(
                          "MultipleChoices",
                          $"{Path.GetRandomFileName()}.jpg");

                var filename = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        DB_filename);

                var _Width = 0;
                var _Height = 0;

                var save_result = SaveLatex_MultipleChoice(null, Latex, filename, out _Width, out _Height);

                if (save_result.Key != System.Net.HttpStatusCode.OK)
                {
                    return BadRequest(save_result.Value);
                }
                */
                Question.Choices.Add(new MultipleChoiceQuestionChoice()
                {
                    Latex = Latex,
                    //LatexURL = DB_filename,
                    Correct = Correct,
                    //Width = Width,
                    //Height = Height
                });
            }

            if (!string.IsNullOrEmpty(Latex) && Picture != null)
            {
                
                //Verify Extension
                var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

                if (!fileExtensionIsValid)
                {
                    return BadRequest("Picture Extenstion Not Valid");
                }

                //Generate a Path for The Picture

                var path = Path.Combine(
                "wwwroot/MultipleChoices");

                var URL = await SaveFile(path, Picture);

               
                var DB_filename = Path.Combine(
                          "MultipleChoices",
                          $"{Path.GetRandomFileName()}.jpg");

                var filename = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        DB_filename);

                /*var _Width = 0;
                var _Height = 0;

                var save_result = SaveLatex_MultipleChoice(null, Latex, filename, out _Width, out _Height);

                if (save_result.Key != System.Net.HttpStatusCode.OK)
                {
                    return BadRequest(save_result.Value);
                }*/

                Question.Choices.Add(new MultipleChoiceQuestionChoice()
                {
                    Correct = Correct,

                    Latex = Latex,
                    //LatexURL = DB_filename,
                    //Width = _Width,
                    //Height = _Height,

                    ImageURL = URL,
                    Image_Width = Width,
                    Image_Height = Height,
                });
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<MultipleChoiceQuestion, MultipleChoiceQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionAnswer(int QuestionId,int AnswerId, IFormFile Picture, string Latex, bool Correct, int Width, int Height)
        {
            //Check Question Exists
            var Question = await _applicationDbContext.MultipleChoiceQuestion
                .Include(c => c.Choices)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound($"Question {QuestionId} Not Found");

            var Choice = Question.Choices.FirstOrDefault(c => c.Id == AnswerId);

            if (Choice is null)
                return NotFound($"Choice {AnswerId} Not Found");

            if(Question.Choices.Where(c => c.Id != AnswerId && c.Correct).Count() ==0 && !Correct)
                return NotFound($"Atleast one Choice must be Correct");

            /*if ((Picture is null) && string.IsNullOrEmpty(Latex))
                return BadRequest("Please Provide Picture or Latex Code");*/

            if (Picture != null && string.IsNullOrEmpty(Latex))
            {
                

                //Verify Extension
                var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

                if (!fileExtensionIsValid)
                {
                    return BadRequest("Picture Extenstion Not Valid");
                }

                //Generate a Path for The Picture

                var path = Path.Combine(
                "wwwroot/MultipleChoices");

                var URL = await SaveFile(path, Picture);

                Choice.ImageURL = URL;
                Choice.Image_Width = Width;
                Choice.Image_Height = Height;


            }

            if (!string.IsNullOrEmpty(Latex) && Picture is null)
            {
                /*var DB_filename = Path.Combine(
                          "MultipleChoices",
                          $"{Path.GetRandomFileName()}.jpg");

                var filename = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        DB_filename);

                var _Width = 0;
                var _Height = 0;

                var save_result = SaveLatex_MultipleChoice(null, Latex, filename, out _Width, out _Height);

                if (save_result.Key != System.Net.HttpStatusCode.OK)
                {
                    return BadRequest(save_result.Value);
                }
                
                Choice.LatexURL = DB_filename;
                Choice.Width = _Width;
                Choice.Height = _Height;
                 */

                Choice.Latex = Latex;
               
               
            }

            if (!string.IsNullOrEmpty(Latex) && Picture != null)
            {
                //Verify Extension
                var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

                if (!fileExtensionIsValid)
                {
                    return BadRequest("Picture Extenstion Not Valid");
                }

                //Generate a Path for The Picture

                var path = Path.Combine(
                "wwwroot/MultipleChoices");

                var URL = await SaveFile(path, Picture);


                var DB_filename = Path.Combine(
                          "MultipleChoices",
                          $"{Path.GetRandomFileName()}.jpg");

                var filename = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        DB_filename);

                /*var _Width = 0;
                var _Height = 0;

                var save_result = SaveLatex_MultipleChoice(null, Latex, filename, out _Width, out _Height);

                if (save_result.Key != System.Net.HttpStatusCode.OK)
                {
                    return BadRequest(save_result.Value);
                }

                Choice.Latex = Latex;
                Choice.LatexURL = DB_filename;
                Choice.Width = _Width;
                Choice.Height = _Height;*/

                Choice.ImageURL = URL;
                Choice.Image_Width = Width;
                Choice.Image_Height = Height;
            }

            Choice.Correct = Correct;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<MultipleChoiceQuestion, MultipleChoiceQuestionViewModel>(Question));
        }

     
        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestionAnswerImage(int QuestionId, int AnswerId)
        {
            //Check Question Exists
            var Question = await _applicationDbContext.MultipleChoiceQuestion
                .Include(c => c.Choices)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound($"Question {QuestionId} Not Found");

            var Choice = Question.Choices.FirstOrDefault(c => c.Id == AnswerId);

            if (Choice is null)
                return NotFound($"Choice {AnswerId} Not Found");

            if (Choice.Latex is null)
                return NotFound($"Please Add Latex Code Before Deleting Image");


            Choice.ImageURL = null;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<MultipleChoiceQuestion, MultipleChoiceQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestionAnswerLatex(int QuestionId, int AnswerId)
        {
            //Check Question Exists
            var Question = await _applicationDbContext.MultipleChoiceQuestion
                .Include(c => c.Choices)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (Question is null)
                return NotFound($"Question {QuestionId} Not Found");

            var Choice = Question.Choices.FirstOrDefault(c => c.Id == AnswerId);

            if (Choice is null)
                return NotFound($"Choice {AnswerId} Not Found");

            if (Choice.ImageURL is null)
                return NotFound($"Please Add Image Before Clearing Latex");


            Choice.Latex = null;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<MultipleChoiceQuestion, MultipleChoiceQuestionViewModel>(Question));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestion([FromBody] QuestionBaseViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            //Check Question Exists
            var Question = await _applicationDbContext.MultipleChoiceQuestion
                .Include(q => q.SeriesElements)
                .Include(q => q.QuestionAttribures)
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            var SeriesElements = Question.SeriesElements;

            _applicationDbContext.QuestionSeriesElement.RemoveRange(SeriesElements);
            _applicationDbContext.MultipleChoiceQuestion.Remove(Question);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestionAnswer([FromBody] RemoveKeyboardQuestionAnswerViewModel QuestionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Info");

            //Check Question Exists
            var Question = await _applicationDbContext.MultipleChoiceQuestion
                .Include(q => q.Choices)
                .FirstOrDefaultAsync(q => q.Id == QuestionVM.Id);

            if (Question is null)
                return NotFound("Question Not Found");

            var Answer = Question.Choices.FirstOrDefault(a => a.Id == QuestionVM.AnswerId);

            if (Answer is null)
                return NotFound("Question Answer Not Found");

            if (Question.Choices.Count == 1)
                return BadRequest("Cannot delete this answer because it is the only answer left");

            if (Question.Choices.Where(c => c.Correct && c.Id == Answer.Id).Count() == 1)
                return BadRequest("Cannot delete this answer because it is the only < correct > answer left");

            Question.Choices.Remove(Answer);

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<MultipleChoiceQuestion, MultipleChoiceQuestionViewModel>(Question));

        }

    }
}

public class MC_Info
{
    public string File { get; set; }

    public int Width { get; set; }

    public int Height { get; set; }

    public string TextPresentation { get; set; }
}