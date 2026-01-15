using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.DefaultValues.ImageAnswers;
using QuizAPI.Models.DefaultValues.ImageAnswers.ViewModels;
using QuizAPI.Models.DefaultValues.QuestionImage;
using QuizAPI.Models.DefaultValues.SeriesButtonImage;
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
    public class SeriesButtonImageController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;

        public SeriesButtonImageController(
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


        [HttpPost("[action]")]
        public async Task<IActionResult> SearchIcons_ADVANCED_PORTAL([FromBody] QuestionImageSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            Expression<Func<SeriesButtonImage, bool>> criteria = dqi =>
            ((!string.IsNullOrEmpty(VM.Code) ? (dqi.Code.ToLower().Contains(VM.Code.ToLower())) : true) && dqi.DataPoolId == VM.DataPoolId);

            var CodesNumbers = await _applicationDbContext.SeriesButtonImages
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

            var List = await _applicationDbContext.SeriesButtonImages
                .Where(criteria)
                .Include(m => m.AddedBy)
                .OrderBy(q => q.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)

                .ToListAsync();

            var Ids = await _applicationDbContext.SeriesButtonImages
              .Where(criteria)
              .OrderBy(q => q.Code)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
            {
                NumberOfSeriesButtonImages = CodesNumbers.Count,
                SeriesButtonImages = _mapper.Map<List<SeriesButtonImage>, List<SeriesButtonImageViewModel>>(List),
                Ids = Ids,
                Codes = Codes

            });
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddCollection(string Code,
            IFormFile ExitImage,
            IFormFile ClearImage,
            IFormFile SubmitImage,
            IFormFile ContinueImage,
            IFormFile PDFImage,
            int DataPoolId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check if code is null
            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code cannot be empty");

            var CodeExists = await _applicationDbContext.SeriesButtonImages
                .AnyAsync(i => i.Code == Code && i.DataPoolId == DataPoolId);

            if (CodeExists)
                return BadRequest("Code already exists");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var SBI = new SeriesButtonImage()
            {
                Code = Code,
                AddedById = Owner.Id,

                DataPoolId = DATA_POOL.Id
            };

            var ImagesList = new List<IFormFile>();
            ImagesList.Add(ExitImage);
            ImagesList.Add(ClearImage);
            ImagesList.Add(SubmitImage);
            ImagesList.Add(ContinueImage);
            ImagesList.Add(PDFImage);

            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };

            if (!ImagesList.Any() || ImagesList.Any(i => i != null && !validExtenstions.Any(ve => i.FileName.EndsWith(ve))))
                return BadRequest("Please provide proper image files");

            foreach (var image in ImagesList)
            {

            }

            if (ExitImage != null)
            {
                //Picture
                var path = Path.Combine(
                    "wwwroot/Information",
                    $"QI_EXT_{Code.ToString()}");

                var URL = await SaveFile(path, ExitImage);

                SBI.ExitImageURL = URL;
            }

            if (ClearImage != null)
            {
                //Picture
                var path = Path.Combine(
                    "wwwroot/Information",
                    $"QI_CLR_{Code.ToString()}");

                var URL = await SaveFile(path, ClearImage);

                SBI.ClearImageURL = URL;
            }

            if (SubmitImage != null)
            {
                //Picture
                var path = Path.Combine(
                    "wwwroot/Information",
                    $"QI_SBMT_{Code.ToString()}");

                var URL = await SaveFile(path, SubmitImage);

                SBI.SubmitImageURL = URL;
            }

            if (ContinueImage != null)
            {
                //Picture
                var path = Path.Combine(
                    "wwwroot/Information",
                    $"QI_CNTNU_{Code.ToString()}");

                var URL = await SaveFile(path, ContinueImage);

                SBI.ContinueImageURL = URL;
            }

            if (PDFImage != null)
            {
                //Picture
                var path = Path.Combine(
                    "wwwroot/Information",
                    $"QI_PDF_{Code.ToString()}");

                var URL = await SaveFile(path, PDFImage);

                SBI.PDFImageURL = URL;
            }

            _applicationDbContext.SeriesButtonImages.Add(SBI);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteCollection(int Id)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var sbi = await _applicationDbContext.SeriesButtonImages
               .FirstOrDefaultAsync(i => i.Id == Id);

            if (sbi is null)
                return BadRequest("Data not found");


            _applicationDbContext.SeriesButtonImages.Remove(sbi);
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

            var CodeExists = await _applicationDbContext.SeriesButtonImages
                .AnyAsync(i => i.Code == Code && i.Id != Id && i.DataPoolId != DataPoolId);

            if (CodeExists)
                return BadRequest("Code already exists");

            var sbi = await _applicationDbContext.SeriesButtonImages
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (sbi is null)
                return BadRequest("Data not found");


            sbi.Code = Code;

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
