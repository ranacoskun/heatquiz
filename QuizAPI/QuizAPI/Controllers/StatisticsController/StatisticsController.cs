using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Mapping;
using QuizAPI.Models;
using QuizAPI.Models.Questions;
using QuizAPI.Models.Topic.ViewModels;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Controllers.StatisticsController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class StatisticsController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;

        public StatisticsController(
            IMapper mapper,
            ApplicationDbContext applicationDbContext
        )
        {
            _mapper = mapper;
            _applicationDbContext = applicationDbContext;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Test()
        {
            var topicStats = await _applicationDbContext.QuestionStatistic
                .Include(s => s.Question.Subtopic.Topic)

                .GroupBy(s => s.Question.Subtopic.Topic)
                .Select(a => new
                {
                    Name = a.Key.Name,
                    Count = a.Count()
                })
                .OrderBy(x => x.Count)
                .ToListAsync();

            var pdfStats = await _applicationDbContext.QuestionPDFStatistic
                .GroupBy(a => a.Correct)
                .Select(a => new  {
                    Correct = a.FirstOrDefault().Correct,
                    Count = a.Count()
                })
                .ToListAsync();

            return Ok(new
            {
                topicStats = topicStats,
                pdfStats = pdfStats
            });
        }


        [HttpGet("[action]/{QuestionId}")]
        public async Task<IActionResult> DetailedStatisticsQuestion(int QuestionId)
        {
            var question = await _applicationDbContext.QuestionBase
                .Include(q => q.QuestionStatistics)
                .FirstOrDefaultAsync(q => q.Id == QuestionId);

            if (question is null)
                return NotFound("Question not found");

            var time_all = question.QuestionStatistics
                .Where(s => s.TotalTime.HasValue)
                .GroupBy(s => s.TotalTime).Select(a => new { 
                    Value = a.Key,
                    Count = a.Count(),
                });

            var time_correct = question.QuestionStatistics
                .Where(s => s.TotalTime.HasValue && s.Correct)
                .GroupBy(s => s.TotalTime).Select(a => new {
                    Value = a.Key,
                    Count = a.Count()
                });

            var time_incorrect = question.QuestionStatistics
                .Where(s => s.TotalTime.HasValue && !s.Correct)
                .GroupBy(s => s.TotalTime).Select(a => new {
                    Value = a.Key,
                    Count = a.Count()
                });


            var top_players = question.QuestionStatistics
                .Where(s => s.TotalTime.HasValue)
                .GroupBy(s => s.Player).OrderByDescending(a => a.Count())
                .Take(5)
                .Select(a => new {
                    Player = a.Key,

                    StatisticsTotalTime = a.GroupBy(s => s.TotalTime).Select(sg => new {
                        Value = sg.Key,
                        Count = sg.Count()
                    }),

                    StatisticsCorrectTime = a.Where(s =>s.Correct).GroupBy(s => s.TotalTime).Select(sg => new {
                        Value = sg.Key,
                        Count = sg.Count()
                    }),

                    StatisticsIncorrectTime = a.Where(s => !s.Correct).GroupBy(s => s.TotalTime).Select(sg => new {
                        Value = sg.Key,
                        Count = sg.Count()
                    })
                });


            return Ok(new
            {
                time_all = time_all,
                time_all_avg = time_all.Sum(a => a.Value * a.Count)/ time_all.Sum(a => a.Count),

                time_correct = time_correct,
                time_correct_avg = time_correct.Sum(a => a.Value * a.Count) / time_correct.Sum(a => a.Count),

                time_incorrect = time_incorrect,
                time_incorrect_avg = time_incorrect.Sum(a => a.Value * a.Count) / time_incorrect.Sum(a => a.Count),

                top_players = top_players

            });
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetQuestionStatisticDetailed(int Id)
        {

            //Get Question
            var Data = await _applicationDbContext.QuestionBase
                .Include(q => q.QuestionStatistics)
                .Select(q => new
                {
                    Id = q.Id,

                    MedianPlayTime = q.QuestionStatistics.Where(s => s.TotalTime.HasValue).Any() ?
                    q.QuestionStatistics
                    .Where(s => s.TotalTime.HasValue)
                    .OrderBy(s => s.TotalTime)
                    .Skip(q.QuestionStatistics.Where(s => s.TotalTime.HasValue).Count() / 2)
                    .FirstOrDefault().TotalTime : '-',

                    AvgPlayTime = q.QuestionStatistics.Where(s => s.TotalTime.HasValue).Any() ?
                    q.QuestionStatistics.Where(s => s.TotalTime.HasValue).Sum(a => a.TotalTime)
                    / q.QuestionStatistics.Count(s => s.TotalTime.HasValue)
                    : '-',

                    MedianPlayTimeCorrect = q.QuestionStatistics.Where(s => s.TotalTime.HasValue && s.Correct).Any() ?
                    q.QuestionStatistics
                    .Where(s => s.TotalTime.HasValue && s.Correct)
                    .OrderBy(s => s.TotalTime)
                    .Skip(q.QuestionStatistics.Where(s => s.TotalTime.HasValue && s.Correct).Count() / 2)
                    .FirstOrDefault().TotalTime : '-',

                    AvgPlayTimeCorrect = q.QuestionStatistics.Where(s => s.TotalTime.HasValue && s.Correct).Any() ?
                    q.QuestionStatistics.Where(s => s.TotalTime.HasValue && s.Correct).Sum(a => a.TotalTime)
                    / q.QuestionStatistics.Count(s => s.TotalTime.HasValue && s.Correct)
                    : '-',

                    TimeSpectrum = q.QuestionStatistics.Where(s => s.TotalTime.HasValue)
                    .GroupBy(a => a.TotalTime).Select(r => new
                    {
                        Time = r.Key,
                        Count = r.Count()
                    }),

                    TimeSpectrumCorrect = q.QuestionStatistics.Where(s => s.TotalTime.HasValue && s.Correct)
                    .GroupBy(a => a.TotalTime)
                    .Select(r => new
                    {
                        Time = r.Key,
                        Count = r.Count()
                    }),

                    TotalPlay = q.QuestionStatistics.Count,
                    TotalPlaySuccess = q.QuestionStatistics.Count(a => a.Correct),


                })
                .FirstOrDefaultAsync(q => q.Id == Id);

            if (Data is null)
                return NotFound("Question Not Found");

            return Ok(Data);
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetSeriesStatisticDetailed(int Id)
        {

            //Get Question
            var Data = await _applicationDbContext.QuestionSeries
                .Include(q => q.Statistics)
                .Select(q => new
                {
                    Id = q.Id,

                    MedianPlayTime = q.Statistics.Any() ?
                    q.Statistics
                    .OrderBy(s => s.TotalTime)
                    .Skip(q.Statistics.Count() / 2)
                    .FirstOrDefault().TotalTime : '-',

                    AvgPlayTime = q.Statistics.Any() ?
                    q.Statistics.Sum(a => a.TotalTime)
                    / q.Statistics.Count
                    : '-',

                    MedianPlayTimeMobile = q.Statistics.Any(s => s.OnMobile) ?
                    q.Statistics
                    .Where(s => s.OnMobile)
                    .OrderBy(s => s.TotalTime)
                    .Skip(q.Statistics.Where(s => s.OnMobile).Count() / 2)
                    .FirstOrDefault().TotalTime : '-',

                    AvgPlayTimeMobile = q.Statistics.Any(s => s.OnMobile) ?
                    q.Statistics.Where(s => s.OnMobile).Sum(a => a.TotalTime)
                    / q.Statistics.Where(s => s.OnMobile).Count()
                    : '-',


                    TimeSpectrum = q.Statistics
                    .GroupBy(a => a.TotalTime).Select(r => new
                    {
                        Time = r.Key,
                        Count = r.Count(),
                    }),


                    TotalPlay = q.Statistics.Count,
                    TotalPlayMobile = q.Statistics.Count(s => s.OnMobile)
                })
                .FirstOrDefaultAsync(q => q.Id == Id);

            if (Data is null)
                return NotFound("Series Not Found");

            return Ok(Data);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetSpecificStudentReportTimeline([FromBody] StudentReportViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");


            var From = DateTime.ParseExact(VM.From, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            var To = DateTime.ParseExact(VM.To, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);

            //Get question stats

            var qStats = await _applicationDbContext.QuestionStatistic
                .Where(s => s.DateCreated >= From && s.DateCreated <= To && s.Player == VM.Code)
                .Select((s) => new
                {
                    Type = STUDENT_TIMELINE_REPORT_OBJECT_TYPE.Question,
                    QuestionId = s.QuestionId,
                    QuestionType = s.Question.Type,
                    QuestionCode = s.Question.Code,
                    ImageURL = s.Question.Base_ImageURL != null ? $"{MappingProfile.FILES_PATH}/{s.Question.Base_ImageURL}" : "",
                    DateCreated = s.DateCreated,
                    Correct = s.Correct,
                    TotalTime = s.TotalTime.HasValue ? s.TotalTime.Value : 0,
                    Score = s.Score,

                    SeriesId = 0,
                    SeriesCode = "",
                    Map = "",
                    MapElement = "",
                    MapKey = s.Key,
                    MapId = 0,

                    Link =  "",
                })
                .ToListAsync();

            var qPDFStats = await _applicationDbContext.QuestionPDFStatistic
                .Where(s => s.DateCreated >= From && s.DateCreated <= To && s.Player == VM.Code)
                .Select((s) => new
                {
                    Type = STUDENT_TIMELINE_REPORT_OBJECT_TYPE.QuestionPDFClick,
                    QuestionId = s.QuestionId,
                    QuestionType = s.Question.Type,
                    QuestionCode = s.Question.Code,
                    ImageURL = s.Question.Base_ImageURL != null ? $"{MappingProfile.FILES_PATH}/{s.Question.Base_ImageURL}" : "",
                    DateCreated = s.DateCreated,
                    Correct = s.Correct,
                    TotalTime =  0,
                    Score = "",

                    SeriesId = 0,
                    SeriesCode = "",
                    Map = "",
                    MapElement = "",
                    MapKey = "",
                    MapId = 0,

                    Link = s.Question.PDFURL != null ? $"{MappingProfile.FILES_PATH}/{s.Question.PDFURL}" : "",
                })
                .ToListAsync();

            var sStats = await _applicationDbContext.QuestionSeriesStatistic
                .Where(s => s.DateCreated >= From && s.DateCreated <= To && s.Player == VM.Code)
                .Select((s) => new
                {
                    Type = STUDENT_TIMELINE_REPORT_OBJECT_TYPE.Series,
                    QuestionId = 0,
                    QuestionType = 0,
                    QuestionCode = "",
                    ImageURL = "",
                    DateCreated = s.DateCreated,
                    Correct = true,
                    TotalTime = s.TotalTime,
                    Score = s.SuccessRate,

                    SeriesId = s.SeriesId,
                    SeriesCode = s.Series.Code,
                    Map = s.MapName,
                    MapElement = s.MapElementName,
                    MapKey = s.MapKey,
                    MapId = 0,

                    Link = "",
                })
                .ToListAsync();

            var mapPDFStats = await _applicationDbContext.CourseMapPDFStatistics
                .Where(s => s.DateCreated >= From && s.DateCreated <= To && s.Player == VM.Code)
                .Select((s) => new
                {
                    Type = STUDENT_TIMELINE_REPORT_OBJECT_TYPE.MapPDFClick,
                    QuestionId = 0,
                    QuestionType = 0,
                    QuestionCode = "",
                    ImageURL = "",
                    DateCreated = s.DateCreated,
                    Correct = true,
                    TotalTime = 0,
                    Score = "",

                    SeriesId = 0,
                    SeriesCode = "",
                    Map = s.Element.Map.Title,
                    MapElement = s.Element.Title,
                    MapKey = "",
                    MapId = s.Element.Map.Id,

                    Link = s.Element.PDFURL != null ? $"{MappingProfile.FILES_PATH}/{s.Element.PDFURL}" : "",
                })
                .ToListAsync();

            var mapLinkStats = await _applicationDbContext.CourseMapLinkStatistics
                .Where(s => s.DateCreated >= From && s.DateCreated <= To && s.Player == VM.Code)
                .Select((s) => new
                {
                    Type = STUDENT_TIMELINE_REPORT_OBJECT_TYPE.MapLinkClick,
                    QuestionId = 0,
                    QuestionType = 0,
                    QuestionCode = "",
                    ImageURL = "",
                    DateCreated = s.DateCreated,
                    Correct = true,
                    TotalTime = 0,
                    Score = "",

                    SeriesId = 0,
                    SeriesCode = "",
                    Map = s.Element.Map.Title,
                    MapElement = s.Element.Title,
                    MapKey = "",
                    MapId = s.Element.Map.Id,

                    Link = s.Element.ExternalVideoLink,
                })
                .ToListAsync();

            qStats.AddRange(qPDFStats);
            qStats.AddRange(sStats);
            qStats.AddRange(mapPDFStats);
            qStats.AddRange(mapLinkStats);

            return Ok(qStats.OrderBy(a => a.DateCreated));
        }

        public enum STUDENT_TIMELINE_REPORT_OBJECT_TYPE
        {
            Question = 0,
            Series = 2,
            MapPDFClick = 4,
            QuestionPDFClick = 8,
            MapLinkClick = 16,

        }


    }
}
