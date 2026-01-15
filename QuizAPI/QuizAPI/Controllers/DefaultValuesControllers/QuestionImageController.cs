using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.DefaultValues.ImageAnswers;
using QuizAPI.Models.DefaultValues.ImageAnswers.ViewModels;
using QuizAPI.Models.DefaultValues.QuestionImage;
using QuizAPI.Models.Ownership.ClickTrees;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;


namespace QuizAPI.Controllers.DefaultValuesControllers
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class QuestionImageController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;

        public QuestionImageController(
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

        [HttpGet("[action]/{DatapoolId}")]
        public async Task<IActionResult> GetAllImages(int DatapoolId)
        {
            var List = await _applicationDbContext.QuestionImages
                .Where(i => i.DataPoolId == DatapoolId)
                .Include(m => m.AddedBy)
                .OrderBy(q => q.Code)
                .ToListAsync();

            return Ok(_mapper.Map<List<QuestionImage>, List<QuestionImageViewModel>>(List));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchDefaultQuestionImages_ADVANCED_PORTAL([FromBody] QuestionImageSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            Expression<Func<QuestionImage, bool>> criteria = dqi => 
            ((!string.IsNullOrEmpty(VM.Code) ? (dqi.Code.ToLower().Contains(VM.Code.ToLower())) : true) && dqi.DataPoolId == VM.DataPoolId);

            var CodesNumbers = await _applicationDbContext.QuestionImages
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

            var List = await _applicationDbContext.QuestionImages
                .Where(criteria)
                .Include(m => m.AddedBy)
                .OrderBy(q => q.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)

                .ToListAsync();

            var Ids = await _applicationDbContext.QuestionImages
              .Where(criteria)
              .OrderBy(q => q.Code)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
            {
                NumberOfImagesList = CodesNumbers.Count,
                ImagesList = _mapper.Map<List<QuestionImage>, List<QuestionImageViewModel>>(List),
                Ids = Ids,
                Codes = Codes

            });
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddImage(string Code, IFormFile Picture, int DataPoolId)
        {
            //Check if code is null
            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code cannot be empty");

            var CodeExists = await _applicationDbContext.QuestionImages
                .AnyAsync(i => i.Code == Code && i.DataPoolId == DataPoolId);

            if (CodeExists)
                return BadRequest("Code already exists");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var QI = new QuestionImage()
            {
                Code = Code,
                AddedById = Owner.Id,
             
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
                    $"QI_{Code.ToString()}");

                var URL = await SaveFile(path, Picture);

                QI.ImageURL = URL;
            }
            else
            {
                return BadRequest("Please provide image");
            }

            _applicationDbContext.QuestionImages.Add(QI);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")] 
        public async Task<IActionResult> DeleteImage([FromBody] QuestionImageViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var qi = await _applicationDbContext.QuestionImages
               .FirstOrDefaultAsync(i => i.Id == VM.Id);

            if (qi is null)
                return BadRequest("Data not found");


            _applicationDbContext.QuestionImages.Remove(qi);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditCode(int Id, string Code, int DataPoolId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check if code is null
            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code cannot be empty");

            var CodeExists = await _applicationDbContext.QuestionImages
                .AnyAsync(i => i.Code == Code && i.Id != Id && i.DataPoolId != DataPoolId);

            if (CodeExists)
                return BadRequest("Code already exists");

            var qi = await _applicationDbContext.QuestionImages
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (qi is null)
                return BadRequest("Data not found");


            qi.Code = Code;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditImage(int Id, IFormFile Picture)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");


            var QI = await _applicationDbContext.QuestionImages
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (QI is null)
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
                $"QI_{QI.Code.ToString()}");

            var URL = await SaveFile(path, Picture);

            QI.ImageURL = URL;
         
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        public class Code_Number
        {
            public char Code { get; set; }

            public int Number { get; set; }
        }
    }
}
