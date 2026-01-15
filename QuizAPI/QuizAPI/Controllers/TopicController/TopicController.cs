using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.Ownership;
using QuizAPI.Models.Topic;
using QuizAPI.Models.Topic.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class TopicController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;

        public TopicController(
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

        [HttpGet("[action]/{DataPoolId}")]
        public async Task<IActionResult> GetAllTopics(int DataPoolId)
        {
            var Topics = await _applicationDbContext.Topics
                .Include(t => t.Subtopics)
                .Include(t => t.Owners)
                .ThenInclude(o => o.Owner)
                .Include(t => t.Subtopics)
                .ThenInclude(t => t.Questions)
                .OrderBy(t => t.Name)
                .Where(t => t.DataPoolId == DataPoolId)
                .ToListAsync();

            return Ok(_mapper.Map<List<Topic>, List<TopicViewModel>>(Topics));
        }

        [HttpGet("[action]/{DataPoolId}")]
        public async Task<IActionResult> GetMyTopics(int DataPoolId)
        {
            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var Topics = await _applicationDbContext.Topics
                .Include(t => t.Subtopics)
                .Include(t => t.Owners)
                .ThenInclude(o => o.Owner)
                .Include(t => t.Subtopics)
                .ThenInclude(t => t.Questions)
                .OrderBy(t => t.Name)
                .Where(t => t.Owners.Any(o => o.OwnerId == Owner.Id) && t.DataPoolId == DataPoolId)
                .ToListAsync();

            return Ok(_mapper.Map<List<Topic>, List<TopicViewModel>>(Topics));
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetTopicQuestions(int Id)
        {
            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var st = await _applicationDbContext.Subtopics
                .Include(t => t.Questions)
                .ThenInclude(q => q.AddedBy)
                .FirstOrDefaultAsync(t => t.Id == Id);

            return Ok(_mapper.Map<Subtopic, SubtopicViewModel>(st));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddTopic([FromBody] TopicViewModel TopicVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Name Not Null
            if (string.IsNullOrEmpty(TopicVM.Name))
                return BadRequest("Name Can't Be Empty");

            var DATA_POOL = await _applicationDbContext.DataPools
                .FirstOrDefaultAsync(dp => dp.Id == TopicVM.DataPoolId);

            if (DATA_POOL is null)
                return BadRequest("DATA_POOL not found");

            //Check Name Not Taken 
            var NameTaken = await _applicationDbContext.Topics
                .AnyAsync(c => c.Name == TopicVM.Name && c.DataPoolId == DATA_POOL.Id);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            

            //Create Topic
            var topic = new Topic()
            {
                Name = TopicVM.Name,
                Active = TopicVM.Active,
                AddedBy = Owner,
                DataPoolId = DATA_POOL.Id

            };

            if (TopicVM.Subtopics.Any())
            {
                topic.Subtopics.AddRange(TopicVM.Subtopics
                    .Where(st => !string.IsNullOrEmpty(st.Name))
                    .Distinct()
                    .Select(dst => new Subtopic()
                {
                    Name = dst.Name,
                    Active = TopicVM.Active

               }));
            }

            topic.Owners.Add(new TopicOwner()
            {
                Owner = Owner
            });

            _applicationDbContext.Topics.Add(topic);
            await _applicationDbContext.SaveChangesAsync();

            var Topics = await _applicationDbContext.Topics
                .Include(t => t.Subtopics)
                .ToListAsync();

            return Ok(_mapper.Map<List<Topic>, List<TopicViewModel>>(Topics));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditTopic([FromBody] TopicViewModel TopicVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Topic = await _applicationDbContext.Topics
                .Include(t => t.Owners)
                .FirstOrDefaultAsync(st => st.Id == TopicVM.Id);

            if (Topic is null)
                return NotFound("Subtopic Not Found");

            //Check Name Not Null
            if (string.IsNullOrEmpty(TopicVM.Name))
                return BadRequest("Name Can't Be Empty");

            //Check Name Unique in Topic
            var NameTaken = await _applicationDbContext.Topics
                .AnyAsync(t => t.Name == TopicVM.Name && t.Id != TopicVM.Id && t.DataPoolId == Topic.DataPoolId);

            if (NameTaken)
                return BadRequest("Name Is Taken Already");

            var User = await GetUser(_httpContextAccessor, _applicationDbContext);


            if (!Topic.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner");

            Topic.Name = TopicVM.Name;

            await _applicationDbContext.SaveChangesAsync();

            var Topics = await _applicationDbContext.Topics
               .Include(t => t.Subtopics)
               .ToListAsync();

            return Ok(_mapper.Map<List<Topic>, List<TopicViewModel>>(Topics));
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> DeactiveTopic([FromBody] TopicViewModel TopicVM)
        {
            var Topic = await _applicationDbContext.Topics
                .FirstOrDefaultAsync(st => st.Id == TopicVM.Id);

            if (Topic is null)
                return NotFound("Subtopic Not Found");

            Topic.Active = TopicVM.Active;

            await _applicationDbContext.SaveChangesAsync();

            var Topics = await _applicationDbContext.Topics
                .Include(t => t.Subtopics)
                .ToListAsync();

            return Ok(_mapper.Map<List<Topic>, List<TopicViewModel>>(Topics));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteTopic([FromBody] TopicViewModel TVM)
        {
            var Topic = await _applicationDbContext.Topics
                .Include(t => t.Subtopics)
                .ThenInclude(s => s.Questions)
                .FirstOrDefaultAsync(st => st.Id == TVM.Id);

            if (Topic is null)
                return NotFound("Subtopic Not Found");

            if(Topic.Subtopics.Any(s => s.Questions.Count != 0))
                return BadRequest("Topic Has At Least One Subtopic With Questions");

            _applicationDbContext.Topics.Remove(Topic);

            await _applicationDbContext.SaveChangesAsync();

            var Topics = await _applicationDbContext.Topics
               .Include(t => t.Subtopics)
               .ToListAsync();

            return Ok(_mapper.Map<List<Topic>, List<TopicViewModel>>(Topics));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddSubtopic([FromBody] SubtopicViewModel SubtopicVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Name Not Null
            if (string.IsNullOrEmpty(SubtopicVM.Name))
                return BadRequest("Name Can't Be Empty");

            var Topic = await _applicationDbContext.Topics
                .Include(t => t.Subtopics)
                .Include(t => t.Owners)
                .FirstOrDefaultAsync(t => t.Id == SubtopicVM.TopicId);

            if (Topic is null)
                return NotFound("Topic Not Found");

            //Check Name Unique in Topic 
            if(Topic.Subtopics.Any(st => st.Name == SubtopicVM.Name))
                return BadRequest("Name Is Taken Already");

            var User = await GetUser(_httpContextAccessor, _applicationDbContext);


            /*if (!Topic.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner");*/

            var Subtopic = new Subtopic()
            {
                Name = SubtopicVM.Name,
                Active = SubtopicVM.Active,
                Topic = Topic
            };

            _applicationDbContext.Subtopics.Add(Subtopic);
            await _applicationDbContext.SaveChangesAsync();

            var Topics = await _applicationDbContext.Topics
                           .Include(t => t.Subtopics)
                           .ToListAsync();

            return Ok(_mapper.Map<List<Topic>, List<TopicViewModel>>(Topics));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditSubtopic([FromBody] SubtopicViewModel SubtopicVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Subtopic = await _applicationDbContext.Subtopics
                .Include(st => st.Topic)
                .ThenInclude(t => t.Subtopics)
                .Include(st => st.Topic)
                .ThenInclude(st => st.Owners)
                .FirstOrDefaultAsync(st => st.Id == SubtopicVM.Id);

            if (Subtopic is null)
                return NotFound("Subtopic Not Found");

            //Check Name Not Null
            if (string.IsNullOrEmpty(SubtopicVM.Name))
                return BadRequest("Name Can't Be Empty");

            //Check Name Unique in Topic 
            if (Subtopic.Topic.Subtopics.All(st => st.Name == SubtopicVM.Name))
                return BadRequest("Name Is Taken Already");

            var User = await GetUser(_httpContextAccessor, _applicationDbContext);


            if (!Subtopic.Topic.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner");

            Subtopic.Name = SubtopicVM.Name;

            await _applicationDbContext.SaveChangesAsync();

            var Topics = await _applicationDbContext.Topics
                           .Include(t => t.Subtopics)
                           .ToListAsync();

            return Ok(_mapper.Map<List<Topic>, List<TopicViewModel>>(Topics));
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> DeactiveSubtopic([FromBody] SubtopicViewModel SubtopicVM)
        {
            var Subtopic = await _applicationDbContext.Subtopics
                .FirstOrDefaultAsync(st => st.Id == SubtopicVM.Id);

            if (Subtopic is null)
                return NotFound("Subtopic Not Found");

            Subtopic.Active = SubtopicVM.Active;

            await _applicationDbContext.SaveChangesAsync();

            var Topics = await _applicationDbContext.Topics
                           .Include(t => t.Subtopics)
                           .ToListAsync();

            return Ok(_mapper.Map<List<Topic>, List<TopicViewModel>>(Topics));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteSubtopic([FromBody] SubtopicViewModel SVM)
        {
            var Subtopic = await _applicationDbContext.Subtopics
                .Include(s => s.Questions)
                .FirstOrDefaultAsync(st => st.Id == SVM.Id);

            if (Subtopic is null)
                return NotFound("Subtopic Not Found");

            if(Subtopic.Questions.Count != 0)
                return BadRequest("Subtopic Has Questions");

            _applicationDbContext.Subtopics.Remove(Subtopic);

            await _applicationDbContext.SaveChangesAsync();

            var Topics = await _applicationDbContext.Topics
                           .Include(t => t.Subtopics)
                           .ToListAsync();

            return Ok(_mapper.Map<List<Topic>, List<TopicViewModel>>(Topics));
        }
    }
}
