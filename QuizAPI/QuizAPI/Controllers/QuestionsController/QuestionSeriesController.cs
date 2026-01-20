using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.Questions;
using QuizAPI.Models.Questions.QuestionSeries;
using QuizAPI.Models.Questions.QuestionSeries.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using static QuizAPI.Controllers.QuestionsController.SimpleClickableController;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.QuestionsController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class QuestionSeriesController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;

        public QuestionSeriesController(
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
            return View();
        }

        [HttpGet("[action]/{DataPoolId}")]
        public async Task<IActionResult> GetSeriesAdders(int DataPoolId)
        {
            var Adders = await _applicationDbContext.QuestionSeries
                .Where(s => s.DataPoolId == DataPoolId)
                .Select(s => s.AddedBy)
                .Distinct()
                .Select(a => a.Name)
                .OrderBy(s => s)
                .ToListAsync();

            return Ok(Adders);
        }


        [HttpPost("[action]")]
        public async Task<IActionResult>SearchSeries_ADVANCED([FromBody] SeriesSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            Expression<Func<QuestionSeries,bool>> criteria = (s) =>
                (
                s.DataPoolId == VM.DataPoolId &&
                (!VM.Used ? s.MapElements.Count == 0 : true)
                &&
                (
                !string.IsNullOrEmpty(VM.Adder) ? s.AddedBy.Name == VM.Adder : true
                ) &&
                (
                !string.IsNullOrEmpty(VM.Code) ? s.Code.ToLower().Contains(VM.Code.ToLower()) : true
                )
                );

            var CodesNumbers = await _applicationDbContext.QuestionSeries
                .Where(criteria)
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

            var SeriesIds = new List<int>();

            SeriesIds = await _applicationDbContext.QuestionSeries
              .Where(criteria)
                .OrderBy(q => q.Code)
                .Select((q) => q.Id)
               .ToListAsync();

            var SeriesCodes = await _applicationDbContext.QuestionSeries
                 .Where(criteria)
                .OrderBy(q => q.Code)
                .Select((q) => q.Code)
               .ToListAsync();

            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.Elements)
                .Include(s => s.AddedBy)
                .Include(s => s.MapElements)
                .ThenInclude(me => me.Map)
                .Include(s => s.Owners)
                .ThenInclude(o => o.Owner)

                //.Include(s => s.Statistics)

                .Where(criteria)

                .OrderBy(s => s.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)
                .ToListAsync();

            return Ok(new {
                Series = _mapper.Map<List<QuestionSeries>, List<QuestionSeries_Statistics_ViewModel>>(Series),
                Codes = Codes,
                NumberOfSeries = CodesNumbers.Count,
                SeriesIds = SeriesIds,
                SeriesCodes = SeriesCodes
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchSeriesByIds_ADVANCED([FromBody] SearchSeriesByIdViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            var Series = await _applicationDbContext.QuestionSeries
                .Where(q => VM.Ids.Any(Id => Id == q.Id))
                .Include(s => s.Elements)
                .Include(s => s.AddedBy)
                .Include(s => s.MapElements)
                .ThenInclude(me => me.Map)
                .Include(s => s.Owners)
                .ThenInclude(o => o.Owner)
                .ToListAsync();

            return Ok(new
            {
                Series = _mapper.Map<List<QuestionSeries>, List<QuestionSeries_Statistics_ViewModel>>(Series),
                Codes = VM.Codes,
                NumberOfSeries = VM.NumberOfSeries,
                SeriesIds = VM.SeriesIds,
                SeriesCodes = VM.Codes
            });

        }


        [HttpPost("[action]")]
        public async Task<IActionResult> SearchSeries_OWNED_ADVANCED([FromBody] SeriesSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);


            var CodesNumbers = await _applicationDbContext.QuestionSeries
                .Where(s =>
                                 s.DataPoolId == VM.DataPoolId &&
                    s.Owners.Any(o => o.OwnerId == Owner.Id))
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

            var SeriesIds = new List<int>();

            SeriesIds = await _applicationDbContext.QuestionSeries
                 .Where(s => s.DataPoolId == VM.DataPoolId &&
s.Owners.Any(o => o.OwnerId == Owner.Id))
                .OrderBy(q => q.Code)
                .Select((q) => q.Id)
               .ToListAsync();

            var SeriesCodes = await _applicationDbContext.QuestionSeries
                 .Where(s => s.DataPoolId == VM.DataPoolId &&
                s.Owners.Any(o => o.OwnerId == Owner.Id))
                .OrderBy(q => q.Code)
                .Select((q) => q.Code)
               .ToListAsync();

            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.Elements)
                .Include(s => s.AddedBy)
                .Include(s => s.MapElements)
                .ThenInclude(me => me.Map)
                .Include(s => s.Owners)
                .ThenInclude(o => o.Owner)

                //.Include(s => s.Statistics)

                .Where(s => s.DataPoolId == VM.DataPoolId &&
s.Owners.Any(o => o.OwnerId == Owner.Id))
                .OrderBy(s => s.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)
                .ToListAsync();

            return Ok(new
            {
                Series = _mapper.Map<List<QuestionSeries>, List<QuestionSeries_Statistics_ViewModel>>(Series),
                Codes = Codes,
                NumberOfSeries = CodesNumbers.Count,
                SeriesIds = SeriesIds,
                SeriesCodes = SeriesCodes
            });
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetMySeries()
        {
            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.AddedBy)
                .Include(s => s.Owners)
                .ThenInclude(o => o.Owner)
                .Include(s => s.Elements)
                .Include(s => s.MapElements)
                .ThenInclude(me => me.Map)
                .Where(s => s.Owners.Any(o => o.OwnerId == Owner.Id))
                .OrderBy(s => s.Code)
                .ToListAsync();

            return Ok(_mapper.Map<List<QuestionSeries>, List<QuestionSeriesViewModel>>(Series));
        }

        [HttpGet("[action]/{DatapoolId}")]
        public async Task<IActionResult> GetAllSeries(int DatapoolId)
        {
            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.Elements)
                .ThenInclude(a => a.Question)
                .Where(s => s.DataPoolId == DatapoolId)
                .ToListAsync();

            return Ok(_mapper.Map<List<QuestionSeries>, List<QuestionSeriesViewModel>>(Series));
        }

        [HttpGet("[action]/{Code}")]
        public async Task<IActionResult> GetAllSeriesByCode(string Code)
        {
            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.AddedBy)
                .Include(s => s.Owners)
                .ThenInclude(o => o.Owner)
                .Include(s => s.Elements)
                .Where(s => s.Code.ToUpper().Contains(Code.ToUpper()))
                .ToListAsync();

            return Ok(_mapper.Map<List<QuestionSeries>, List<QuestionSeriesViewModel>>(Series));
        }

        [HttpGet("[action]/{Code}")]
        public async Task<IActionResult> GetSeries(string Code)
        {
            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.Owners)
                .ThenInclude(o => o.Owner)

                .Include(s => s.Elements)
                .ThenInclude(e => e.ClickableQuestion)

                .Include(s => s.Elements)
                .ThenInclude(e => e.KeyboardQuestion)

                .Include(s => s.Elements)
                .ThenInclude(e => e.Question)
                .ThenInclude(q => q.Information)

                .Include(s => s.Elements)
                .ThenInclude(e => e.MultipleChoiceQuestion)

                .Include(s => s.QuestionnaireRelation)
                .FirstOrDefaultAsync(s => s.Code == Code);

            if (Series is null)
                return NotFound("Not Found");

            Series.Elements = Series.Elements.OrderBy(e => e.Order).ToList();

            if (Series is null)
                return NotFound("Not Found");

            return Ok(_mapper.Map<QuestionSeries, QuestionSeriesViewModel>(Series));
        }

        [HttpGet("[action]/{Code}/{PlayerKey}")]
        public async Task<IActionResult> GetSeries(string Code, string PlayerKey)
        {
            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.Owners)
                .ThenInclude(o => o.Owner)

                .Include(s => s.Elements)
                .ThenInclude(e => e.ClickableQuestion)

                .Include(s => s.Elements)
                .ThenInclude(e => e.KeyboardQuestion)

                .Include(s => s.Elements)
                .ThenInclude(e => e.Question)
                .ThenInclude(q => q.Information)

                .Include(s => s.Elements)
                .ThenInclude(e => e.MultipleChoiceQuestion)

                .Include(s => s.QuestionnaireRelation)
                .FirstOrDefaultAsync(s => s.Code == Code);

            if (Series is null)
                return NotFound("Not Found");

            Series.Elements = Series.Elements.OrderBy(e => e.Order).ToList();

            var relation = Series.QuestionnaireRelation;

            //Get last play for half day
            var includeSurvey = true;
            if(relation != null)
            {
                if (relation.IsRepeatable)
                {
                    DateTime time = (DateTime.Now).AddSeconds(-1);
                    var alreadyPlayed = await _applicationDbContext.QuestionnaireStatisticInstanceBase
                        .AnyAsync(i =>
                        i.SeriesId == Series.Id
                        && i.QuestionnaireId == relation.QuestionnaireId
                        && i.Player == PlayerKey
                        && i.DateCreated >= time);

                    includeSurvey = !alreadyPlayed;
                }
                else
                {
                    var alreadyPlayed = await _applicationDbContext.QuestionnaireStatisticInstanceBase
                        .AnyAsync(i =>
                        i.SeriesId == Series.Id
                        && i.QuestionnaireId == relation.QuestionnaireId
                        && i.Player == PlayerKey);

                    includeSurvey = !alreadyPlayed;
                }
            }
           
            if (!includeSurvey)
            {
                Series.QuestionnaireRelation = null;
            }

            return Ok(_mapper.Map<QuestionSeries, QuestionSeriesViewModel>(Series));
        }

        [HttpGet("[action]/{Code}")]
        public async Task<IActionResult> GetSeries_EXTENDED(string Code)
        {
            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.Owners)
                .ThenInclude(o => o.Owner)

                .Include(s => s.Elements)
                .ThenInclude(e => e.ClickableQuestion)

                .Include(s => s.Elements)
                .ThenInclude(e => e.KeyboardQuestion)

                .Include(s => s.Elements)
                .ThenInclude(e => e.MultipleChoiceQuestion)

                .Include(s => s.Elements)
                .ThenInclude(e => e.Question)
                .ThenInclude(q => q.LevelOfDifficulty)

                .Include(s => s.Elements)
                .ThenInclude(e => e.Question)
                .ThenInclude(q => q.Subtopic)
                .ThenInclude(st => st.Topic)

                .Include(s => s.Elements)
                .ThenInclude(e => e.Question)
                .ThenInclude(q => q.QuestionMap31Extension)

                .Include(s => s.MapElements)
                .ThenInclude(me => me.Map)
                .ThenInclude(m => m.Course)

                .Include(s => s.QuestionnaireRelation)
                .ThenInclude(r => r.Questionnaire)
                .FirstOrDefaultAsync(s => s.Code == Code);

            if (Series is null)
                return NotFound("Not Found");

            Series.Elements = Series.Elements.OrderBy(e => e.Order).ToList();

            if (Series is null)
                return NotFound("Not Found");

            return Ok(_mapper.Map<QuestionSeries, QuestionSeries_Statistics_ViewModel>(Series));
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetSeriesElementStatistics_EXTENDED(int Id)
        {
            var SeriesStats = await _applicationDbContext.QuestionSeries
                .Include(s => s.Elements)
                .ThenInclude(e => e.Question)
                .ThenInclude(q => q.QuestionStatistics)
                .ThenInclude(st => st.TotalTime)
                .Select(s => new
                {
                    Code = s.Code,
                    Id = s.Id,
                    TotalPlay = s.Statistics.Count,
                    TotalPlayOnMobile = s.Statistics.Count(a => a.OnMobile),

                    MedianPlayTime =
                    s.Statistics.Any() ?
                    s.Statistics.OrderBy(a => a.TotalTime).Skip(s.Statistics.Count/2).FirstOrDefault().TotalTime : 0,

                    ElementStats = s.Elements
                    .OrderBy(e => e.Order)
                    .Select(e => new
                    {
                        Id = e.Id,

                        TotalPlay = e.Question.QuestionStatistics.Count,
                        TotalSuccessPlay = e.Question.QuestionStatistics.Count(st => st.Correct),

                        MedianPlayTime = 
                        e.Question.QuestionStatistics
                        .Any(st => st.TotalTime.HasValue)
                        ? 
                        e.Question.QuestionStatistics
                        .Where(st => st.TotalTime.HasValue)
                        .OrderBy(a => a.TotalTime)
                        .Skip(e.Question.QuestionStatistics.Where(st => st.TotalTime.HasValue).Count() / 2)
                        .FirstOrDefault().TotalTime : 0,
                    })
                })
                .FirstOrDefaultAsync(s => s.Id == Id);

            return Ok(SeriesStats);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetSeriesSpecificElementStatistics_EXTENDED([FromBody] QuestionSeriesViewModel VM)
        {

            var SeriesStats = await _applicationDbContext.QuestionSeriesElement
                .Include(e => e.Question)
                .ThenInclude(q => q.QuestionStatistics)
                .ThenInclude(st => st.TotalTime)
                .OrderBy(e => e.Order)
                .Where(e => VM.Elements.Any(ve => ve.Id == e.Id))
                .Select(e => new
                {
                    Id = e.Id,

                    TotalPlay = e.Question.QuestionStatistics.Count,
                    TotalSuccessPlay = e.Question.QuestionStatistics.Count(st => st.Correct),

                    MedianPlayTime = e.Question.QuestionStatistics
                        .Where(st => st.TotalTime.HasValue)
                        .OrderBy(a => a.TotalTime)
                        .Skip(e.Question.QuestionStatistics.Where(st => st.TotalTime.HasValue).Count() / 2)
                        .FirstOrDefault().TotalTime
                })
                .ToListAsync();

            return Ok(SeriesStats);
        }


        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetSeriesId_EXTENDED(int Id)
        {
            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.Owners)
                .ThenInclude(o => o.Owner)

                .Include(s => s.Elements)
                .ThenInclude(e => e.ClickableQuestion)

                .Include(s => s.Elements)
                .ThenInclude(e => e.KeyboardQuestion)

                .Include(s => s.Elements)
                .ThenInclude(e => e.MultipleChoiceQuestion)

                .Include(s => s.Elements)
                .ThenInclude(e => e.Question)

                .Include(s => s.Statistics)

                .Include(s => s.MapElements)
                .ThenInclude(me => me.Map)
                .ThenInclude(m => m.Course)

                .FirstOrDefaultAsync(s => s.Id == Id);

            if (Series is null)
                return NotFound("Not Found");

            Series.Elements = Series.Elements.OrderBy(e => e.Order).ToList();

            if (Series is null)
                return NotFound("Not Found");

            return Ok(_mapper.Map<QuestionSeries, QuestionSeries_Statistics_ViewModel>(Series));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddSeries([FromBody] QuestionSeriesViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var DATA_POOL = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(dp => dp.Id == VM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var CodeTaken = await _applicationDbContext.QuestionSeries
                .AnyAsync(s => s.Code == VM.Code && s.DataPoolId == DATA_POOL.Id);

            if (CodeTaken)
                return BadRequest("Code Exists Choose Different Code");

            var Questions = await _applicationDbContext.QuestionBase
                .Where(q => VM.Elements.Any(e => e.QuestionId == q.Id) && q.DataPoolId == DATA_POOL.Id)
                .ToListAsync();



            if (Questions.Count != VM.Elements.Count)
                return BadRequest("Some Questions Do Not Exist");

            if (VM.RandomSize < 1 && VM.IsRandom )
                return BadRequest("Random Size Should Be Positive");

            if (VM.RandomSize > VM.Elements.Count)
                return BadRequest("Random Size is Greater than Number of Questions");


            var Elements = new List<QuestionSeriesElement>();

            Elements.AddRange(VM.Elements
                .Select(e => new QuestionSeriesElement() { 
                    QuestionId = e.QuestionId,
                    Order = e.Order,
                    DataPoolId = DATA_POOL.Id,
                    PoolNumber = 1
                }));

           

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);


            var Series = new QuestionSeries()
            {
                Code = VM.Code.Replace(" ",""),
                Elements = Elements,
                AddedBy = Owner,
                IsRandom = VM.IsRandom,
                RandomSize = VM.RandomSize,
                DataPoolId = DATA_POOL.Id,
                NumberOfPools = 1
            };

            Series.Owners.Add(new Models.Ownership.QuestionSeriesOwner()
            {
                Owner = Owner,
                DataPoolId = DATA_POOL.Id
            });


            _applicationDbContext.QuestionSeries.Add(Series);

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<QuestionSeries, QuestionSeriesViewModel>(Series));
        }

        [HttpPost("[action]")] 
        public async Task<IActionResult> AddSeriesElements([FromBody] QuestionSeriesViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.Elements)
                 .FirstOrDefaultAsync(s => s.Id == VM.Id);

            if (Series is null)
                return NotFound("Not Found");

            
            if (Series.Elements.Any(e => e.QuestionId.HasValue 
            && VM.Elements.Any(evm => evm.QuestionId == e.QuestionId))
               )

                return NotFound("Some Questions Are Already Included");

            var Questions = await _applicationDbContext.QuestionBase
                .Where(q => VM.Elements.Any(e => e.QuestionId == q.Id))
                .ToListAsync();

            if (Questions.Count != VM.Elements.Count)
                return BadRequest("Some Questions Do Not Exist");

            var Elements = new List<QuestionSeriesElement>();

            foreach(var e in VM.Elements.OrderBy(e => e.Order))
            {
                var element = new QuestionSeriesElement()
                {
                    Order = e.Order + Series.Elements.Count
                };

               
                element.QuestionId = e.QuestionId;
                element.PoolNumber = 1;


                Elements.Add(element);
            }

          

            Series.Elements.AddRange(Elements);

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<QuestionSeries, QuestionSeriesViewModel>(Series));

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditSeriesCode([FromBody] QuestionSeriesViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.Elements)
                .FirstOrDefaultAsync(s => s.Id == VM.Id);

            if (Series is null)
                return NotFound("Not Found");

            var CodeTaken = await _applicationDbContext.QuestionSeries
                .AnyAsync(s => s.Code == VM.Code && s.Id != VM.Id);

            if (CodeTaken)
                return BadRequest("Code Exists Choose Different Code");

            if(string.IsNullOrEmpty(VM.Code))
                return BadRequest("Code cannot be empty");

            if ((VM.IsRandom) && (VM.RandomSize > Series.Elements.Count))
                return BadRequest("Random Size Can't Be Bigger than Series Elements");

            if ((VM.IsRandom) && (VM.RandomSize < 1))
                return BadRequest("Random Size Should Be Positive");

            Series.Code = VM.Code;
            Series.RandomSize = VM.RandomSize;
            Series.IsRandom = VM.IsRandom;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<QuestionSeries, QuestionSeriesViewModel>(Series));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> IncreasePoolsNumber([FromBody] QuestionSeriesViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.Elements)
                .FirstOrDefaultAsync(s => s.Id == VM.Id);

            if (Series is null)
                return NotFound("Not Found");

            Series.NumberOfPools += 1;
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<QuestionSeries, QuestionSeriesViewModel>(Series));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DecreasePoolsNumber([FromBody] QuestionSeriesViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.Elements)
                .FirstOrDefaultAsync(s => s.Id == VM.Id);

            if (Series is null)
                return NotFound("Not Found");

            var NumberOfPools = Series.NumberOfPools;

            if(NumberOfPools == 1)
            {
                return BadRequest("Number Of Pools Cannot be lower than 1");
            }

            foreach(var e in Series.Elements.Where(e => e.PoolNumber == NumberOfPools))
            {
                e.PoolNumber -= 1;
            }

            Series.NumberOfPools -= 1;
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<QuestionSeries, QuestionSeriesViewModel>(Series));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> IncreaseElementPool([FromBody] QuestionSeriesElementViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Element = await _applicationDbContext.QuestionSeriesElement
                .Include(e => e.Series)
                .FirstOrDefaultAsync(e => e.Id == VM.Id);

            var NumberOfPools = Element.Series.NumberOfPools;

            if(Element.PoolNumber == NumberOfPools)
            {
                return BadRequest("Max Pool Number Exceeded!");
            }

            Element.PoolNumber += 1;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DecreaseElementPool([FromBody] QuestionSeriesElementViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Element = await _applicationDbContext.QuestionSeriesElement
                .Include(e => e.Series)
                .FirstOrDefaultAsync(e => e.Id == VM.Id);

            var NumberOfPools = Element.Series.NumberOfPools;

            if (Element.PoolNumber == 1)
            {
                return BadRequest("Pool Number Lower than 1 not Possible!");
            }

            Element.PoolNumber -= 1;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeselectElementSeries([FromBody] QuestionSeriesElementViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Element = await _applicationDbContext.QuestionSeriesElement
                .Include(e => e.Series)
                .ThenInclude(s => s.Elements)
                .FirstOrDefaultAsync(e => e.Id == VM.Id);

            if (Element is null)
                return NotFound("Not Found");

            var Series = Element.Series;

            if(Series.Elements.Count < 1)
                return BadRequest("Series should include atleast one question");

            if (Series.IsRandom && (Series.Elements.Count - 1) < Series.RandomSize)
                return BadRequest("Series should have enough number of questions to be a random series");

            Series.Elements.Remove(Element);

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<QuestionSeries, QuestionSeriesViewModel>(Series)); 
        }
        
        [HttpPost("[action]")]
        public async Task<IActionResult> AssignElementsToPool([FromBody] AssignElementsToPoolViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Elements = await _applicationDbContext.QuestionSeriesElement
                .Include(e => e.Series)
                .ThenInclude(s => s.Elements)
                .Where(e => VM.SelectedElements.Any(se => se == e.Id))
                .ToListAsync();

            if (Elements.Count != VM.SelectedElements.Distinct().Count())
                return NotFound("Elements Not Found");

            var Series = Elements.Select(e => e.Series).Distinct().ToList();
            if (Series.Count > 1)
            {
                return BadRequest("Elements do not belong to same series");

            }

            var NumberOfPools = Series.FirstOrDefault().NumberOfPools;

            if(VM.Pool > NumberOfPools)
            {
                return BadRequest("Max Pool Exceeded");

            }

            if (VM.Pool < 1)
            {
                return BadRequest("Pool Less than 1!");

            }

            foreach (var e in Elements)
            {
                e.PoolNumber = VM.Pool;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<QuestionSeries, QuestionSeriesViewModel>(Series.FirstOrDefault()));
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> ActionElements([FromBody] ActionElementsViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var First = await _applicationDbContext.QuestionSeriesElement
                .Include(e => e.Series)
                .ThenInclude(s => s.Elements)
                .FirstOrDefaultAsync(e => e.Id == VM.FirstId);

            var Second = await _applicationDbContext.QuestionSeriesElement
                .Include(e => e.Series)
                .ThenInclude(s => s.Elements)
                .FirstOrDefaultAsync(e => e.Id == VM.SecondId);

            if (First is null || Second is null)
                return NotFound("Not Found");

            var Series = First.Series;


            var FirstOrder = First.Order;
            var SecondOrder = Second.Order;


            foreach (var e in Series.Elements.Where(e => e.Order <= SecondOrder && e.Order > FirstOrder))
            {
                e.Order = e.Order - 1;
            }

            First.Order = SecondOrder;




            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteSeries([FromBody] QuestionSeriesViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Series = await _applicationDbContext.QuestionSeries
                .FirstOrDefaultAsync(s => s.Id == VM.Id);

            if (Series is null)
                return NotFound("Not Found");

            _applicationDbContext.QuestionSeries.Remove(Series);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RearrangeSeries([FromBody] QuestionSeriesViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var Series = await _applicationDbContext.QuestionSeries
                .Include(s => s.Elements)
                .FirstOrDefaultAsync(s => s.Id == VM.Id);

            if (Series is null)
                return NotFound("Not Found");

            //Check all elements of Series exist in VM
            if (Series.Elements.Any(e => !VM.Elements.Any(vme => vme.Id == e.Id)))
                return BadRequest("Data inconsistent");

            //map VM elements into a dictionary
            var VMElements = VM.Elements.ToDictionary(e => e.Id);

            foreach(var element in Series.Elements)
            {
                element.Order = VMElements[element.Id].Order;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddStatistic(int SeriesId,
            string Player,
            string MapKey,
            string MapName,
            string MapElementName,
            string SuccessRate,
            int TotalTime, bool OnMobile)
        {

            var Series = await _applicationDbContext.QuestionSeries
                .FirstOrDefaultAsync(q => q.Id == SeriesId);

            if (Series is null)
                return NotFound("Series not found");

            Series.Statistics.Add(new QuestionSeriesStatistic()
            {
                Player = Player,
                MapKey = MapKey,
                MapName = MapName,
                MapElementName = MapElementName,
                SuccessRate = SuccessRate,

                TotalTime = TotalTime,
                DataPoolId = Series.DataPoolId,
                OnMobile = OnMobile,
            });

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

    }
}
