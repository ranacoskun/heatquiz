using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.Questionnaire;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.SurveyController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class SurveyController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;

        public SurveyController(
           IMapper mapper,
           ApplicationDbContext applicationDbContext,
           IHttpContextAccessor httpContextAccessor
       )
        {
            _mapper = mapper;
            _applicationDbContext = applicationDbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return Ok();
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetSurvey(int Id)
        {
            var Questionnaire = await _applicationDbContext.Questionnaires
                .Include(q => q.Questions)
                .ThenInclude(a => a.Choices)
                .FirstOrDefaultAsync(q => q.Id == Id);

            if (Questionnaire is null)
                return NotFound("Not found");

            return Ok(_mapper.Map<QuestionnaireViewModel> (Questionnaire));
        }


        [HttpGet("[action]/{Id}")] 
        public async Task<IActionResult> GetSurveyViewEdit(int Id)
        {
            var Questionnaire = await _applicationDbContext.Questionnaires
                .Include(a => a.AddedBy)
                .Include(q => q.Questions)
                .ThenInclude(a => a.Choices)
                
                .FirstOrDefaultAsync(q => q.Id == Id);

            if (Questionnaire is null)
                return NotFound("Not found");

            return Ok(_mapper.Map<QuestionnaireViewModel>(Questionnaire));
        }

        [HttpGet("[action]/{Id}")] 
        public async Task<IActionResult> GetAssignedSeries(int Id)
        {
            var Questionnaire = await _applicationDbContext.Questionnaires
                .Include(s => s.Relations)
                .ThenInclude(r => r.Series)
                .ThenInclude(a => a.Elements)
                .FirstOrDefaultAsync(q => q.Id == Id);

            if (Questionnaire is null)
                return NotFound("Not found");

            return Ok(_mapper.Map<QuestionnaireViewModel>(Questionnaire));
        }


        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetSurveyStatistics(int Id)
        {
            var survey = await _applicationDbContext.Questionnaires
                .Include(q => q.Questions)
                .ThenInclude(a => a.Choices)
                
                .Include(s => s.ParticipationStatistics)
                .ThenInclude(ps => ps.Instances)
                .ThenInclude(i => i.Statistics)
                .FirstOrDefaultAsync(q => q.Id == Id);

            if (survey is null)
                return NotFound("Not found");

            return Ok(new
            {
                Id = survey.Id,

                TotalPlay = survey.ParticipationStatistics.Count(),

                MedianTime = survey.ParticipationStatistics.Skip((int)(survey.ParticipationStatistics.Count / 2)).FirstOrDefault()?.TotalTime,

                QuestionsStats = survey.ParticipationStatistics
                .Select(a => a.Instances)
                .SelectMany(r => r).GroupBy(f => f.Question)
                .Select(g => new
                {
                    Id = g.Key.Id,

                    TotalPlay = g.Count(),

                    ChoiceClickCombinationStats = g.Key.StatisticInstances.Select(o => new {
                       key = 
                       string.Join(",", o.Statistics
                       .Where(s => s.Choice.Type ==  QuestionnaireQuestionChoiceType.NORMAL)
                       .Select(r => r.ChoiceId).OrderBy(y => y)),

                       Ids = o.Statistics
                       .Where(s => s.Choice.Type == QuestionnaireQuestionChoiceType.NORMAL)
                       .Select(p => p.ChoiceId),
                    }).GroupBy(a => a.key)
                    .Select(gg => new
                    {
                        Choices = gg.Select(p => p.Ids).FirstOrDefault(),
                        Count = gg.Count(),
                    }),

                    ChoicesStats = g.Key.Choices
                    .Where(c => c.Type == QuestionnaireQuestionChoiceType.NORMAL)
                    .Select(c => new
                    {
                        Id = c.Id,
                        TotalChoiceSelection = g.Count(a => a.Statistics.Any(x => x.ChoiceId == c.Id)),

                        Relations = g.Where(a => a.Statistics.Where(ca => ca.Choice.Type == QuestionnaireQuestionChoiceType.NORMAL).Any(x => x.ChoiceId == c.Id))
                        .Select(r => r.Statistics.Where(ca => ca.Choice.Type == QuestionnaireQuestionChoiceType.NORMAL).Where(m => m.ChoiceId != c.Id)
                        .Select(y => y.ChoiceId))
                        .SelectMany(r => r)
                        .GroupBy(f => f)
                        .Select( u => new {
                            Id = u.Key,
                            Count = u.Count()
                        }),
                    }),

                    TextInputChoiceStats = g.Key.Choices
                    .Where(c => c.Type == QuestionnaireQuestionChoiceType.TXT)
                    .Select(c => new
                    {
                        Id = c.Id,
                        TopFiveInputs = c.Statistics.GroupBy(s => s.Value).Select(r => new {
                            Text = r.Key,
                            Count = r.Count()
                        }).OrderByDescending(s => s.Count).Take(5),
                        TotalInput = c.Statistics.Count
                    }),

                    RangeInputChoiceStats = g.Key.Choices
                    .Where(c => c.Type == QuestionnaireQuestionChoiceType.RANGE)
                    .Select(c => new
                    {
                        Id = c.Id,
                        RangeInputs = c.Statistics.GroupBy(s => s.Value).Select(r => new {
                            Text = r.Key,
                            Count = r.Count()
                        }).OrderBy(s => s.Count),
                        TotalInput = c.Statistics.Count
                    }),
                })
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetSurveyHistory([FromBody] QuestionnaireHistoryViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data format");

            Expression<Func<QuestionnaireStatisticInstanceBase, bool>> criteria;

            if (string.IsNullOrEmpty(VM.From) || string.IsNullOrEmpty(VM.To))
            {
                criteria = (a) => a.QuestionnaireId == VM.SurveyId && (!string.IsNullOrEmpty(VM.Key) ? (a.Key == VM.Key || a.Player == VM.Key) : true);
            }
            else
            {
                try
                {
                    var From = DateTime.ParseExact(VM.From, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                    var To = DateTime.ParseExact(VM.To, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);

                    criteria = (a) =>
                    a.QuestionnaireId == VM.SurveyId
                    && (!string.IsNullOrEmpty(VM.Key) ? (a.Key == VM.Key || a.Player == VM.Key) : true)
                    && (a.DateCreated >= From && a.DateCreated <= To);
                }
                catch
                {
                    criteria = (a) => a.QuestionnaireId == VM.SurveyId && (!string.IsNullOrEmpty(VM.Key) ? (a.Key == VM.Key || a.Player == VM.Key) : true);
                }

            }


            var log = await _applicationDbContext.QuestionnaireStatisticInstanceBase
                .Include(i => i.Series)
                .Include(i => i.MapElement)
                .ThenInclude(e => e.Map)
                .Include(i => i.Questionnaire)
                .ThenInclude(qq => qq.Questions)
                .ThenInclude(q => q.Choices)
                .Include(b => b.Instances)
                .ThenInclude(i => i.Statistics)
                .Where(criteria)
                .OrderByDescending(r => r.DateCreated)
                .ToListAsync();

            return Ok(_mapper.Map<List<QuestionnaireStatisticInstanceBaseViewModel>>(log));
        }

        [HttpGet("[action]/{Datapool}")]
        public async Task<IActionResult> GetSurveys(int Datapool)
        {
            var Questionnaires = await _applicationDbContext.Questionnaires
                .Include(a => a.AddedBy)
                .Include(q => q.Questions)
                .ThenInclude(a => a.Choices)
                .Where(q => q.DataPoolId == Datapool)
                .OrderBy(q => q.Code)
                .ToListAsync();

            return Ok(_mapper.Map<List<QuestionnaireViewModel>>(Questionnaires));
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetTextInputChoiceInputs(int Id)
        {
            var choice = await _applicationDbContext.QuestionnaireQuestionChoice
                .Include(c => c.Statistics)
                .FirstOrDefaultAsync(c => c.Id == Id && c.Type == QuestionnaireQuestionChoiceType.TXT);

            if (choice is null)
                return NotFound("Not found");

            var countDecending = choice.Statistics
                .GroupBy(s => s.Value)
                .Select(g => new { 
                    Text = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(a => a.Count)
                .ToList();

            var textLengthDecending = choice.Statistics
                .GroupBy(s => s.Value)
                .Select(g => new {
                    Text = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(a => a.Text.Length)
                .ToList();

            var total = choice.Statistics.Count;

            return Ok(new {
                Total = total,
                CountDescending = countDecending,
                TextLengthDecending = textLengthDecending
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddSurveySingleStep(
        string Code,
        string Explanation,
        string FinalText,
        string ImageURL,
        string QuestionsString,
        List<string> FileListCodes,
        List<IFormFile> Files,
        int DatapoolId
        )
        {
            //Check datapool
            var DP = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(d => d.Id == DatapoolId);

            if (DP is null)
                return NotFound("Datapool not found");

            //Check code unique in datapool
            var codeUsed = await _applicationDbContext.Questionnaires
                .AnyAsync(q => q.DataPoolId == DP.Id && q.Code == Code);

            if (codeUsed)
                return BadRequest("Code used, choose another code");

            //Get questions
            var questions = Newtonsoft.Json.JsonConvert.DeserializeObject <List<QuestionnaireQuestionViewModel>>(QuestionsString);

            //check complete
            if (questions is null)
                return BadRequest("Error reading data");

            if (!questions.Any())
                return BadRequest("Please add questions");

            if (questions.Any(q => string.IsNullOrEmpty(q.Title)))
                return BadRequest("Questions should have a title");

            if (questions.Any(q => string.IsNullOrEmpty(q.Body)))
                return BadRequest("Questions should have a body");

            if (questions.Select(q => q.Title).Distinct().Count() != questions.Count)
                return BadRequest("Questions should have unique titles");

            if (questions.Any(q => q.Choices.Sum(c => (int)(c.Type.Value)) < 4))
                return BadRequest("A question should have atleast (two normal / one text input / one range input) choice(s)");

            if (questions.Any(q => q.Choices.Any(c => string.IsNullOrEmpty(c.LaTex) && string.IsNullOrEmpty(c.ImageURL))))
                return BadRequest("Choices should have either a text or an image");

            if (questions.Any(q => q.Choices.Select(c => c.LaTex).Distinct().Count() != q.Choices.Count))
                return BadRequest("Choices should have unique LaTeX");

            //check files ok
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var filesExtensionsValid = Files.Any(f => !validExtenstions.Any(ve => f.FileName.EndsWith(ve)));

            if (filesExtensionsValid)
            {
                return BadRequest("Files' extensions not valid");
            }

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //add questionnaire
            var questionnaire = new Questionnaire()
            {
                DataPoolId = DP.Id,
                Code = Code,
                Explanation = Explanation,
                FinalText = FinalText,

                AddedById = Owner.Id
            };

            if (!string.IsNullOrEmpty(ImageURL))
            {
                var path = Path.Combine("wwwroot/SimpleClickableQuestions", $"Question_{questionnaire.Code.ToString()}");
                //try to get file
                var fileIndex = FileListCodes.IndexOf(ImageURL);

                if (fileIndex != -1)
                {
                    //save image and assign url
                    var file = Files[fileIndex];

                    var URL = "";
                    URL = await SaveFile(path, file);

                    questionnaire.ImageURL = URL;
                    questionnaire.ImageSize = (int)file.Length;
                }
            }

            foreach (var q in questions.OrderBy(q => q.Order))
            {
                var newQ = new QuestionnaireQuestion()
                {
                    Body = q.Body,
                    Title = q.Title,
                    Order = q.Order,

                    IsSingleChoice = q.IsSingleChoice,                    

                    DataPoolId = DP.Id
                };

                var path = Path.Combine("wwwroot/SimpleClickableQuestions", $"Question_{questionnaire.Code.ToString()}");

                //add image
                if (!string.IsNullOrEmpty(q.ImageURL))
                {
                    //save image and assign url

                    //try to get file
                    var fileIndex = FileListCodes.IndexOf(q.ImageURL);

                    if(fileIndex == -1)
                    {
                        //try default image
                        var imageId = 0;
                        int.TryParse(q.ImageURL, out imageId);

                        var defaultImage = await _applicationDbContext.QuestionImages
                            .FirstOrDefaultAsync(iq => iq.Id == imageId);

                        if(defaultImage != null)
                        {
                            //copy and save image and assign url
                            var pathToImage = defaultImage.ImageURL;
                            pathToImage = Path.Combine("wwwroot", pathToImage);

                            var URL = await CopyFile(pathToImage, path);

                            newQ.ImageURL = URL;
                        }
                    }
                    else
                    {
                        var file = Files[fileIndex];
                        
                        var URL = "";
                        URL = await SaveFile(path, file);

                        newQ.ImageURL = URL;
                        newQ.ImageSize = (int)file.Length;
                    }

                }

                foreach(var c in q.Choices)
                {
                    var newChoice = new QuestionnaireQuestionChoice()
                    {
                        DataPoolId = DP.Id,

                        LaTex = c.LaTex,

                        Order = c.Order,

                        Type = c.Type,

                        MaxCharacterCount = c.MaxCharacterCount,

                        Start = c.Start,
                        End = c.End,
                        Step = c.Step
                    };

                    //add image
                    if (!string.IsNullOrEmpty(c.ImageURL))
                    {
                        //try to get file
                        var fileIndex = FileListCodes.IndexOf(c.ImageURL);

                        if (fileIndex != -1)
                        {
                            //save image and assign url
                            var file = Files[fileIndex];

                            var URL = "";
                            URL = await SaveFile(path, file);

                            newChoice.ImageURL = URL;
                            newChoice.ImageSize = (int)file.Length;
                        }
                    }

                    newQ.Choices.Add(newChoice);
                }

                questionnaire.Questions.Add(newQ);
            }

            _applicationDbContext.Questionnaires.Add(questionnaire);
            await _applicationDbContext.SaveChangesAsync();


            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ReorderSurvey([FromBody] ReorderQuestionnaireQuestionViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            //Get Survey
            var survey = await _applicationDbContext.Questionnaires
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == VM.SurveyId);

            if (survey is null)
                return NotFound("Survey not found");

            var questions = survey.Questions.Where(q => VM.ReorderedQuestions.Any(qq => qq.Id == q.Id)).ToList();

            if (questions.Count != survey.Questions.Count)
                return BadRequest("Not all questions are included");

            foreach (var roq in VM.ReorderedQuestions)
            {
                var q = questions.FirstOrDefault(qq => qq.Id == roq.Id);

                q.Order = roq.Order;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ReorderSurveyQuestion([FromBody] ReorderQuestionnaireQuestionChoiceViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            //Get question
            var question = await _applicationDbContext.QuestionnaireQuestion
                .Include(q => q.Choices)
                .FirstOrDefaultAsync(q => q.Id == VM.QuestionId);

            if (question is null)
                return NotFound("Question not found");

            var choices = question.Choices.Where(q => VM.ReorderedChoices.Any(qq => qq.Id == q.Id)).ToList();

            if (choices.Count != question.Choices.Count)
                return BadRequest("Not all CHOICES are included");

            foreach (var roc in VM.ReorderedChoices)
            {
                var c = choices.FirstOrDefault(cc => cc.Id == roc.Id);

                c.Order = roc.Order;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddStatistic(
        string Key,
        string PlayerKey,
        int SurveyId,
        int? SeriesId,
        int? MapElementId,
        int TotalTime,
        List<int> SelectedChoiceIds,
        string TextInputChoices,
        string RangeInputChoices
        )
        {
            //Get Survey
            var survey = await _applicationDbContext.Questionnaires
                .Include(q => q.Questions)
                .ThenInclude(a => a.Choices)
                .ThenInclude(c => c.Statistics)
                .FirstOrDefaultAsync(q => q.Id == SurveyId);

            if (survey is null)
                return NotFound("Survey not found");

            //Normal choices
            var choices = survey.Questions
                .Select(q => q.Choices.Where(c =>
                c.Type == QuestionnaireQuestionChoiceType.NORMAL && SelectedChoiceIds.Any(id => c.Id == id)))
                .SelectMany(r => r).ToList();

            if(choices.Count != SelectedChoiceIds.Distinct().Count())
                return BadRequest("Incoherent data - normal choices");

            //Text choices
            var textInputChoices = Newtonsoft.Json.JsonConvert.DeserializeObject<List<QuestionChoiceInputViewModel>>(TextInputChoices);

            var textChoices = survey.Questions
                .Where(q => textInputChoices != null)
                .Select(q => q.Choices.Where(c =>
                c.Type == QuestionnaireQuestionChoiceType.TXT && textInputChoices.Any(a => c.Id == a.Id)))
                .SelectMany(r => r).ToList();

            if (textChoices.Count != textInputChoices.Distinct().Count())
                return BadRequest("Incoherent data - text input");

            //Range choices
            var rangeInputChoices = Newtonsoft.Json.JsonConvert.DeserializeObject<List<QuestionChoiceInputViewModel>>(RangeInputChoices);

            var rangeChoices = survey.Questions
                .Select(q => q.Choices.Where(c => 
                c.Type == QuestionnaireQuestionChoiceType.RANGE && rangeInputChoices.Any(a => c.Id == a.Id)))
                .SelectMany(r => r).ToList();

            if (rangeChoices.Count != rangeInputChoices.Distinct().Count())
                return BadRequest("Incoherent data - range input");

            //Series
            var statBase = new QuestionnaireStatisticInstanceBase()
            {
                DataPoolId = survey.DataPoolId,

                QuestionnaireId = survey.Id,

                Key = Key,
                Player = PlayerKey,

                TotalTime = TotalTime,
            };

            if (SeriesId.HasValue)
            {
                var series = await _applicationDbContext.QuestionSeries
                .FirstOrDefaultAsync(s => s.Id == SeriesId && s.DataPoolId == survey.DataPoolId);

                if (series is null)
                    return NotFound("Series not found");

                statBase.SeriesId = series.Id;
            }
            else if (MapElementId.HasValue)
                {
                    var element = await _applicationDbContext.CourseMapElement
                    .FirstOrDefaultAsync(s => s.Id == MapElementId);

                    if (element is null)
                        return NotFound("Element not found");

                    statBase.MapElementId = element.Id;
                }

            //Add choices stats
            var questionChoices = choices.GroupBy(c => c.Question);

            var TextRangeInputQuestions = textChoices.Select(c => c.Question).Distinct().ToList();
            TextRangeInputQuestions.AddRange(rangeChoices.Select(c => c.Question).Distinct());

            TextRangeInputQuestions = TextRangeInputQuestions
                .Distinct()
                .Where(q => !questionChoices.Any(qq => qq.Key.Id == q.Id))
                .ToList();


            foreach(var qc in questionChoices)
            {
                var _textChoices = textInputChoices.Where(c => qc.Key.Choices.Any(cc => cc.Id == c.Id));
                var _rangeChoices = rangeInputChoices.Where(c => qc.Key.Choices.Any(cc => cc.Id == c.Id));

                var newStat = new QuestionnaireStatisticInstance()
                {
                    QuestionId = qc.Key.Id,

                    DataPoolId = survey.DataPoolId,

                    RemovedChoicesCount = 0,

                    Statistics = qc.Select(c => new QuestionnaireQuestionChoiceStatistic()
                    {
                        DataPoolId = survey.DataPoolId,

                        ChoiceId = c.Id,
                    }).ToList()
                };

                newStat.Statistics.AddRange(_textChoices.Select(c => new QuestionnaireQuestionChoiceStatistic() {
                    DataPoolId = survey.DataPoolId,

                    ChoiceId = c.Id,

                    Value = c.Text
                }));

                newStat.Statistics.AddRange(_rangeChoices.Select(c => new QuestionnaireQuestionChoiceStatistic()
                {
                    DataPoolId = survey.DataPoolId,

                    ChoiceId = c.Id,

                    Value = ""+ c.Value
                }));

                statBase.Instances.Add(newStat);
            }

            foreach (var qc in TextRangeInputQuestions)
            {
                var _textChoices = textInputChoices.Where(c => qc.Choices.Any(cc => cc.Id == c.Id));
                var _rangeChoices = rangeInputChoices.Where(c => qc.Choices.Any(cc => cc.Id == c.Id));

                var newStat = new QuestionnaireStatisticInstance()
                {
                    QuestionId = qc.Id,

                    DataPoolId = survey.DataPoolId,

                    RemovedChoicesCount = 0,
                };

                newStat.Statistics.AddRange(_textChoices.Select(c => new QuestionnaireQuestionChoiceStatistic()
                {
                    DataPoolId = survey.DataPoolId,

                    ChoiceId = c.Id,

                    Value = c.Text
                }));

                newStat.Statistics.AddRange(_rangeChoices.Select(c => new QuestionnaireQuestionChoiceStatistic()
                {
                    DataPoolId = survey.DataPoolId,

                    ChoiceId = c.Id,

                    Value = "" + c.Value
                }));

                statBase.Instances.Add(newStat);
            }

            survey.ParticipationStatistics.Add(statBase);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AssignSeries(
        int SurveyId,
        List<int> SeriesIds
        )
        {
            //Get survey
            var survey = await _applicationDbContext.Questionnaires
                .Include(q => q.Relations)
                .FirstOrDefaultAsync(s => s.Id == SurveyId);

            if (survey is null)
                return NotFound("Questionnaire not found");

            var series = await _applicationDbContext.QuestionSeries
                .Where(s => SeriesIds.Any(id => s.Id == id) && s.DataPoolId == survey.DataPoolId)
                .ToListAsync();

            if (series.Count != SeriesIds.Distinct().Count())
                return BadRequest("Series data not coherent");

            var nonAssignedSeries = series
                .Where(s => !survey.Relations.Any(r => r.SeriesId == s.Id))
                .ToList();

            foreach (var s in nonAssignedSeries)
            {
                var Relation = await _applicationDbContext.QuestionnaireSeriesRelation
                    .FirstOrDefaultAsync(r => r.SeriesId == s.Id);

                if (Relation is null) continue;

                _applicationDbContext.QuestionnaireSeriesRelation.Remove(Relation);
            }

            await _applicationDbContext.SaveChangesAsync();

            foreach (var s in nonAssignedSeries)
            {
                survey.Relations.Add(new QuestionnaireSeriesRelation()
                {
                    SeriesId = s.Id,
                    QuestionnaireId = survey.Id,

                    DataPoolId = survey.DataPoolId,
                });
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeassignSeries(
        int SurveyId,
        List<int> SeriesIds
        )
        {
            //Get survey
            var survey = await _applicationDbContext.Questionnaires
                .Include(q => q.Relations)
                .FirstOrDefaultAsync(s => s.Id == SurveyId);

            if (survey is null)
                return NotFound("Questionnaire not found");

            var series = await _applicationDbContext.QuestionSeries
                .Where(s => SeriesIds.Any(id => s.Id == id) && s.DataPoolId == survey.DataPoolId)
                .ToListAsync();

            if (series.Count != SeriesIds.Distinct().Count())
                return BadRequest("Series data not coherent");

            var assignedSeries = series
                .Where(s => survey.Relations.Any(r => r.SeriesId == s.Id))
                .ToList();

            if(assignedSeries.Count != series.Count)
                return BadRequest("Some series are not assigned");

            var relations = survey.Relations.Where(r => assignedSeries.Any(a => a.Id == r.SeriesId)).ToList();

            foreach(var r in relations)
            {
                survey.Relations.Remove(r);
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AssignMapElement(
        int SurveyId, 
        int MapElementId
        )
        {
            //Get survey
            var survey = await _applicationDbContext.Questionnaires
                .Include(q => q.MapElementRelations)
                .FirstOrDefaultAsync(s => s.Id == SurveyId);

            if (survey is null)
                return NotFound("Questionnaire not found");

            var element = await _applicationDbContext.CourseMapElement
                .Include(e => e.QuestionnaireRelation)
                .FirstOrDefaultAsync(s => s.Id == MapElementId && s.Map.DataPoolId == survey.DataPoolId);

            if (element is null)
                return BadRequest("Element not found");

            var existingRelation = element.QuestionnaireRelation;

            if(!(existingRelation is null))
            {
                _applicationDbContext.QuestionnaireMapElementRelation.Remove(existingRelation);
                await _applicationDbContext.SaveChangesAsync();
            }

            var newRelation = new QuestionnaireMapElementRelation()
            {
                DataPoolId = survey.DataPoolId,
                IsRepeatable = false,
                QuestionnaireId = survey.Id,
                MapElementId = element.Id
            };

            _applicationDbContext.QuestionnaireMapElementRelation.Add(newRelation);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeassignMapElement(
        int MapElementId
        )
        {
            var element = await _applicationDbContext.CourseMapElement
                .Include(e => e.QuestionnaireRelation)
                .FirstOrDefaultAsync(s => s.Id == MapElementId);

            if (element is null)
                return BadRequest("Element not found");

            var existingRelation = element.QuestionnaireRelation;

            if (existingRelation is null)
                return BadRequest("Relation does not exist");

            _applicationDbContext.QuestionnaireMapElementRelation.Remove(existingRelation);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> FlipRepeatableMapElement(
       int MapElementId
       )
        {
            var element = await _applicationDbContext.CourseMapElement
                .Include(e => e.QuestionnaireRelation)
                .FirstOrDefaultAsync(s => s.Id == MapElementId);

            if (element is null)
                return BadRequest("Element not found");

            var existingRelation = element.QuestionnaireRelation;

            if (existingRelation is null)
                return BadRequest("Relation does not exist");

            existingRelation.IsRepeatable = !existingRelation.IsRepeatable;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditSurveyCode(
        int SurveyId,
        string Code
        )
        {
            //Get survey
            var survey = await _applicationDbContext.Questionnaires
                .FirstOrDefaultAsync(s => s.Id == SurveyId);

            if (survey is null)
                return NotFound("Questionnaire not found");

            if (string.IsNullOrEmpty(Code))
                return BadRequest("Please add code");

            var codeUsed = await _applicationDbContext.Questionnaires
                .AnyAsync(q => q.Code == Code && q.Id != survey.Id);

            if(codeUsed)
                return BadRequest("Code already in use");

            survey.Code = Code;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditSurveyFinalText(
        int SurveyId,
        string FinalText
        )
        {
            //Get survey
            var survey = await _applicationDbContext.Questionnaires
                .FirstOrDefaultAsync(s => s.Id == SurveyId);

            if (survey is null)
                return NotFound("Questionnaire not found");

            survey.FinalText = FinalText;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> EditSurveyExplanation(
        int SurveyId,
        string Explanation
        )
        {
            //Get survey
            var survey = await _applicationDbContext.Questionnaires
                .FirstOrDefaultAsync(s => s.Id == SurveyId);

            if (survey is null)
                return NotFound("Questionnaire not found");

            survey.Explanation = Explanation;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveSurveyImage(
       int SurveyId
       )
        {
            //Get survey
            var survey = await _applicationDbContext.Questionnaires
                .FirstOrDefaultAsync(q => q.Id == SurveyId);

            if (survey is null)
                return NotFound("Questionnare not found");

            survey.ImageURL = null;
            survey.ImageSize = 0;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> FlipRepeatable(
       int SeriesId
       )
        {
            //Get series
            var series = await _applicationDbContext.QuestionSeries
                .Include(s => s.QuestionnaireRelation)
                .FirstOrDefaultAsync(s => s.Id == SeriesId);

            if (series is null)
                return BadRequest("Series not found");

            if(series.QuestionnaireRelation is null)
                return BadRequest("Series has no questionnaire assigned");

            series.QuestionnaireRelation.IsRepeatable = !series.QuestionnaireRelation.IsRepeatable;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CopySurveyQuestion(
        string Title,
        int SurveyId,
        int QuestionId
       )
        {
            //Get survey
            var survey = await _applicationDbContext.Questionnaires
                .Include(s => s.Questions)
                .FirstOrDefaultAsync(q => q.Id == SurveyId);

            if (survey is null)
                return NotFound("Questionnare not found");

            //Get question
            var question = await _applicationDbContext.QuestionnaireQuestion
                .Include(q => q.Choices)
                .Include(q => q.Questionnaire)
                .ThenInclude(s => s.Questions)
                .FirstOrDefaultAsync(q => q.Id == QuestionId && q.DataPoolId == survey.DataPoolId);

            if (question is null)
                return NotFound("Question not found");

            if(string.IsNullOrEmpty(Title))
                return NotFound("Please provide a title");

            if(survey.Questions.Any(q => q.Title == Title))
                return NotFound("Repeated title");

            //Copy question
            var newQuestion = new QuestionnaireQuestion()
            {
                Title = Title,

                IsSingleChoice = question.IsSingleChoice,
                Body = question.Body,

                DataPoolId = survey.DataPoolId,

                Order = survey.Questions.Count
            };

            //copy image
            if (!string.IsNullOrEmpty(question.ImageURL))
            {
                var path = Path.Combine("wwwroot/SimpleClickableQuestions", $"Question_{survey.Code.ToString()}");
                var pathToImage = question.ImageURL;
                pathToImage = Path.Combine("wwwroot", pathToImage);

                var URL = await CopyFile(pathToImage, path);

                newQuestion.ImageURL = URL;
                newQuestion.ImageSize = question.ImageSize;
            }

            foreach(var c in question.Choices)
            {
                var newChoice = new QuestionnaireQuestionChoice()
                {
                    DataPoolId = survey.DataPoolId,

                    LaTex = c.LaTex,

                    Order = c.Order,

                    Type = c.Type,

                    MaxCharacterCount = c.MaxCharacterCount,

                    Start = c.Start,
                    End = c.End,
                    Step = c.Step
                };

                //copy image
                if (!string.IsNullOrEmpty(c.ImageURL))
                {
                    var path = Path.Combine("wwwroot/SimpleClickableQuestions", $"Question_{survey.Code.ToString()}");
                    var pathToImage = c.ImageURL;
                    pathToImage = Path.Combine("wwwroot", pathToImage);

                    var URL = await CopyFile(pathToImage, path);

                    newChoice.ImageURL = URL;
                    newChoice.ImageSize = c.ImageSize;
                }

                newQuestion.Choices.Add(newChoice);
            }

            survey.Questions.Add(newQuestion);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CopySurvey(
        string Code,
        int SurveyId
       )
        {
            //Get survey
            var survey = await _applicationDbContext.Questionnaires
                .Include(s => s.Questions)
                .ThenInclude(q => q.Choices)
                .FirstOrDefaultAsync(q => q.Id == SurveyId);

            if (survey is null)
                return NotFound("Questionnare not found");

            
            //Check code unique in datapool
            var codeUsed = await _applicationDbContext.Questionnaires
                .AnyAsync(q => q.DataPoolId == survey.DataPoolId && q.Code == Code);

            if (codeUsed)
                return BadRequest("Code used, choose another code");

            if (string.IsNullOrEmpty(Code))
                return NotFound("Please provide a title");

            if (survey.Questions.Any(q => q.Title == Code))
                return NotFound("Repeated title");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var newSurvey = new Questionnaire()
            {
                DataPoolId = survey.DataPoolId,

                Code = Code,

                Explanation = survey.Explanation,
                FinalText = survey.FinalText,

                AddedById = Owner.Id
            };

            if (!string.IsNullOrEmpty(survey.ImageURL))
            {
                var path = Path.Combine("wwwroot/SimpleClickableQuestions", $"Question_{survey.Code.ToString()}");
                var pathToImage = survey.ImageURL;
                pathToImage = Path.Combine("wwwroot", pathToImage);

                var URL = await CopyFile(pathToImage, path);

                newSurvey.ImageURL = URL;
                newSurvey.ImageSize = survey.ImageSize;
            }

            foreach(var question in survey.Questions)
            {
                //Copy question
                var newQuestion = new QuestionnaireQuestion()
                {
                    Title = question.Title,

                    IsSingleChoice = question.IsSingleChoice,
                    Body = question.Body,

                    DataPoolId = survey.DataPoolId,

                    Order = question.Order
                };

                //copy image
                if (!string.IsNullOrEmpty(question.ImageURL))
                {
                    var path = Path.Combine("wwwroot/SimpleClickableQuestions", $"Question_{survey.Code.ToString()}");
                    var pathToImage = question.ImageURL;
                    pathToImage = Path.Combine("wwwroot", pathToImage);

                    var URL = await CopyFile(pathToImage, path);

                    newQuestion.ImageURL = URL;
                    newQuestion.ImageSize = question.ImageSize;
                }

                foreach (var c in question.Choices)
                {
                    var newChoice = new QuestionnaireQuestionChoice()
                    {
                        DataPoolId = survey.DataPoolId,

                        LaTex = c.LaTex,

                        Order = c.Order,

                        Type = c.Type,

                        MaxCharacterCount = c.MaxCharacterCount,

                        Start = c.Start,
                        End = c.End,
                        Step = c.Step
                    };

                    //copy image
                    if (!string.IsNullOrEmpty(c.ImageURL))
                    {
                        var path = Path.Combine("wwwroot/SimpleClickableQuestions", $"Question_{survey.Code.ToString()}");
                        var pathToImage = c.ImageURL;
                        pathToImage = Path.Combine("wwwroot", pathToImage);

                        var URL = await CopyFile(pathToImage, path);

                        newChoice.ImageURL = URL;
                        newChoice.ImageSize = c.ImageSize;
                    }

                    newQuestion.Choices.Add(newChoice);
                }

                newSurvey.Questions.Add(newQuestion);
            }

            _applicationDbContext.Questionnaires.Add(newSurvey);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateSurveyImage(
        int SurveyId,
        IFormFile Picture
        )
        {
            //Get survey
            var survey = await _applicationDbContext.Questionnaires
                .FirstOrDefaultAsync(q => q.Id == SurveyId);

            if (survey is null)
                return NotFound("Questionnaire not found");

            if (Picture is null)
                return BadRequest("Please add an image");

            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var filesExtensionValid = !validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (filesExtensionValid)
            {
                return BadRequest("Files' extensions not valid");
            }

            var path = Path.Combine("wwwroot/SimpleClickableQuestions", $"Question_{survey.Code.ToString()}");

            var URL = "";
            URL = await SaveFile(path, Picture);

            survey.ImageURL = URL;
            survey.ImageSize = (int)Picture.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestion(
        int SurveyId,
        string Title,
        string Body,
        string QuestionString,
        bool IsSingleChoice,
        List<string> FileListCodes,
        List<IFormFile> Files
        )
        {
            //Get survey
            var survey = await _applicationDbContext.Questionnaires
                .Include(s => s.Questions)
                .FirstOrDefaultAsync(s => s.Id == SurveyId);

            if (survey is null)
                return NotFound("Questionnaire not found");

            if (string.IsNullOrEmpty(Title) || string.IsNullOrEmpty(Body))
                return BadRequest("Title and body are required");

            //Check title is unique
            var titleRepeated = survey.Questions.Any(q => q.Title == Title);

            if (titleRepeated)
                return BadRequest("Title is repeated");

            var question = Newtonsoft.Json.JsonConvert.DeserializeObject<QuestionnaireQuestionViewModel>(QuestionString);

            //check complete
            if (question is null)
                return BadRequest("Error reading data");

            if(question.Choices.Sum(c => (int)(c.Type.Value)) < 4)
                return BadRequest("A question should have atleast (two normal / one text input / one range input) choice(s)");

            if (question.Choices.Select(c => c.LaTex).Distinct().Count() != question.Choices.Count)
                return BadRequest("Choices should have unique LaTeX");

            //check files ok
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var filesExtensionsValid = Files.Any(f => !validExtenstions.Any(ve => f.FileName.EndsWith(ve)));

            if (filesExtensionsValid)
            {
                return BadRequest("Files' extensions not valid");
            }

            var newOrder = survey.Questions.Max(a => a.Order) + 1; 

            var newQ = new QuestionnaireQuestion()
            {
                Body = Body,
                Title = Title,

                IsSingleChoice = IsSingleChoice,

                Order = newOrder,

                DataPoolId = survey.DataPoolId
            };

            var path = Path.Combine("wwwroot/SimpleClickableQuestions", $"Question_{survey.Code.ToString()}");

            //add image
            if (!string.IsNullOrEmpty(question.ImageURL))
            {
                //save image and assign url

                //try to get file
                var fileIndex = FileListCodes.IndexOf(question.ImageURL);

                if (fileIndex == -1)
                {
                    //try default image
                    var imageId = 0;
                    int.TryParse(question.ImageURL, out imageId);

                    var defaultImage = await _applicationDbContext.QuestionImages
                        .FirstOrDefaultAsync(iq => iq.Id == imageId);

                    if (defaultImage != null)
                    {
                        //copy and save image and assign url
                        var pathToImage = defaultImage.ImageURL;
                        pathToImage = Path.Combine("wwwroot", pathToImage);

                        var URL = await CopyFile(pathToImage, path);

                        newQ.ImageURL = URL;
                    }
                }
                else
                {
                    var file = Files[fileIndex];

                    var URL = "";
                    URL = await SaveFile(path, file);

                    newQ.ImageURL = URL;
                    newQ.ImageSize = (int)file.Length;
                }
            }

            //choices
            foreach (var c in question.Choices)
            {
                var newChoice = new QuestionnaireQuestionChoice()
                {
                    DataPoolId = survey.DataPoolId,

                    LaTex = c.LaTex,

                    Order = c.Order,

                    Type = c.Type,

                    MaxCharacterCount = c.MaxCharacterCount,

                    Start = c.Start,
                    End = c.End,
                    Step = c.Step,
                };

                //add image
                if (!string.IsNullOrEmpty(c.ImageURL))
                {
                    //try to get file
                    var fileIndex = FileListCodes.IndexOf(c.ImageURL);

                    if (fileIndex != -1)
                    {
                        //save image and assign url
                        var file = Files[fileIndex];

                        var URL = "";
                        URL = await SaveFile(path, file);

                        newChoice.ImageURL = URL;
                        newChoice.ImageSize = (int)file.Length;
                    }
                }

                newQ.Choices.Add(newChoice);
            }

            survey.Questions.Add(newQ);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestion(
        int QuestionId
        )
        {
            //Get question
            var question = await _applicationDbContext.QuestionnaireQuestion
                .Include(q => q.Questionnaire)
                .ThenInclude(s => s.Questions)
                .Include(q => q.Questionnaire)
                .ThenInclude(s => s.ParticipationStatistics)
                .ThenInclude(a => a.Instances)
                .ThenInclude(i => i.Statistics)

                .Include(q => q.Choices)

                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (question is null)
                return NotFound("Question not found");

            var participationStats = question.Questionnaire.ParticipationStatistics
                .Where(ps => ps.Instances.Any(i => i.QuestionId == question.Id))
                .ToList();

            foreach(var ps in participationStats)
            {
                ps.RemovedQuestionsCount += 1;
            }

            await _applicationDbContext.SaveChangesAsync();

            var survey = question.Questionnaire;

            survey.Questions.Remove(question);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveSurvey(
        int SurveyId
        )
        {
            //Get survey
            var survey = await _applicationDbContext.Questionnaires
                .Include(s => s.Questions)
                .ThenInclude(q => q.Choices)
                .ThenInclude(c => c.Statistics)

                .Include(s => s.Questions)
                .ThenInclude(a => a.StatisticInstances)
                .ThenInclude(i => i.Statistics)

                .Include(s => s.ParticipationStatistics)
                .ThenInclude(a => a.Instances)
                .ThenInclude(i => i.Statistics)

                .Include(s => s.Relations)
                .Include(s => s.MapElementRelations)

                .FirstOrDefaultAsync(q => q.Id == SurveyId);

            if (survey is null)
                return NotFound("Questionnaire not found");

            _applicationDbContext.Questionnaires.Remove(survey);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionTitle(
        int QuestionId,
        string Title
        )
        {
            //Get question
            var question = await _applicationDbContext.QuestionnaireQuestion
                .Include(q => q.Questionnaire)
                .ThenInclude(s => s.Questions)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (question is null)
                return NotFound("Question not found");

            if (string.IsNullOrEmpty(Title))
                return BadRequest("Please add title");

            var codeUsed = question.Questionnaire.Questions
                .Any(q => q.Title == Title && q.Id != question.Id);

            if (codeUsed)
                return BadRequest("Title already in use in same questionnaire");

            question.Title = Title;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> FlipQuestionSingleChoice(
        int QuestionId
        )
        {
            //Get question
            var question = await _applicationDbContext.QuestionnaireQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (question is null)
                return NotFound("Question not found");

            question.IsSingleChoice = !question.IsSingleChoice;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionBody(
        int QuestionId,
        string Body
        )
        {
            //Get question
            var question = await _applicationDbContext.QuestionnaireQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (question is null)
                return NotFound("Question not found");

            if (string.IsNullOrEmpty(Body))
                return BadRequest("Please add body");

            question.Body = Body;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveQuestionImage(
        int QuestionId
        )
        {
            //Get question
            var question = await _applicationDbContext.QuestionnaireQuestion
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (question is null)
                return NotFound("Question not found");

            question.ImageURL = null;
            question.ImageSize = 0;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateQuestionImage(
        int QuestionId,
        IFormFile Picture
        )
        {
            //Get question
            var question = await _applicationDbContext.QuestionnaireQuestion
                .Include(q => q.Questionnaire)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (question is null)
                return NotFound("Question not found");

            if (Picture is null)
                return BadRequest("Please add an image");

            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var filesExtensionValid = !validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (filesExtensionValid)
            {
                return BadRequest("Files' extensions not valid");
            }

            var path = Path.Combine("wwwroot/SimpleClickableQuestions", $"Question_{question.Questionnaire.Code.ToString()}");

            var URL = "";
            URL = await SaveFile(path, Picture);

            question.ImageURL = URL;
            question.ImageSize = (int)Picture.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveChoice(
        int ChoiceId
        )
        {
            //Get choice
            var choice = await _applicationDbContext.QuestionnaireQuestionChoice
                .Include(c => c.Question)
                .ThenInclude(q => q.Choices)
                .Include(c => c.Statistics)
                .ThenInclude(s => s.Instance)
                .FirstOrDefaultAsync(c => c.Id == ChoiceId);

            if (choice is null)
                return NotFound("Choice not found");

            if (choice.Question.Choices.Where(c => c.Id != choice.Id).Sum(c => (int)(c.Type.Value)) < 4)
                return BadRequest("A question should have atleast (two normal / one text input / one range input) choice(s)");

            var instances = choice.Statistics.Select(s => s.Instance).Distinct().ToList();

            foreach(var instance in instances)
            {
                instance.RemovedChoicesCount += 1;
            }

            await _applicationDbContext.SaveChangesAsync();

            _applicationDbContext.QuestionnaireQuestionChoice.Remove(choice);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddChoice(
           int QuestionId,
           string Latex,
           IFormFile Picture,
           QuestionnaireQuestionChoiceType Type,
           int? MaxCharacterCount,
           float? Start,
           float? End,
           float? Step
       )
        {
            //Get question
            var question = await _applicationDbContext.QuestionnaireQuestion
                .Include(q => q.Questionnaire)
                .Include(q => q.Choices)
                 .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (question is null)
                return NotFound("Questionnaire not found");

            if (string.IsNullOrEmpty(Latex) && Picture is null)
                return BadRequest("Please add an image or/and LaTeX content");

            var existingLatex = question.Choices.Any(c => c.LaTex == Latex);

            if (existingLatex)
                return BadRequest("Repeated LaTeX");

            var order = question.Choices.Min(c => c.Order) - 1;

            var newChoice = new QuestionnaireQuestionChoice()
            {
                DataPoolId = question.DataPoolId,

                LaTex = Latex,

                Order = order,
                Type = Type,

                MaxCharacterCount = MaxCharacterCount,

                Start = Start,
                End = End,
                Step = Step
            };

            if(Picture != null)
            {
                var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
                var filesExtensionValid = !validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

                if (filesExtensionValid)
                {
                    return BadRequest("Files' extensions not valid");
                }

                var path = Path.Combine("wwwroot/SimpleClickableQuestions", $"Question_{question.Questionnaire.Code.ToString()}");

                var URL = "";
                URL = await SaveFile(path, Picture);

                newChoice.ImageURL = URL;
                newChoice.ImageSize = (int) Picture.Length;

            }

            question.Choices.Add(newChoice);
            
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveChoiceImage(
        int ChoiceId
        )
        {
            //Get choice
            var choice = await _applicationDbContext.QuestionnaireQuestionChoice
                .FirstOrDefaultAsync(c => c.Id == ChoiceId);

            if (choice is null)
                return NotFound("Choice not found");

            if (string.IsNullOrEmpty(choice.LaTex))
                return BadRequest("Choice should have a LaTeX content or an image");

            choice.ImageURL = null;
            choice.ImageSize = 0;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveChoiceLatex(
        int ChoiceId
        )
        {
            //Get choice
            var choice = await _applicationDbContext.QuestionnaireQuestionChoice
                .FirstOrDefaultAsync(c => c.Id == ChoiceId);

            if (choice is null)
                return NotFound("Choice not found");

            if (string.IsNullOrEmpty(choice.ImageURL))
                return BadRequest("Choice should have a LaTeX content or an image");

            choice.LaTex = null;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditChoiceLatex(
        int ChoiceId,
        string Latex
        )
        {
            //Get choice
            var choice = await _applicationDbContext.QuestionnaireQuestionChoice
                .Include(c => c.Question)
                .ThenInclude(q => q.Choices)
                .FirstOrDefaultAsync(c => c.Id == ChoiceId);

            if (choice is null)
                return NotFound("Choice not found");

            if (string.IsNullOrEmpty(Latex))
                return BadRequest("LaTeX content is empty");

            var question = choice.Question;

            var existingLatex = question.Choices.Any(c => c.LaTex == Latex && c.Id != choice.Id);

            if (existingLatex)
                return BadRequest("Repeated LaTeX");

            choice.LaTex = Latex;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditChoiceImage(
        int ChoiceId,
        IFormFile Picture
        )
        {
            //Get choice
            var choice = await _applicationDbContext.QuestionnaireQuestionChoice
                .Include(c => c.Question)
                .ThenInclude(q => q.Questionnaire)
                .FirstOrDefaultAsync(c => c.Id == ChoiceId);

            if (choice is null)
                return NotFound("Choice not found");

            if (Picture is null)
                return BadRequest("Please add an image");

            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var filesExtensionValid = !validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (filesExtensionValid)
            {
                return BadRequest("Files' extensions not valid");
            }

            var path = Path.Combine("wwwroot/SimpleClickableQuestions", $"Question_{choice.Question.Questionnaire.Code.ToString()}");

            var URL = "";
            URL = await SaveFile(path, Picture);

            choice.ImageURL = URL;
            choice.ImageSize = (int)Picture.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
