using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.QuestionGroupsSubgroup;
using QuizAPI.Models.QuestionGroupsSubgroup.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.QuestionGroupsController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class QuestionGroupsController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;

        public QuestionGroupsController(
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

        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionsGroupSingleStep(int CourseId, string Name, IFormFile Picture)
        {
            //Check Course Exists
            var Course = await _applicationDbContext.Courses
                .Include(c => c.QuestionGroups)
                .Include(c => c.Owners)
                .FirstOrDefaultAsync(c => c.Id == CourseId);

            if (Course is null)
                return NotFound($"Course  Not Found");

            //Check Name Not Null
            if (string.IsNullOrEmpty(Name))
                return BadRequest("Name Can't Be Empty");

            //Check Name Not Taken
            var NameTaken = Course.QuestionGroups
                .Any(g => g.Name == Name);

            if (NameTaken)
                return BadRequest("Name Taken Within the same Course");

            if (Picture is null)
                return BadRequest("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            /*var User = await _applicationDbContext.Users
               .FirstOrDefaultAsync(u => u.Id == GetUser(_httpContextAccessor));*/

            /*if (!Course.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner");*/

            //Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/QuestionGroups");

            var URL = await SaveFile(path, Picture);

            //Create Group
            var Group = new QuestionGroup()
            {
                Name = Name,
                CourseId = Course.Id,
                URL = URL
            };

            _applicationDbContext.QuestionGroups.Add(Group);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteGroup([FromBody] QuestionGroupViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Get Group
            var Group = await _applicationDbContext.QuestionGroups
                .FirstOrDefaultAsync(g => g.Id == VM.Id);

            if (Group is null)
                return NotFound("Group Not Found");

            _applicationDbContext.QuestionGroups.Remove(Group);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteSubgroup([FromBody] QuestionSubgroupViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Get Group
            var Subgroup = await _applicationDbContext.QuestionSubgroups
                .FirstOrDefaultAsync(g => g.Id == VM.Id);

            if (Subgroup is null)
                return NotFound("Group Not Found");

            _applicationDbContext.QuestionSubgroups.Remove(Subgroup);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionsGroupSingleStep(int GroupId, string Name, IFormFile Picture, bool SameImage)
        {
            //Check Course Exists
            var Course = await _applicationDbContext.Courses
                .Include(c => c.QuestionGroups)
                .Include(c => c.Owners)
                .FirstOrDefaultAsync(c => c.QuestionGroups.Any(g => g.Id == GroupId));

            if (Course is null)
                return NotFound($"Group Not Found");

            //Check Name Not Null
            if (string.IsNullOrEmpty(Name))
                return BadRequest("Name Can't Be Empty");

            //Check Name Not Taken
            var NameTaken = Course.QuestionGroups
                .Any(g => g.Name == Name && g.Id != GroupId);

            if (NameTaken)
                return BadRequest("Name Taken Within the same Course");

            if (!SameImage && Picture is null)
                return BadRequest("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => !SameImage && Picture.FileName.EndsWith(ve));

            if (!SameImage && !fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            /*var User = await _applicationDbContext.Users
               .FirstOrDefaultAsync(u => u.Id == GetUser(_httpContextAccessor));

            if (!Course.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner");*/

            //Get Group
            var Group = Course.QuestionGroups.FirstOrDefault(g => g.Id == GroupId);

            if (!SameImage)
            {
                //Generate a Path for The Picture
                var path = Path.Combine(
                    "wwwroot/QuestionGroups");

                var URL = await SaveFile(path, Picture);
                Group.URL = URL;
                Group.Size = Picture.Length;

            }

            Group.Name = Name;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditQuestionsGroupImage(int GroupId, IFormFile Picture)
        {
            //Check Group Exists
            var Group = await _applicationDbContext.QuestionGroups
                .FirstOrDefaultAsync(g => g.Id == GroupId);

            if (Group is null)
                return BadRequest($"Group {GroupId} Not Found");

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
                "wwwroot/QuestionGroups",
                $"Group_{Group.Id.ToString()}",
                "Thumbnail");

            var URL = await SaveFile(path, Picture);

            Group.URL = URL;
            Group.Size = Picture.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<QuestionGroup, QuestionGroupViewModel>(Group));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddQuestionsSubgroup([FromBody] QuestionSubgroupViewModel SubgroupVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Group Exists
            var Group = await _applicationDbContext.QuestionGroups
                .Include(g => g.Subgroups)
                .Include(g => g.Course)
                .ThenInclude(c => c.Owners)
                .FirstOrDefaultAsync(g => g.Id == SubgroupVM.GroupId);

            if (Group is null)
                return BadRequest($"Group {SubgroupVM.GroupId} Not Found");

            //Check Name Not Null
            if (string.IsNullOrEmpty(SubgroupVM.Name))
                return BadRequest("Name Can't Be Empty");

            //Check Name Exists within same Group
            var NameTaken = Group.Subgroups.Any(s => s.Name == SubgroupVM.Name);

            if (NameTaken)
                return BadRequest("Name Already Exists within same Group");

            /*var User = await _applicationDbContext.Users
              .FirstOrDefaultAsync(u => u.Id == GetUser(_httpContextAccessor));

            if (!Group.Course.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner");*/


            //Create Subgroup
            var Subgroup = new QuestionSubgroup()
            {
                Name = SubgroupVM.Name,
                GroupId = SubgroupVM.GroupId
            };

            _applicationDbContext.QuestionSubgroups.Add(Subgroup);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditQuestionsSubgroup([FromBody] QuestionSubgroupViewModel SubgroupVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Group Exists
            var Subgroup = await _applicationDbContext.QuestionSubgroups
                .Include(s => s.Group)
                .ThenInclude(g => g.Subgroups)
                .Include(g => g.Group)
                .ThenInclude(g => g.Course)
                .ThenInclude(c => c.Owners)
                .FirstOrDefaultAsync(g => g.Id == SubgroupVM.Id);

            if (Subgroup is null)
                return BadRequest($"Subgroup Not Found");

            //Check Name Not Null
            if (string.IsNullOrEmpty(SubgroupVM.Name))
                return BadRequest("Name Can't Be Empty");

            //Check Name Exists within same Group
            var NameTaken = Subgroup.Group
                .Subgroups
                .Any(s => s.Name == SubgroupVM.Name && s.Id != SubgroupVM.Id);

            if (NameTaken)
                return BadRequest("Name Already Exists within same Group");

           /* var User = await _applicationDbContext.Users
              .FirstOrDefaultAsync(u => u.Id == GetUser(_httpContextAccessor));

            if (!Subgroup.Group.Course.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner");*/

            Subgroup.Name = SubgroupVM.Name;
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
   
        [HttpPost("[action]")]
        public async Task<IActionResult> AssignQuestions([FromBody] AssignQuestionsToSubgroupViewModel RequestVM)
        {
            if (!ModelState.IsValid)
                return Ok("Invalid Data");

            //Get Subgroup
            var subgroup = await _applicationDbContext.QuestionSubgroups
                .Include(s => s.Group)
                .ThenInclude(g => g.Course)
                .ThenInclude(c => c.Owners)
                .Include(sg => sg.ClickableSubgroupRelations)
                //.Include(sg => sg.KeyboardQuestions)
                .FirstOrDefaultAsync(sg => sg.Id == RequestVM.SubgroupId);

            if (subgroup is null)
                return Ok("Subgroup Not Found");

            var User = await GetUser(_httpContextAccessor, _applicationDbContext);


            if (!subgroup.Group.Course.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner");

            // if (!RequestVM.ClickableQuestionId.HasValue && !RequestVM.KeyboardQuestionId.HasValue)
            //     return Ok("Please Choose a Question");

            foreach (var qq in RequestVM.ClickableQuestionIds)
            {
                var Question = await _applicationDbContext.SimpleClickableQuestions
                   .FirstOrDefaultAsync(q => q.Id == qq);

                if (Question is null)
                    return Ok("Question Not Found");

                subgroup.ClickableSubgroupRelations.Add(new ClickableQuestionSubgroupRelation()
                {
                    QuestionId = Question.Id
                });
            }

            foreach (var qq in RequestVM.KeyboardQuestionIds)
            {
                var Question = await _applicationDbContext.KeyboardQuestion
                   .FirstOrDefaultAsync(q => q.Id == qq);

                if (Question is null)
                    return Ok("Question Not Found");

                subgroup.KeyboardSubgroupRelations.Add(new KeyboardQuestionSubgroupRelation()
                {
                    QuestionId = Question.Id
                });
            }

            /*if (RequestVM.ClickableQuestionId.HasValue)
            {
                var Question = await _applicationDbContext.SimpleClickableQuestions
                    .FirstOrDefaultAsync(q => q.Id == RequestVM.ClickableQuestionId.Value);

                if (Question is null)
                    return Ok("Question Not Found");

                subgroup.ClickableSubgroupRelations.Add(new ClickableQuestionSubgroupRelation() {
                    QuestionId = Question.Id
                });
            }
            else
            {
                var Question = await _applicationDbContext.KeyboardQuestion
                    .FirstOrDefaultAsync(q => q.Id == RequestVM.KeyboardQuestionId.Value);

                if (Question is null)
                    return Ok("Question Not Found");

                //subgroup.KeyboardQuestions.Add(Question);
            }*/

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeassignQuestions([FromBody] AssignQuestionsToSubgroupViewModel RequestVM)
        {
            if (!ModelState.IsValid)
                return Ok("Invalid Data");

            //Get Subgroup
            var subgroup = await _applicationDbContext.QuestionSubgroups
                .Include(sg => sg.ClickableSubgroupRelations)
                .Include(sg => sg.KeyboardSubgroupRelations)
                .Include(s => s.Group)
                .ThenInclude(g => g.Course)
                .ThenInclude(c => c.Owners)
                .FirstOrDefaultAsync(sg => sg.Id == RequestVM.SubgroupId);

            if (subgroup is null)
                return Ok("Subgroup Not Found");

            var User = await GetUser(_httpContextAccessor, _applicationDbContext);


            if (!subgroup.Group.Course.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner");

            foreach (var qq in RequestVM.ClickableQuestionIds)
            {
                var Question = await _applicationDbContext.SimpleClickableQuestions
                   .FirstOrDefaultAsync(q => q.Id == qq);

                if (Question is null)
                    return Ok("Question Not Found");

                var Relation = subgroup.ClickableSubgroupRelations.FirstOrDefault(r => r.QuestionId == Question.Id);

                if (Relation is null)
                    return Ok("No Relation Found");

                subgroup.ClickableSubgroupRelations.Remove(Relation);
            }

            foreach (var qq in RequestVM.KeyboardQuestionIds)
            {
                var Question = await _applicationDbContext.KeyboardQuestion
                   .FirstOrDefaultAsync(q => q.Id == qq);

                if (Question is null)
                    return Ok("Question Not Found");

                var Relation = subgroup.KeyboardSubgroupRelations.FirstOrDefault(r => r.QuestionId == Question.Id);

                if (Relation is null)
                    return Ok("No Relation Found");

                subgroup.KeyboardSubgroupRelations.Remove(Relation);
            }

            /*if (!RequestVM.ClickableQuestionId.HasValue && !RequestVM.KeyboardQuestionId.HasValue)
                return Ok("Please Choose a Question");

            if (RequestVM.ClickableQuestionId.HasValue)
            {
                var Question = await _applicationDbContext.SimpleClickableQuestions
                    .FirstOrDefaultAsync(q => q.Id == RequestVM.ClickableQuestionId.Value);

                if (Question is null)
                    return Ok("Question Not Found");

                var Relation = subgroup.ClickableSubgroupRelations.FirstOrDefault(r => r.QuestionId == Question.Id);

                if(Relation is null)
                    return Ok("No Relation Found");

                subgroup.ClickableSubgroupRelations.Remove(Relation);
            }
            else
            {
                var Question = await _applicationDbContext.KeyboardQuestion
                    .FirstOrDefaultAsync(q => q.Id == RequestVM.KeyboardQuestionId.Value);

                if (Question is null)
                    return Ok("Question Not Found");

            }*/

            await _applicationDbContext.SaveChangesAsync();

            return Ok();

        }
    }
}
