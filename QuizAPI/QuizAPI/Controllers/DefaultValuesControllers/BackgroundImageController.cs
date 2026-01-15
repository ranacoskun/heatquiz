using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;
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
    public class BackgroundImageController : Controller
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;

        IHttpContextAccessor _httpContextAccessor;

        public BackgroundImageController(
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
            var BackgroundImage = await _applicationDbContext.BackgroundImage

                .FirstOrDefaultAsync(k => k.Id == Id);

            return Ok(_mapper.Map<BackgroundImage, BackgroundImageViewModel>(BackgroundImage));
        }

        [HttpGet("[action]/{DataPoolId}")]
        public async Task<IActionResult> GetAllImages(int DataPoolId)
        {
            var BIs = await _applicationDbContext.BackgroundImage
                .Where(i => i.DataPoolId == DataPoolId)
                .Include(a => a.AddedBy)
                .OrderBy(q => q.Code)
                .ToListAsync();

            return Ok(_mapper.Map<List<BackgroundImage>, List<BackgroundImageViewModel>>(BIs));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchBackgroundImage_ADVANCED_PORTAL([FromBody] InformationSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == VM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            Expression<Func<BackgroundImage, bool>> criteria = m =>
                m.DataPoolId == DATA_POOL.Id &&
              (!string.IsNullOrEmpty(VM.Code) ? m.Code.ToLower().Contains(VM.Code.ToLower()) : true);


            var CodesNumbers = await _applicationDbContext.BackgroundImage
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

            var BackgroundImage = await _applicationDbContext.BackgroundImage
                .Where(criteria)
                .Include(m => m.AddedBy)
                .OrderBy(q => q.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)

                .ToListAsync();

            var Ids = await _applicationDbContext.BackgroundImage
              .Where(criteria)
              .OrderBy(q => q.Code)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
            {
                NumberOfBackgroundImages = CodesNumbers.Count,
                BackgroundImages = _mapper.Map<List<BackgroundImage>, List<BackgroundImageViewModel>>(BackgroundImage),
                Ids = Ids,
                Codes = Codes

            });
        }



        [HttpPost("[action]")]
        public async Task<IActionResult> AddImage(string Code, IFormFile Picture, int DataPoolId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check if code is null
            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code cannot be empty");

            var CodeExists = await _applicationDbContext.BackgroundImage
                .AnyAsync(i => i.Code == Code && i.Id == DataPoolId);

            if (CodeExists)
                return BadRequest("Code already exists");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var bi = new BackgroundImage()
            {
                Code = Code,
                AddedById = Owner.Id,
                Height = 1,
                Width = 1,
                DataPoolId = DATA_POOL.Id
            };

            //Verify Extension
            if (Picture != null)
            {
                var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

                if (!fileExtensionIsValid)
                {
                    return BadRequest("Image file extenstion is not valid");
                }

                //Picture
                var path = Path.Combine(
                    "wwwroot/Information",
                    $"BI_{Code.ToString()}");

                var URL = await SaveFile(path, Picture);

                bi.URL = URL;
            }
            else
            {
                return BadRequest("Please provide image");
            }

            _applicationDbContext.BackgroundImage.Add(bi);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteImage([FromBody] BackgroundImageViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");


            var BI = await _applicationDbContext.BackgroundImage
                .FirstOrDefaultAsync(a => a.Id == VM.Id);

            if (BI is null)
                return NotFound("Not found");

            _applicationDbContext.BackgroundImage.Remove(BI);

            await _applicationDbContext.SaveChangesAsync();

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

            var CodeExists = await _applicationDbContext.BackgroundImage
                .AnyAsync(i => i.Code == Code && i.Id != Id);

            if (CodeExists)
                return BadRequest("Code already exists");

            var bi = await _applicationDbContext.BackgroundImage
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (bi is null)
                return BadRequest("Data not found");


            bi.Code = Code;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditImage(int Id, IFormFile Picture, float Width, float Height)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");


            var bi = await _applicationDbContext.BackgroundImage
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (bi is null)
                return BadRequest("Data not found");


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
                $"BI_{bi.Code.ToString()}");

            var URL = await SaveFile(path, Picture);

            bi.URL = URL;
            bi.Height = Height;
            bi.Width = Width;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> SelectImageGroup(List<int> ElementIds, int ImageId)
        {
            var BackgroundImage = await _applicationDbContext.BackgroundImage
                .FirstOrDefaultAsync(l => l.Id == ImageId);

            if (BackgroundImage is null)
                return NotFound("Background image not found");

            var MapElements = await _applicationDbContext.CourseMapElement
                .Where(e => ElementIds.Any(Id => Id == e.Id))
                .ToListAsync();

            if (MapElements.Count != ElementIds.Distinct().Count())
                return NotFound("Some map elements not found");

            foreach (var e in MapElements)
            {
                e.Background_ImageId = BackgroundImage.Id;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

    }
}
