using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;
using QuizAPI.Models.Information;
using QuizAPI.Models.Information.ViewModels;
using QuizAPI.Models.Questions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Controllers.QuestionsController.SimpleClickableController;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.InformationController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class InformationController : Controller
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<BaseUser> _userManager;

        IHttpContextAccessor _httpContextAccessor;

        public InformationController(
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
        public async Task<IActionResult> GetInformationId(int Id)
        {
            var Information = await _applicationDbContext.Information
               
                .FirstOrDefaultAsync(k => k.Id == Id);

            return Ok(_mapper.Map<Information, InformationViewModel>(Information));
        }

        [HttpGet("[action]/{DatapoolId}")]
        public async Task<IActionResult> GetAllInformation(int DatapoolId)
        {
            var Information = await _applicationDbContext.Information
                .Where(k => k.DataPoolId == DatapoolId)
                .Include(m => m.AddedBy)
                .OrderBy(q => q.Code)
                .ToListAsync();

            return Ok(_mapper.Map<List<InformationViewModel>>(Information));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchInformation_ADVANCED_PORTAL([FromBody] InformationSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == VM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var CodesNumbers = await _applicationDbContext.Information
              .Where(m => m.DataPoolId == DATA_POOL.Id &&
(!string.IsNullOrEmpty(VM.Code) ? m.Code == VM.Code : true))
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

            var Information = await _applicationDbContext.Information
                .Where(m => m.DataPoolId == DATA_POOL.Id &&
(!string.IsNullOrEmpty(VM.Code) ? m.Code == VM.Code : true))
                .Include(m => m.AddedBy)
               .Include(m => m.Owners)
               .ThenInclude(o => o.Owner)
                .OrderBy(q => q.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)

                .ToListAsync();

            var Ids = await _applicationDbContext.Information
              .Where(m => m.DataPoolId == DATA_POOL.Id &&
(!string.IsNullOrEmpty(VM.Code) ? m.Code == VM.Code : true))
              .OrderBy(q => q.Code)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
            {
                NumberOfInformation = CodesNumbers.Count,
                Information = _mapper.Map<List<Information>, List<InformationViewModel>>(Information),
                Ids = Ids,
                Codes = Codes

            });
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> SearchOwnedInformation_ADVANCED_PORTAL([FromBody] InformationSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == VM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

             var CodesNumbers = await _applicationDbContext.Information
                .Include(m => m.Owners)
               .Where(m => m.DataPoolId == DATA_POOL.Id && m.Owners.Any(o => o.OwnerId == Owner.Id))
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

            var Information = await _applicationDbContext.Information
                .Include(m => m.AddedBy)
               .Include(m => m.Owners)
               .ThenInclude(o => o.Owner)
               .Where(m => m.DataPoolId == DATA_POOL.Id && m.Owners.Any(o => o.OwnerId == Owner.Id))
               .OrderBy(q => q.Code)
               .Skip(VM.Page * VM.QperPage)
               .Take(VM.QperPage)

               .ToListAsync();

            var Ids = await _applicationDbContext.Information
                .Include(m => m.Owners)
               .ThenInclude(o => o.Owner)
               .Where(m => m.DataPoolId == DATA_POOL.Id && m.Owners.Any(o => o.OwnerId == Owner.Id))
              .OrderBy(q => q.Code)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
             {
                 NumberOfInformation = CodesNumbers.Count,
                Information = _mapper.Map<List<Information>, List<InformationViewModel>>(Information),
                 Ids = Ids,
                 Codes = Codes

             });
        }
        
        [HttpPost("[action]")]
        public async Task<IActionResult> SearchInformationQuestions([FromBody] InformationViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            var Information = await _applicationDbContext.Information
               .FirstOrDefaultAsync(info => info.Id == VM.Id);

            if (Information is null)
                return NotFound("Explanation not found");          

            var Qs = await _applicationDbContext.QuestionBase

                  .Where(m =>m.InformationId == VM.Id)
                 .Include(q => q.LevelOfDifficulty)
                 .Include(q => q.Subtopic)
                 .ThenInclude(s => s.Topic)
                 .OrderBy(q => q.Code)

                 .Select(q => new {
                     Id = q.Id,
                     Code = q.Code,
                     Type = q.Type,

                     DateCreated = q.DateCreated,

                     AddedByName = q.AddedBy.Name,

                     Base_ImageURL = $"{FILES_PATH}/{q.Base_ImageURL}",

                     LevelOfDifficulty = new
                     {
                         Name = q.LevelOfDifficulty.Name,
                         HexColor = q.LevelOfDifficulty.HexColor,
                         Id = q.LevelOfDifficulty.Id,
                     },

                     Subtopic = new
                     {
                         Name = q.Subtopic.Name,
                         Id = q.Subtopic.Id,
                         Topic = new
                         {
                             Name = q.Subtopic.Topic.Name,
                             Id = q.Subtopic.Topic.Id
                         },
                     },
                 })
                .OrderBy(q => q.Code)
               .ToListAsync();

            return Ok(Qs);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchInformationQuestions_ADVANCED_PORTAL([FromBody] InformationSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == VM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var CodesNumbers = await _applicationDbContext.QuestionBase
              .Where(m =>
               m.DataPoolId == DATA_POOL.Id && (!string.IsNullOrEmpty(VM.Code) ? m.Code == VM.Code : true) 
              && 
              (VM.Assigned ? (m.InformationId.HasValue && m.InformationId == VM.InformationId ): (m.InformationId.HasValue ? m.InformationId != VM.InformationId : true))
              )
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

            var Qs = await _applicationDbContext.QuestionBase
                .Where(m =>
                m.DataPoolId == DATA_POOL.Id && (!string.IsNullOrEmpty(VM.Code) ? m.Code == VM.Code : true)
              &&
              (VM.Assigned ? (m.InformationId.HasValue && m.InformationId == VM.InformationId) : (m.InformationId.HasValue ? m.InformationId != VM.InformationId : true))
                )
                .Include(m => m.AddedBy)
               .Include(q => q.Information)
                .OrderBy(q => q.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)

                .ToListAsync();

            var Ids = await _applicationDbContext.QuestionBase
              .Where(m =>
               m.DataPoolId == DATA_POOL.Id && (!string.IsNullOrEmpty(VM.Code) ? m.Code == VM.Code : true)
              &&
              (VM.Assigned ? (m.InformationId.HasValue && m.InformationId == VM.InformationId) : (m.InformationId.HasValue ? m.InformationId != VM.InformationId : true))
              )
              .OrderBy(q => q.Code)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
            {
                NumberOfInfoQuestions = CodesNumbers.Count,
                InfoQuestions = _mapper.Map<List<QuestionBase>, List<QuestionBaseViewModel>>(Qs),
                Ids = Ids,
                Codes = Codes

            });
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddInfo(string Code, string Latex, IFormFile PDF, int DataPoolId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check if code is null
            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code cannot be empty");

            var CodeExists = await _applicationDbContext.Information
                .AnyAsync(i => i.Code == Code);

            if(CodeExists)
                return BadRequest("Code already exists");

            if(string.IsNullOrEmpty(Latex) && PDF is null)
                return BadRequest("Please provide a latex or pdf file");


            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var information = new Information()
            {
                Code = Code,
                Latex = Latex,
                AddedById = Owner.Id,
                DataPoolId = DATA_POOL.Id
            };

         

            //Verify Extension
            if (PDF != null)
            {
                var validExtenstions = new List<string>() { ".pdf" };
                var fileExtensionIsValid = validExtenstions.Any(ve => PDF.FileName.EndsWith(ve));

                if (!fileExtensionIsValid)
                {
                    return BadRequest("PDF file extenstion is not valid");
                }

                //Picture
                var path = Path.Combine(
                    "wwwroot/Information",
                    $"Info_{Code.ToString()}");

                var URL = await SaveFile(path, PDF);

                information.PDFURL = URL;
                information.PDFSize = PDF.Length;
            }

            _applicationDbContext.Information.Add(information);
            await _applicationDbContext.SaveChangesAsync();

            _applicationDbContext.InformationOwner.Add(new InformationOwner() { 
                OwnerId = Owner.Id,
                InformationId = information.Id
            });
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteInfo(int Id)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            
            var Info = await _applicationDbContext.Information
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (Info is null)
                return BadRequest("Data not found");

            _applicationDbContext.Information.Remove(Info);
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

            var CodeExists = await _applicationDbContext.Information
                .AnyAsync(i => i.Code == Code && i.Id != Id);

            if (CodeExists)
                return BadRequest("Code already exists");

            var Info = await _applicationDbContext.Information
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (Info is null)
                return BadRequest("Data not found");


            Info.Code = Code;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditLatex(int Id, string Latex)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");


            var Info = await _applicationDbContext.Information
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (Info is null)
                return BadRequest("Data not found");

            if(string.IsNullOrEmpty(Info.PDFURL) && string.IsNullOrEmpty(Latex))
                return BadRequest("Information should have PDF or Latex text atleast");

            Info.Latex = Latex;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditPDF(int Id, IFormFile PDF)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");


            var Info = await _applicationDbContext.Information
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (Info is null)
                return BadRequest("Data not found");

            //Verify Extension
            var validExtenstions = new List<string>() { ".pdf" };
            var fileExtensionIsValid = validExtenstions.Any(ve => PDF.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("PDF file extenstion is not valid");
            }

            //Picture
            var path = Path.Combine(
                "wwwroot/Information",
                $"Info_{Info.Code.ToString()}");

            var URL = await SaveFile(path, PDF);

            Info.PDFURL = URL;
            Info.PDFSize = PDF.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemovePDF(int Id)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Info = await _applicationDbContext.Information
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (Info is null)
                return BadRequest("Data not found");

            if (string.IsNullOrEmpty(Info.Latex))
                return BadRequest("Information should have PDF or Latex text atleast");


            Info.PDFURL = null;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AssignQuestions(int Id, List<int> QuestionIds)
        {
          
            var Info = await _applicationDbContext.Information
                .FirstOrDefaultAsync(i => i.Id == Id);

            if (Info is null)
                return BadRequest("Data not found");

            var Questions = await _applicationDbContext.QuestionBase
                .Where(q => QuestionIds.Any(id => q.Id == id))
                .ToListAsync();

            if(Questions.Count == 0)
                return BadRequest("Please provide questions to assign");

            if (Questions.Count != QuestionIds.Distinct().Count())
                return BadRequest("Some questions not found");

            foreach(var q in Questions)
            {
                q.InformationId = Info.Id;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> DeassignQuestions(List<int> QuestionIds)
        {

            var Questions = await _applicationDbContext.QuestionBase
                .Where(q => QuestionIds.Any(id => q.Id == id))
                .ToListAsync();

            if (Questions.Count == 0)
                return BadRequest("Please provide questions to unassign");

            if (Questions.Count != QuestionIds.Distinct().Count())
                return BadRequest("Some questions not found");

            foreach (var q in Questions)
            {
                q.InformationId = null;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


    }

}
