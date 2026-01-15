using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;
using QuizAPI.Models.Course;
using QuizAPI.Models.Course.ViewModels;
using QuizAPI.Models.Ownership;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.CourseController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class CourseController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;

        public CourseController(
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
        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllCourses_PORTAL()
        {
            var Courses = await _applicationDbContext.Courses
                .OrderBy(c => c.Name)
                .Include(c => c.Owners)
                .ThenInclude(o => o.Owner)
                .Include(c => c.AddedBy)
                .ToListAsync();

            return Ok(_mapper.Map<List<Course>, List<CourseViewModel>>(Courses));
        }

        [HttpGet("[action]/{DataPoolId}")]
        public async Task<IActionResult> GetAllCourses_PORTAL(int DataPoolId)
        {
            var DPExists = await _applicationDbContext.DataPools
                .AnyAsync(d => d.Id == DataPoolId);

            if (!DPExists)
                return NotFound("Datapool does not exist");

            var Courses = await _applicationDbContext.Courses
                .OrderBy(c => c.Name)
                .Include(c => c.Owners)
                .ThenInclude(o => o.Owner)
                .Include(c => c.AddedBy)
                .Where(c => c.DataPoolId == DataPoolId)
                .ToListAsync();

            return Ok(_mapper.Map<List<Course>, List<CourseViewModel>>(Courses));
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetCourseById_PORTAL(int Id)
        {
            var Course = await _applicationDbContext.Courses
                .Include(c => c.Owners)
                .ThenInclude(o => o.Owner)
                .Include(c => c.AddedBy)
                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.ClickableSubgroupRelations)
                .ThenInclude(r => r.Question)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.KeyboardSubgroupRelations)
                .ThenInclude(r => r.Question)

                .Include(c => c.CourseMaps)

                .FirstOrDefaultAsync(c => c.Id == Id);

            if (Course is null)
                return NotFound("Course Not Found");

            Course.CourseMaps = Course.CourseMaps.OrderBy(m => m.Title).ToList();

            return Ok(_mapper.Map<Course, CourseViewModel>(Course));
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetCourseById_STUDENT_PORTAL(int Id)
        {
            var Course = await _applicationDbContext.Courses
                .Include(c => c.Owners)
                .ThenInclude(o => o.Owner)
                .Include(c => c.AddedBy)
                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.ClickableSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.LevelOfDifficulty)

                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .ThenInclude(sg => sg.KeyboardSubgroupRelations)
                .ThenInclude(r => r.Question)
                .ThenInclude(q => q.LevelOfDifficulty)
                .FirstOrDefaultAsync(c => c.Id == Id);


            return Ok(_mapper.Map<Course, CourseViewModel>(Course));
        }

        [HttpGet("[action]/{DataPoolId}")]
        public async Task<IActionResult> GetAllMyCourses_PORTAL(int DataPoolId)
        {
            BaseUser Owner = null;
            try
            {
                 Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            }
            catch
            {

            };

            if (Owner is null)
                return Ok();

            var Courses = await _applicationDbContext.Courses
                .OrderBy(c => c.Name)
                .Include(c => c.Owners)
                .ThenInclude(o => o.Owner)
                .Where(c => c.Owners.Any(o => o.Owner.Id == Owner.Id) && c.DataPoolId == DataPoolId)
                .Include(c=> c.CourseMaps)
                .ToListAsync();

            return Ok(_mapper.Map<List<Course>, List<CourseViewModel>>(Courses));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchCourses_PORTAL([FromBody] SearchCourseViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var Courses = await _applicationDbContext.Courses
                .Where(c => (string.IsNullOrEmpty(VM.Code)? true : 
                (c.Code.ToUpper().Contains(VM.Code.ToUpper()) || c.Name.ToUpper().Contains(VM.Code.ToUpper())))
                            &&
                            (string.IsNullOrEmpty(VM.AddedBy) ? true : c.AddedBy.Name == VM.AddedBy)
                            && c.DataPoolId == VM.DataPoolId
                )
                .ToListAsync();

            return Ok(_mapper.Map<List<Course>, List<CourseViewModel>>(Courses));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetCourseAdders_PORTAL()
        {

            var Courses = await _applicationDbContext.Courses
                .Select(c => c.AddedBy)
                .Distinct()
                .Select(a => new
                {
                    Name = a.Name
                })
                .ToListAsync();

            return Ok(Courses);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllCourses_APP()
        {
            var Courses = await _applicationDbContext.Courses
                .OrderBy(c => c.Name)
                .ToListAsync();

            return Ok(_mapper.Map<List<Course>, List<CourseViewModel>>(Courses));
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetCourseById_APP(int Id)
        {
            var Course = await _applicationDbContext.Courses
                .Include(c => c.QuestionGroups)
                .ThenInclude(g => g.Subgroups)
                .FirstOrDefaultAsync(c => c.Id == Id);

            return Ok(_mapper.Map<Course, CourseViewModel>(Course));
        }

        [HttpGet("[action]/{CourseCode}")]
        public async Task<IActionResult> GetCourseByCode_APP(string CourseCode)
        {
            var Courses = await _applicationDbContext.Courses
                .Where(c => c.Code.ToUpper().Contains(CourseCode.ToUpper())
                 ||
                c.Name.ToUpper().Contains(CourseCode.ToUpper())
                )
                .ToListAsync();

            return Ok(_mapper.Map<List<Course>, List<CourseViewModel>>(Courses));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddCourse([FromBody] CourseViewModel CourseVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == CourseVM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check Name Not Null
            if (string.IsNullOrEmpty(CourseVM.Name))
                return BadRequest("Name Can't Be Empty");

            //Check Code Not Null
            if (string.IsNullOrEmpty(CourseVM.Code))
                return BadRequest("Code Can't Be Empty");

            //Check Name Not Taken 
            var NameTaken = await _applicationDbContext.Courses
                .AnyAsync(c => c.Name == CourseVM.Name);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            //Check Code Not Taken 
            var CodeTaken = await _applicationDbContext.Courses
                .AnyAsync(c => c.Code == CourseVM.Code);

            if (CodeTaken)
                return BadRequest("Code Taken, Choose Different Code");

            //Create Course
            var course = new Course()
            {
                Name = CourseVM.Name,
                Code = CourseVM.Code,
                DataPoolId = DATA_POOL.Id
            };

            _applicationDbContext.Courses.Add(course);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Course, CourseViewModel>(course));
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> EditCourseNameCode([FromBody] CourseViewModel CourseVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Name Not Null
            if (string.IsNullOrEmpty(CourseVM.Name))
                return BadRequest("Name Can't Be Empty");

            //Check Code Not Null
            if (string.IsNullOrEmpty(CourseVM.Code))
                return BadRequest("Code Can't Be Empty");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == CourseVM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Get Course
            var course = await _applicationDbContext.Courses
                .FirstOrDefaultAsync(c => c.Id == CourseVM.Id);

            if (course is null)
                return NotFound($"Course {CourseVM.Id} Not Found");

            //Check Name Not Taken 
            var NameTaken = await _applicationDbContext.Courses
                .AnyAsync(c => c.Id != course.Id && c.Name == CourseVM.Name && c.DataPoolId == DATA_POOL.Id);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            //Check Code Not Taken 
            var CodeTaken = await _applicationDbContext.Courses
                .AnyAsync(c => c.Id != course.Id && c.Code == CourseVM.Code && c.DataPoolId == DATA_POOL.Id);

            if (CodeTaken)
                return BadRequest("Code Taken, Choose Different Code");

            //Change Name Code
            course.Name = CourseVM.Name;
            course.Code = CourseVM.Code;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Course, CourseViewModel>(course));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditCourseThumbnail(int CourseId, IFormFile Picture)
        {
            //Check Course Exists
            var course = await _applicationDbContext.Courses
                .FirstOrDefaultAsync(c => c.Id == CourseId);

            if (course is null)
                return NotFound($"Course {CourseId} Not Found");

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
                "wwwroot/Courses",
                $"Course_{course.Id.ToString()}",
                "Thumbnail");

            var URL = await SaveFile(path, Picture);

            course.URL = URL;
            course.Size = Picture.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Course, CourseViewModel>(course));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddCourseSingleStep(string Name, string Code, IFormFile Picture, int DataPoolId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Name Not Null
            if (string.IsNullOrEmpty(Name))
                return BadRequest("Name Can't Be Empty");

            //Check Code Not Null
            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code Can't Be Empty");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check Name Not Taken 
            var NameTaken = await _applicationDbContext.Courses
                .AnyAsync(c => c.Name == Name && c.DataPoolId == DATA_POOL.Id);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            //Check Code Not Taken 
            var CodeTaken = await _applicationDbContext.Courses
                .AnyAsync(c => c.Code == Code);

            if (CodeTaken)
                return BadRequest("Code Taken, Choose Different Code");

            //Check Picture
            if (Picture is null)
                return BadRequest("Please Provide Picture");


            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Create Course
            var course = new Course()
            {
                Name = Name,
                Code = Code,
                AddedBy = Owner,
                DataPoolId = DATA_POOL.Id
            };

            course.Owners.Add(new CourseOwner()
            {
                Owner = Owner,
                DataPoolId = DATA_POOL.Id
            });

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            //Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/Courses",
                $"Course_{Code}",
                "Thumbnail");

            var URL = await SaveFile(path, Picture);

            course.URL = URL;
            course.Size = Picture.Length;


            _applicationDbContext.Courses.Add(course);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Course, CourseViewModel>(course));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditCourseSingleStep(int CourseId, string Name, string Code, IFormFile Picture, bool SameImage, int DataPoolId)
        {
            //Check Name Not Null
            if (string.IsNullOrEmpty(Name))
                return BadRequest("Name Can't Be Empty");

            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code Can't Be Empty");

            var Course = await _applicationDbContext.Courses
                .FirstOrDefaultAsync(c => c.Id == CourseId);


            if (Course is null)
                return NotFound("Course Not Found");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check Is Owner
            var User = await GetUser(_httpContextAccessor, _applicationDbContext);

            /*if (!Course.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner");*/

            //Check Name/Code Not Taken 
            var NameTaken = await _applicationDbContext.Courses
                .AnyAsync(c => c.Name == Name && c.Id != CourseId && c.DataPoolId == DATA_POOL.Id);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            var CodeTaken = await _applicationDbContext.Courses
                .AnyAsync(c => c.Code == Code && c.Id != CourseId && c.DataPoolId == DATA_POOL.Id);

            if (CodeTaken)
                return BadRequest("Code Taken, Choose Different Name");

            //Check Picture
            if (!SameImage && Picture is null)
                return BadRequest("Please Provide Picture");

            //Edit Course Name
            Course.Name = Name;
            Course.Code = Code;

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => !SameImage && Picture.FileName.EndsWith(ve));

            if (!SameImage && !fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            if(!SameImage)
            {
                //Generate a Path for The Picture
                var path = Path.Combine(
                    "wwwroot/Courses",
                    $"Course_{Course.Code}",
                    "Thumbnail");

                var URL = await SaveFile(path, Picture);

                Course.URL = URL;
                Course.Size = Picture.Length;
            }
           
            await _applicationDbContext.SaveChangesAsync();
            return Ok(_mapper.Map<Course, CourseViewModel>(Course));
        }

    }
}
