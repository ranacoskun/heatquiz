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
using QuizAPI.Models.DefaultValues.BackgroundImage;
using QuizAPI.Models.Information;
using QuizAPI.Models.Information.ViewModels;
using QuizAPI.Models.Questions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using static QuizAPI.Controllers.QuestionsController.SimpleClickableController;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.DefaultValuesControllers
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class CourseMapElementImagesController : Controller
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;

        IHttpContextAccessor _httpContextAccessor;

        public CourseMapElementImagesController(
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

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetById(int Id)
        {
            var BackgroundImage = await _applicationDbContext.CourseMapElementImages

                .FirstOrDefaultAsync(k => k.Id == Id);

            return Ok(_mapper.Map<CourseMapElementImages, CourseMapElementImagesViewModel>(BackgroundImage));
        }

        [HttpGet("[action]/{DataPoolId}")]
        public async Task<IActionResult> GetAllImages(int DataPoolId)
        {
            var BIs = await _applicationDbContext.CourseMapElementImages
                .Include(m => m.AddedBy)
                .OrderBy(q => q.Code)
                .Where(i => i.DataPoolId == DataPoolId)
                .ToListAsync();

            return Ok(_mapper.Map<List<CourseMapElementImages>, List<CourseMapElementImagesViewModel>>(BIs));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchCourseMapElementImages_ADVANCED_PORTAL([FromBody] InformationSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == VM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            Expression<Func<CourseMapElementImages, bool>> criteria = m =>
                m.DataPoolId == DATA_POOL.Id &&
              (!string.IsNullOrEmpty(VM.Code) ? m.Code.ToLower().Contains(VM.Code.ToLower()) : true);


            var CodesNumbers = await _applicationDbContext.CourseMapElementImages
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

            var CourseMapElementImages = await _applicationDbContext.CourseMapElementImages
                .Where(criteria)
                .Include(m => m.AddedBy)
                .OrderBy(q => q.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)

                .ToListAsync();

            var Ids = await _applicationDbContext.CourseMapElementImages
              .Where(criteria)
              .OrderBy(q => q.Code)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
            {
                NumberOfCourseMapElementImages = CodesNumbers.Count,
                CourseMapElementImages = _mapper.Map<List<CourseMapElementImages>, List<CourseMapElementImagesViewModel>>(CourseMapElementImages),
                Ids = Ids,
                Codes = Codes

            });
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddImage(string Code, IFormFile Play, IFormFile PDF, IFormFile Video, IFormFile Link, int DataPoolId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check if code is null
            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code cannot be empty");

            var CodeExists = await _applicationDbContext.CourseMapElementImages
                .AnyAsync(i => i.Code == Code);

            if (CodeExists)
                return BadRequest("Code already exists");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var cmpei = new CourseMapElementImages()
            {
                Code = Code,
                AddedById = Owner.Id,
                DataPoolId = DATA_POOL.Id
            };

            var ImagesList = new List<IFormFile>();
            ImagesList.Add(Play);
            ImagesList.Add(PDF);
            ImagesList.Add(Video);
            ImagesList.Add(Link);

            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };

            if (!ImagesList.Any() || ImagesList.Any(i => i!=null && !validExtenstions.Any(ve => i.FileName.EndsWith(ve))))
                return BadRequest("Please provide proper image files");

            if (Play != null)
            {
                //Picture
                var path = Path.Combine(
                    "wwwroot/Information",
                    $"CME_{Code.ToString()}");

                var URL = await SaveFile(path, Play);

                cmpei.Play = URL;
            }

            if (PDF != null)
            {
                //Picture
                var path = Path.Combine(
                    "wwwroot/Information",
                    $"CME_{Code.ToString()}");

                var URL = await SaveFile(path, PDF);

                cmpei.PDF = URL;
            }

            if (Video != null)
            {
                //Picture
                var path = Path.Combine(
                    "wwwroot/Information",
                    $"CME_{Code.ToString()}");

                var URL = await SaveFile(path, Video);

                cmpei.Video = URL;
            }

            if (Link != null)
            {
                //Picture
                var path = Path.Combine(
                    "wwwroot/Information",
                    $"CME_{Code.ToString()}");

                var URL = await SaveFile(path, Link);

                cmpei.Link = URL;
            }

            _applicationDbContext.CourseMapElementImages.Add(cmpei);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteImage(int Id)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");


            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditCode(int Id, string Code)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check if code is null
            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code cannot be empty");

            var bi = await _applicationDbContext.CourseMapElementImages
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (bi is null)
                return BadRequest("Data not found");

            var CodeExists = await _applicationDbContext.CourseMapElementImages
                .AnyAsync(i => i.Code == Code && i.Id != Id && i.DataPoolId == bi.DataPoolId);

            if (CodeExists)
                return BadRequest("Code already exists");

            bi.Code = Code;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditImage(int Id, IFormFile Picture, EDIT_TYPE EditType)
        {
            var bi = await _applicationDbContext.CourseMapElementImages
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (bi is null)
                return BadRequest("List not found");

            if (Picture is null)
                return BadRequest("Please provide image");
    
            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Image file extenstion is not valid");
            }

            //Picture
            var path = Path.Combine(
                "wwwroot/Information",
                $"CME_{bi.Code.ToString()}");

            var URL = await SaveFile(path, Picture);

            switch (EditType)
            {
                case EDIT_TYPE.PLAY:
                    {
                        bi.Play = URL;

                        break;
                    }

                case EDIT_TYPE.PDF:
                    {
                        bi.PDF = URL;

                        break;
                    }

                case EDIT_TYPE.VIDEO:
                    {
                        bi.Video = URL;

                        break;
                    }

                case EDIT_TYPE.LINK:
                    {
                        bi.Link = URL;

                        break;
                    }

                default:
                    {
                        return BadRequest("Edit type not correct");
                    }
            }
            

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SelectImage(int ElementId, int ListId)
        {
            var List = await _applicationDbContext.CourseMapElementImages
                .FirstOrDefaultAsync(l => l.Id == ListId);

            if (List is null)
                return NotFound("List not found");

            var MapElement = await _applicationDbContext.CourseMapElement
                .FirstOrDefaultAsync(e => e.Id == ElementId);

            if (MapElement is null)
                return NotFound("Map element not found");

            MapElement.CourseMapElementImagesId = List.Id;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeassignImagesList(int ElementId)
        {
            
            var MapElement = await _applicationDbContext.CourseMapElement
                .FirstOrDefaultAsync(e => e.Id == ElementId);

            if (MapElement is null)
                return NotFound("Map element not found");

            MapElement.CourseMapElementImagesId = null;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapElementViewModel>(MapElement));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SelectImageGroup(List<int> ElementIds, int ListId)
        {
            var List = await _applicationDbContext.CourseMapElementImages
                .FirstOrDefaultAsync(l => l.Id == ListId);

            if (List is null)
                return NotFound("List not found");

            var MapElements = await _applicationDbContext.CourseMapElement
                .Where(e => ElementIds.Any(Id => Id == e.Id))
                .Include(e => e.Map)
                .ToListAsync();

            if (MapElements.Count != ElementIds.Distinct().Count())
                return NotFound("Some map elements not found");

            foreach (var e in MapElements)
            {
                e.CourseMapElementImagesId = List.Id;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapView2Model>(MapElements.FirstOrDefault().Map));
        }

        public enum EDIT_TYPE
        {
            PLAY = 0,
            PDF = 2,
            VIDEO = 4,
            LINK=8
        }

    }
}
