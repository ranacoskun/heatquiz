using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;
using QuizAPI.Models.Questions;
using QuizAPI.Models.Topic.ViewModels;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;



namespace QuizAPI.Controllers.DataPoolsController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class DataPoolsController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;

        public DataPoolsController(
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

        [Authorize]
        [HttpGet("[action]")]
        public async Task<IActionResult> GetDataPoolsAdmin()
        {
            var DPs = await _applicationDbContext.DataPools
                .OrderBy(dp => dp.NickName)
                .Include(dp => dp.PoolAccesses)
                .ThenInclude(dpa => dpa.User)
                .ToListAsync();

            return Ok(_mapper.Map<List<DataPoolViewModel>>(DPs));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditDataPoolAccess([FromBody] UpdateDataPoolAccessViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var DP = await _applicationDbContext.DataPools
                .Include(dp => dp.PoolAccesses)
                .FirstOrDefaultAsync(dp => dp.Id == VM.UpdateDataPoolId);

            if (DP is null)
                return NotFound("Datapool not found");

            var Users = await _applicationDbContext.Users
                .Where(u => VM.UsersWithAccess.Any(ua => ua == u.Name))
                .ToListAsync();

            if (Users.Count != VM.UsersWithAccess.Distinct().Count())
                return BadRequest("Users not found or users repeated");

            DP.PoolAccesses.Clear();

            DP.PoolAccesses.AddRange(Users.Select(u => new DataPoolAccess()
            {
                DataPoolId = DP.Id,
                UserId = u.Id,
            }));

            if (Users.Any(u => u.UserName.ToLower() == "admin"))
            {
                var adminUser = await _applicationDbContext.Users
                    .FirstOrDefaultAsync(u => u.UserName.ToLower() == "admin");

                DP.PoolAccesses.Add( new DataPoolAccess()
                {
                    DataPoolId = DP.Id,
                    UserId = adminUser.Id,
                });
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpGet("[action]")]
        public async Task<IActionResult> GetDataPools()
        {
            var DPs = await _applicationDbContext.DataPools
                .Where(dp => !dp.IsHidden.Value)
                .OrderBy(dp => dp.NickName)
                .ToListAsync();

            return Ok(DPs.Select(d => new {
                Id = d.Id,
                Name = d.Name,
                NickName=d.NickName,
                IsDefault = d.IsDefault
            }));
        }

        [HttpGet("[action]/{Player}/{DataPoolId}")]
        public async Task<IActionResult> GetDataPoolTopics(string Player, int DataPoolId)
        {
            var DPs = await _applicationDbContext.DataPools
                .Where(dp => !dp.IsHidden.Value)
                .ToListAsync();

            var Topics = await _applicationDbContext.Topics
                .Include(t => t.Subtopics)
                .Where(t => t.Subtopics.Any(st => st.Questions.Any(q => q.QuestionStatistics.Any(qs => qs.Player == Player))))
                .ToListAsync();

            var Topics_VM = _mapper.Map<List<TopicViewModel>>(Topics);

            return Ok(DPs
                .Select(d => new { 
                Id = d.Id,
                Name = d.Name,
                NickName = d.NickName,
                Topics = Topics_VM.Where(t => t.DataPoolId == d.Id).OrderBy(t => t.Name)
            }).Where(a=> a.Topics.Count() != 0).OrderBy(dp => dp.NickName));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AdvancedDataPoolStatistics([FromBody] AdvancedDataPoolStatisticsViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            DateTime From = DateTime.Now;
            DateTime To = DateTime.Now;

            if(!string.IsNullOrEmpty(VM.From) && !string.IsNullOrEmpty(VM.To))
            {
                From = DateTime.ParseExact(VM.From, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                To = DateTime.ParseExact(VM.To, "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            }


            var statistics = await _applicationDbContext.QuestionStatistic
                .Include(s => s.Question)
                .ThenInclude(q => q.Subtopic)
                .ThenInclude(s => s.Topic)
                .Where(s => s.Player == VM.Player
                            && s.DataPoolId == VM.query_dp_Id
                            && VM.TopicIds.Any(t => s.Question.Subtopic.Topic.Id == t)
                            &&(
                            (!string.IsNullOrEmpty(VM.From) && !string.IsNullOrEmpty(VM.To)) ? 
                            (s.DateCreated >= From && s.DateCreated<= To): true))
                .ToListAsync();

            var questionIdsAll = statistics
                .GroupBy(a => a.QuestionId)
                .Select(a => a.Key)

               .ToList();

            var questionIdsNeverCorrect = statistics
                .GroupBy(a => a.QuestionId)
                .Where((g) => !g.Any(s => s.Correct))
                .Select(a => new {
                    Id = a.Key,
                    Incorrect = a.Count(s => !s.Correct)
                })
                .OrderByDescending(r => r.Incorrect)
                
               .ToList();

            var questionNeverCorrect = await _applicationDbContext.QuestionBase
                .Where(q => questionIdsNeverCorrect.Take(10).Any(Id => Id.Id == q.Id))
                
                .ToDictionaryAsync(r => r.Id);

            foreach(var qk in questionNeverCorrect)
            {
                qk.Value.Base_ImageURL = qk.Value.Base_ImageURL != null ? $"{Mapping.MappingProfile.FILES_PATH}/{qk.Value.Base_ImageURL}" : "";
            }

            var LastMonthDate = DateTime.Now.AddDays(-30);

            var RWeek = await _applicationDbContext.QuestionStatistic
                .Where(s => s.DateCreated.Value >= LastMonthDate
                            && s.DataPoolId == VM.query_dp_Id
                            && VM.TopicIds.Any(t => s.Question.Subtopic.Topic.Id == t))
                .GroupBy(s => s.DateCreated.Value.Day)
                .OrderBy(g => g.FirstOrDefault().DateCreated)
                .ToListAsync();

            var avg_all_7_days = RWeek.Select(g => {
                var player_games = g.GroupBy(a => a.Player);

                var avg = 0;

                try
                {
                    avg = g.Count() / player_games.Count();
                }
                catch
                {

                }

                return new {
                date = g.FirstOrDefault().DateCreated.Value.ToString("dd.MM"),
                avg = avg
                };
            }).ToArray();

            var avg_10p_above_7_days = RWeek.Select(g => {
                var player_games = g.GroupBy(a => a.Player);

                var value_above_10_precentile = 0.9 * player_games.Select(a => a.Count()).Max();

                var filtered_players = player_games.Where(gg => gg.Count() > value_above_10_precentile);

                var avg = 0;

                try
                {
                    avg = filtered_players.Select(a => a.Count()).Sum() / filtered_players.Count();
                }
                catch
                {

                }

                return new
                {
                    date = g.FirstOrDefault().DateCreated.Value.ToString("dd.MM"),
                    avg = avg
                };
            }).ToArray();

            var avg_10p_below_7_days = RWeek.Select(g => {
                var player_games = g.GroupBy(a => a.Player);

                var value_below_10_precentile = 0.1 * player_games.Select(a => a.Count()).Max();

                var filtered_players = player_games.Where(gg => gg.Count() < value_below_10_precentile);

                var avg = 0;
                try
                {
                    avg = filtered_players.Select(a => a.Count()).Sum() / filtered_players.Count();
                }
                catch
                {

                }

                return new
                {
                    date = g.FirstOrDefault().DateCreated.Value.ToString("dd.MM"),
                    avg = avg
                };
            }).ToArray();

            var avg_you_7_days = RWeek.Select(g => {
                var avg = 0;
                try
                {
                    avg = g.Where(a => a.Player == VM.Player).Count();
                }
                catch
                {

                }

                return new
                {
                    date = g.FirstOrDefault().DateCreated.Value.ToString("dd.MM"),
                    avg = avg
                };
            }).ToArray();


            
            return Ok(new {
                TotalTimePlayed = statistics
                .Where(s => s.DateCreated> LastMonthDate)
                .Sum(s => s.TotalTime),

                StatisticsByTopic = statistics.GroupBy(s => s.Question.Subtopic.Topic).Select(gs => new {
                    Topic = gs.Key.Name,
                    TopicId = gs.Key.Id,

                    TotalPlay = gs.Count(),

                    TotalPlayCorrect = gs.Count(a => a.Correct)
                }).ToDictionary(b => b.TopicId),

                TotalStatistics = statistics.Count,
                Correct = statistics.Count(s => s.Correct),

                avg_all_7_days = avg_all_7_days,
                avg_you_7_days = avg_you_7_days,
                avg_10p_below_7_days = avg_10p_below_7_days,
                avg_10p_above_7_days = avg_10p_above_7_days,

                questionIdsAll = questionIdsAll,
                questionIdsNeverCorrect = questionIdsNeverCorrect,
                questionNeverCorrect = questionNeverCorrect
            });
        }

        [Authorize("admin")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddDataPool([FromBody] DataPoolViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var NameExists = await _applicationDbContext.DataPools
                .AnyAsync(dp => dp.Name.ToUpper() ==VM.Name.ToUpper());

            if(NameExists)
                return BadRequest("Name Already Exists");


            var NNameExists = await _applicationDbContext.DataPools
               .AnyAsync(dp => dp.NickName.ToUpper() == VM.NickName.ToUpper() );

            if (NNameExists)
                return BadRequest("Nick Name Already Exists");

            _applicationDbContext.DataPools.Add(new DataPool()
            {
                Name = VM.Name,
                NickName = VM.NickName,
                IsDefault = false,
                IsHidden = false
            });

            await _applicationDbContext.SaveChangesAsync();
            return Ok();
        }

        [Authorize("admin")]
        [HttpPost("[action]")]
        public async Task<IActionResult> EditDataPool([FromBody] DataPoolViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var DP = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(dp => dp.Id == VM.Id);

            if (DP is null)
                return NotFound("Not Found");

            var NameExists = await _applicationDbContext.DataPools
                .AnyAsync(dp => dp.Name.ToUpper() == VM.Name.ToUpper() && dp.Id != VM.Id);

            if (NameExists)
                return BadRequest("Name Already Exists");

            var NNameExists = await _applicationDbContext.DataPools
               .AnyAsync(dp => dp.NickName.ToUpper() == VM.NickName.ToUpper() && dp.Id != VM.Id);

            if (NNameExists)
                return BadRequest("Nick Name Already Exists");

            DP.Name = VM.Name;
            DP.NickName = VM.NickName;
            DP.IsHidden = VM.IsHidden;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize("admin")]
        [HttpPost("[action]")]
        public async Task<IActionResult> HideUnhideDataPool([FromBody] DataPoolViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var DP = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(dp => dp.Id == VM.Id);

            if (DP is null)
                return NotFound("Not Found");

            DP.IsHidden = VM.IsHidden;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> GetDatapoolNotificationSubscriptions(int DatapoolId)
        {
            var datapool = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(a => a.Id == DatapoolId);

            if (datapool is null)
                return NotFound("Datapool not found");

            var subscriptions = await _applicationDbContext.DatapoolNotificationSubscriptions
                .Include(a => a.Datapool)
                .Include(a => a.User)
                .Where(a => a.DatapoolId == DatapoolId)
                .ToListAsync();

            return Ok(_mapper.Map<List<DatapoolNotificationSubscriptionViewModel>>(subscriptions));
        }

        [Authorize]
        [HttpGet("[action]")]
        public async Task<IActionResult> GetUserNotificationSubscriptions()
        {
            var user = await GetUser(_httpContextAccessor, _applicationDbContext);

            if (user is null)
            {
                return BadRequest("User not found");
            }

            var subscriptions = await _applicationDbContext.DatapoolNotificationSubscriptions
                .Include(a => a.Datapool)
                .Include(a => a.User)
                .Where(a => a.UserId == user.Id)
                .ToListAsync();

            return Ok(_mapper.Map<List<DatapoolNotificationSubscriptionViewModel>>(subscriptions));
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> SubscribeNotifications(int DatapoolId)
        {
            var datapool = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(a => a.Id == DatapoolId);

            if (datapool is null)
                return NotFound("Datapool not found");

            var user = await GetUser(_httpContextAccessor, _applicationDbContext);

            if(user is null)
            {
                return BadRequest("User not found");
            }

            var subscription = await _applicationDbContext.DatapoolNotificationSubscriptions
                .FirstOrDefaultAsync(a => a.DatapoolId == datapool.Id && a.UserId == user.Id);

            if (subscription != null)
            {
                return BadRequest("Already subscribed");
            }

            var newSubscription = new DatapoolNotificationSubscription()
            {
                DatapoolId = datapool.Id,
                UserId = user.Id,
                LastSeen = DateTime.Now
            };

            _applicationDbContext.DatapoolNotificationSubscriptions.Add(newSubscription);

            await _applicationDbContext.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> UnsubscribeNotifications(int DatapoolId)
        {
            var datapool = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(a => a.Id == DatapoolId);

            if (datapool is null)
                return NotFound("Datapool not found");

            var user = await GetUser(_httpContextAccessor, _applicationDbContext);

            if (user is null)
            {
                return BadRequest("User not found");
            }

            var subscription = await _applicationDbContext.DatapoolNotificationSubscriptions
                .FirstOrDefaultAsync(a => a.DatapoolId == datapool.Id && a.UserId == user.Id);

            if (subscription is null)
            {
                return BadRequest("Not subscribed");
            }

            
            _applicationDbContext.DatapoolNotificationSubscriptions.Remove(subscription);

            await _applicationDbContext.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpGet("[action]")]
        public async Task<IActionResult> RegisterSeenNotifications()
        {
            var user = await GetUser(_httpContextAccessor, _applicationDbContext);

            if (user is null)
                return BadRequest("User not found");

            //Update last seen in notifications subscribers
            var notificationSubscribtions = await _applicationDbContext.DatapoolNotificationSubscriptions
                .Where(a => a.UserId == user.Id)
                .ToListAsync();

            foreach(var ns in notificationSubscribtions)
            {
                ns.LastSeen = DateTime.Now;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }



    }
}
