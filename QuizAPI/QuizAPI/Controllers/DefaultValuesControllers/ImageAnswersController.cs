using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.DefaultValues.ImageAnswers;
using QuizAPI.Models.DefaultValues.ImageAnswers.ViewModels;
using QuizAPI.Models.Ownership.ClickTrees;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.DefaultValuesControllers
{

    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class ImageAnswersController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;

        public ImageAnswersController(
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
        public async Task<IActionResult> GetImageAnswerGroups(int DataPoolId)
        {
            var DPExists = await _applicationDbContext.DataPools
                .AnyAsync(d => d.Id == DataPoolId);

            if (!DPExists)
                return NotFound("Datapool does not exist");

            var Groups = await _applicationDbContext.ImageAnswerGroups
                .Include(g => g.AddedBy)
                .Include(g => g.Owners)
                .ThenInclude(o => o.Owner)
                .OrderBy(g => g.Name)
                .Where(g => g.DataPoolId == DataPoolId)
                .ToListAsync();

            var IAs = await _applicationDbContext.ImageAnswers
                .Where(ia => Groups.Any(g => g.Id == ia.GroupId) && !ia.RootId.HasValue)
                .Include(ia => ia.Leafs)
                .ThenInclude(l => l.ClickImages)
                .Include(ia => ia.ClickImages)
                .Where(g => g.DataPoolId == DataPoolId)

                .ToListAsync();

            foreach (var g in Groups)
            {
                g.Images = IAs
                    .Where(ia => ia.GroupId == g.Id)
                    .ToList();
            }

            return Ok(_mapper.Map<List<ImageAnswerGroup>, List<ImageAnswerGroupViewModel>>(Groups));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetImageAnswerGroups()
        {
            var Groups = await _applicationDbContext.ImageAnswerGroups
                .Include(g => g.AddedBy)
                .Include(g => g.Owners)
                .ThenInclude(o => o.Owner)
                .OrderBy(g => g.Name)
                .ToListAsync();

            var IAs = await _applicationDbContext.ImageAnswers
                .Where(ia => Groups.Any(g => g.Id == ia.GroupId) && !ia.RootId.HasValue)
                .Include(ia => ia.Leafs)
                .ThenInclude(l => l.ClickImages)
                .Include(ia => ia.ClickImages)
                .ToListAsync();

            foreach(var g in Groups)
            {
                g.Images = IAs
                    .Where(ia => ia.GroupId == g.Id)
                    .ToList();
            }

            return Ok(_mapper.Map<List<ImageAnswerGroup>, List<ImageAnswerGroupViewModel>>(Groups));
        }

        [HttpGet("[action]/{DataPoolId}")]
        public async Task<IActionResult> GetMyImageAnswerGroups(int DataPoolId)
        {
            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var Groups = await _applicationDbContext.ImageAnswerGroups
                .Include(g => g.AddedBy)
                .Include(g => g.Owners)
                .ThenInclude(o => o.Owner)
                .Where(g => g.Owners.Any(o => o.OwnerId == Owner.Id) && g.DataPoolId == DataPoolId)
                .OrderBy(g => g.Name)
                .ToListAsync();

            var IAs = await _applicationDbContext.ImageAnswers
                .Where(ia => Groups.Any(g => g.Id == ia.GroupId) && !ia.RootId.HasValue)
                .Include(ia => ia.Leafs)
                .ThenInclude(l => l.ClickImages)
                .Include(ia => ia.ClickImages)
                .ToListAsync();

            foreach (var g in Groups)
            {
                g.Images = IAs
                    .Where(ia => ia.GroupId == g.Id)
                    .ToList();
            }

            return Ok(_mapper.Map<List<ImageAnswerGroup>, List<ImageAnswerGroupViewModel>>(Groups));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetImageAnswerGroups_PORTAL_SIMPLE()
        {
            var Groups = await _applicationDbContext.ImageAnswerGroups
                .Include(g => g.Owners)
                .ThenInclude(o => o.Owner)
                .ToListAsync();


            return Ok(_mapper.Map<List<ImageAnswerGroup>, List<ImageAnswerGroupViewModel>>(Groups));
        }

        [HttpGet("[action]/{GroupId}")]
        public async Task<IActionResult> GetImageAnswerGroup(int GroupId)
        {
            var Group = await _applicationDbContext.ImageAnswerGroups
                .FirstOrDefaultAsync(g => g.Id == GroupId);

            //Get All Images With Thier Leafs -- NOT TREE
            var Images = await _applicationDbContext.ImageAnswers
                .Where(i => i.GroupId == GroupId)
                .Include(i => i.Leafs)
                .ToListAsync();

            //Get Roots Including Leafs That Include Thier Leafs ...... -- TREE
            Images = Images
                .Where(i => !i.RootId.HasValue)
                .ToList();

            return Ok(new
            {
                Id = Group.Id,
                Name = Group.Name,
                Choices = _mapper.Map<List<ImageAnswer>, List<ImageAnswerViewModel>>(Images)
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddGroup([FromBody] ImageAnswerGroupViewModel GroupVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Name Not Null
            if (string.IsNullOrEmpty(GroupVM.Name))
                return BadRequest("Name Can't Be Null");

            //Check Name Not Taken
            var NameTaken = await _applicationDbContext.ImageAnswerGroups
                .AnyAsync(g => g.Name == GroupVM.Name);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == GroupVM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var Owner =  await GetUser(_httpContextAccessor, _applicationDbContext);

            //Create Group
            var Group = new ImageAnswerGroup()
            {
                Name = GroupVM.Name,
                AddedBy = Owner,
                DataPoolId = DATA_POOL.Id
            };


            Group.Owners.Add(new ClickTreeOwner()
            {
                Owner = Owner,
                DataPoolId = DATA_POOL.Id
            });

            _applicationDbContext.ImageAnswerGroups.Add(Group);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<ImageAnswerGroup, ImageAnswerGroupViewModel>(Group));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditGroup([FromBody] ImageAnswerGroupViewModel GroupVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

           

            //Check Group Exists
            var Group = await _applicationDbContext.ImageAnswerGroups
                .Include(g => g.Owners)
                .FirstOrDefaultAsync(g => g.Id == GroupVM.Id);

            if (Group is null)
                return NotFound($"Group {GroupVM.Id} Not Found");

            //Check Name Not Null
            if (string.IsNullOrEmpty(GroupVM.Name))
                return BadRequest("Name Can't Be Null");

            //Check Name Not Taken
            var NameTaken = await _applicationDbContext.ImageAnswerGroups
                .AnyAsync(g => g.Id != GroupVM.Id && g.Name == GroupVM.Name);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            //Check Ownership
            var User = await GetUser(_httpContextAccessor, _applicationDbContext);


            if (!Group.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner Of Object");

            //Create Group
            Group.Name = GroupVM.Name;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<ImageAnswerGroup, ImageAnswerGroupViewModel>(Group));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddAnswerImageOneStep(string Name, int GroupId, int? RootId, IFormFile Picture)
        {
            Console.WriteLine(Name);
            Console.WriteLine(GroupId);

            //Check Name Is Not Null
            if (string.IsNullOrEmpty(Name))
                return BadRequest("Please Provide Name");
            
            //Check Group Exists
            var Group = await _applicationDbContext.ImageAnswerGroups
                .Include(g => g.Images)
                .Include(g => g.Owners)
                .FirstOrDefaultAsync(g => g.Id == GroupId);

            if (Group is null)
                return NotFound($"Group {GroupId} Not Found");

            if (Group.Images.Any(i => i.Name == Name))
                return BadRequest("Name Already Used Within the Group");

            //Check Ownership
            var User = await GetUser(_httpContextAccessor, _applicationDbContext);

            if (!Group.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner Of Object");

            //Create Answer
            var Answer = new ImageAnswer()
            {
                Name = Name,
                Choosable = false,
                GroupId = Group.Id,
                DataPoolId = Group.DataPoolId
             };

            if (RootId.HasValue)
            {
                //Check Root 
                var Root = await _applicationDbContext.ImageAnswers
                    .Include(r => r.Leafs)
                    .FirstOrDefaultAsync(r => r.Id == RootId);

                if (Root is null)
                    return NotFound($"Root {RootId.Value} Not Found");

                //Check Root Exists in Group
                if (Root.GroupId != Group.Id)
                    return BadRequest($"Root {RootId.Value} Does Not Belong To Group {Group.Name}");

                if (Root.Leafs.Any(l => l.Name == Name))
                    return BadRequest("Name Already Used Within the Node");

                Answer.RootId = Root.Id;
            }

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
                "wwwroot/ImageAnswers",
                $"Group_{Answer.GroupId.ToString()}");

            var URL = await SaveFile(path, Picture);

            Answer.URL = URL;
            Answer.Size = Picture.Length;

            _applicationDbContext.ImageAnswers.Add(Answer);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<ImageAnswer, ImageAnswerViewModel>(Answer));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditAnswerImageOneStep(int AnswerId, string Name, IFormFile Picture, bool SameImage)
        {
            //Check Answer Exists
            var Answer = await _applicationDbContext.ImageAnswers
                .Include(aa => aa.Group)
                .ThenInclude(g => g.Images)
                .ThenInclude(i => i.Leafs)
                .Include(aa => aa.Group)
                .ThenInclude(g => g.Owners)
                .FirstOrDefaultAsync(a => a.Id == AnswerId);

            if (Answer is null)
                return NotFound("Image Not Found");

            //Check Name Is Not Null
            if (string.IsNullOrEmpty(Name))
                return BadRequest("Please Provide Name");

            //Check Picture Is Not Null
            if (!SameImage && Picture is null)
                return BadRequest("Please Provide Picture");


            var Group = Answer.Group;

            if (Group.Images.Any(i => i.Name == Name && i.Id != AnswerId))
                return BadRequest("Name Already Used Within the Group");

            //Check Ownership
            var User = await GetUser(_httpContextAccessor, _applicationDbContext);

            if (!Group.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner Of Object");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => !SameImage && Picture.FileName.EndsWith(ve));

            if (!SameImage && !fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            if (!SameImage)
            {
                //Generate a Path for The Picture
                var path = Path.Combine(
                    "wwwroot/ImageAnswers",
                    $"Group_{Answer.GroupId.ToString()}");

                var URL = await SaveFile(path, Picture);
                Answer.URL = URL;
                Answer.Size = Picture.Length;
            }
           

            Answer.Name = Name;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<ImageAnswer, ImageAnswerViewModel>(Answer));
        }
       
        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteNode([FromBody] ImageAnswerViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var IA = await _applicationDbContext.ImageAnswers
                .Include(ia => ia.Leafs)
                .ThenInclude(l => l.ClickImages)
                .Include(ia => ia.ClickImages)
                .FirstOrDefaultAsync(ia => ia.Id == VM.Id);

            if (IA is null)
                return NotFound("Node not Found");

            if (IA.ClickImages.Count != 0 || IA.Leafs.Any(l => l.ClickImages.Count != 0))
                return BadRequest("Node Used in Questions, Can't Be Deleted");

            foreach (var ai in IA.Leafs)
            {
                _applicationDbContext.ImageAnswers.Remove(ai);
            }

            _applicationDbContext.ImageAnswers.Remove(IA);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteTree([FromBody] ImageAnswerGroupViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Group = await _applicationDbContext.ImageAnswerGroups
                .Include(g => g.Images)
                .ThenInclude(ia => ia.Leafs)
                .ThenInclude(l => l.ClickImages)
                .Include(g => g.Images)
                .ThenInclude(ia => ia.ClickImages)
                .FirstOrDefaultAsync(ia => ia.Id == VM.Id);

            if (Group is null)
                return NotFound("Group not Found");

            if (Group.Images.Any(a => a.ClickImages.Count != 0 || a.Leafs.Any(l => l.ClickImages.Count != 0)))
                return BadRequest("Tree Used in Questions, Can't Be Deleted");

            foreach (var i in Group.Images)
            {
                foreach (var ai in i.Leafs)
                {
                    _applicationDbContext.ImageAnswers.Remove(ai);
                }

                _applicationDbContext.ImageAnswers.Remove(i);

            }

            _applicationDbContext.ImageAnswerGroups.Remove(Group);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
