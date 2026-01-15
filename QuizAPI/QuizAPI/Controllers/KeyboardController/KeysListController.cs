using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.DefaultValues.Keyboard;
using QuizAPI.Models.DefaultValues.Keyboard.ViewModels;
using QuizAPI.Models.Ownership;
using QuizAPI.Models.Questions.KeyboardQuestion;
using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using RestSharp;
using Svg;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Xml;
using static QuizAPI.Controllers.QuestionsController.SimpleClickableController;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.KeyboardController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class KeysListController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
      
        IHttpContextAccessor _httpContextAccessor;

        public KeysListController(
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

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetKeysListId(int Id)
        {
            var KeysList = await _applicationDbContext.KeysLists
                                .FirstOrDefaultAsync(k => k.Id == Id);

            return Ok(_mapper.Map<KeysList, KeysListViewModel>(KeysList));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveKeyList([FromBody] KeysListViewModel VM)
        {
            var KeysList = await _applicationDbContext.KeysLists
                .Include(a => a.AddedBy)
                .Include(a => a.VariableKeys)
                .Include(a => a.NumericKeys)
                .FirstOrDefaultAsync(a => a.Id == VM.Id);

            if (KeysList.VariableKeys.Any() || KeysList.NumericKeys.Any())
            {
                return BadRequest("Cannot delete keys list since it is assigned to alteast one key");
            }

            _applicationDbContext.KeysLists.Remove(KeysList);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("[action]/{DataPoolId}")]
        public async Task<IActionResult> GetAllKeyLists(int DataPoolId)
        {
            var KeysLists = await _applicationDbContext.KeysLists
                .Where(kl => kl.DataPoolId == DataPoolId)
                .Include(a => a.AddedBy)
                .Include(a => a.VariableKeys)
                .Include(a => a.NumericKeys)
                .ToListAsync();

            return Ok(_mapper.Map<List<KeysList>, List<KeysListViewModel>>(KeysLists));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetListAssignedKeys([FromBody] KeysListViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            var KeysList = await _applicationDbContext.KeysLists
                .Include(a => a.AddedBy)
                .Include(a => a.VariableKeys)
                .Include(a => a.NumericKeys)
                .FirstOrDefaultAsync(a => a.Id == VM.Id);

            if(KeysList is null)
                return NotFound("List not found");

            return Ok(_mapper.Map<KeysList, KeysListViewModel>(KeysList));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ReassignKeys([FromBody] KeysListViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            var KeysList = await _applicationDbContext.KeysLists
                .FirstOrDefaultAsync(a => a.Id == VM.Id);

            if (KeysList is null)
                return NotFound("List not found");

            var NKeys = await _applicationDbContext.NumericKeys
                .Where(k => VM.NumericKeys.Any(a => a.Id == k.Id))
                .ToListAsync();

            var VKeys = await _applicationDbContext.VariableKeys
                .Where(k => VM.VariableKeys.Any(a => a.Id == k.Id))
                .ToListAsync();

            if (!NKeys.Any() && !VKeys.Any())
                return BadRequest("Please select keys");

            var KeyDatapools = NKeys.Select(a => a.DataPoolId).ToList();
            KeyDatapools.AddRange(VKeys.Select(a => a.DataPoolId));

            if (KeyDatapools.Distinct().Count() != 1)
                return BadRequest("Datapool inconsistency");

            if (KeyDatapools.FirstOrDefault() != KeysList.DataPoolId)
                return BadRequest("Datapool inconsistency");

            foreach(var k in NKeys)
            {
                k.KeysListId = KeysList.Id;
            }

            foreach (var k in VKeys)
            {
                k.KeysListId = KeysList.Id;
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchKeyLists_ADVANCED_PORTAL([FromBody] KeysListSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            Expression<Func<KeysList, bool>> Criteria = m =>
               (!string.IsNullOrEmpty(VM.Code) ? m.Code.ToLower().Contains(VM.Code.ToLower()) : true) 
               && m.DataPoolId == VM.DataPoolId;



            var CodesNumbers = await _applicationDbContext.KeysLists
              .Where(Criteria)
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

            var KeysLists = await _applicationDbContext.KeysLists
                .Where(Criteria)
                .Include(m => m.AddedBy)
                /*.Include(m => m.Owners)
                .ThenInclude(o => o.Owner)*/
                .OrderBy(q => q.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)

                .ToListAsync();

            var Ids = await _applicationDbContext.KeysLists
               .Where(Criteria)
              .OrderBy(q => q.Code)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
            {
                NumberOfKeysList = CodesNumbers.Count,
                KeysList = _mapper.Map<List<KeysList>, List<KeysListViewModel>>(KeysLists),
                Ids = Ids,
                Codes = Codes

            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchKeyListAssignedKeys_ADVANCED_PORTAL([FromBody] KeysListSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            var NCodesNumbers = await _applicationDbContext.NumericKeys
              .Where(m =>
              VM.GetNumeric &&
              (!string.IsNullOrEmpty(VM.Code) ? (m.Code.Contains(VM.Code) || m.TextPresentation.Contains(VM.Code)) : true)
              &&
              (VM.ListId.HasValue ? (VM.Assigned ? VM.ListId == m.KeysListId : VM.ListId != m.KeysListId) : false)

              )
              .OrderBy(q => q.Code)
              .Select(q => q.Code[0])
              .ToListAsync();

            var VCodesNumbers = await _applicationDbContext.VariableKeys
              .Where(m =>
              !VM.GetNumeric &&
              (!string.IsNullOrEmpty(VM.Code) ? (m.Code.Contains(VM.Code) || m.TextPresentation.Contains(VM.Code)) : true)
              &&
              (VM.ListId.HasValue ? (VM.Assigned ? VM.ListId == m.KeysListId : VM.ListId != m.KeysListId) : false)

              )
              .OrderBy(q => q.Code)
              .Select(q => q.Code[0])
              .ToListAsync();

            var Codes = new List<Code_Number>();

            foreach (var c in NCodesNumbers)
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

            foreach (var c in VCodesNumbers)
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

            var NKeys = await _applicationDbContext.NumericKeys
                .Where(m =>
                 VM.GetNumeric &&
                (!string.IsNullOrEmpty(VM.Code) ? (m.Code.Contains(VM.Code) || m.TextPresentation.Contains(VM.Code)) : true)
                 &&
              (VM.ListId.HasValue ? (VM.Assigned ? VM.ListId == m.KeysListId : VM.ListId != m.KeysListId) : false)
                )
                .OrderBy(q => q.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)
                .Select(q => new
                {
                    Id = q.Id,
                    Code = q.Code,
                    TextPresentation = q.TextPresentation,
                    Type = KeyboardController.NUMERIC_KEY_TYPE
                })
                .ToListAsync();

            var VKeys = await _applicationDbContext.VariableKeys
                .Where(m =>
                !VM.GetNumeric &&
                (!string.IsNullOrEmpty(VM.Code) ? (m.Code.Contains(VM.Code) || m.TextPresentation.Contains(VM.Code)) : true)
                 &&
              (VM.ListId.HasValue ? (VM.Assigned ? VM.ListId == m.KeysListId : VM.ListId != m.KeysListId) : false)
                )

                .OrderBy(q => q.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)
                .Select(q => new
                {
                    Id = q.Id,
                    Code = q.Code,
                    TextPresentation = q.TextPresentation,
                    Type = KeyboardController.VARIABLE_KEY_TYPE
                })
                .ToListAsync();

            var NIds = await _applicationDbContext.NumericKeys
              .Where(m =>
              VM.GetNumeric &&

               (!string.IsNullOrEmpty(VM.Code) ? (m.Code.Contains(VM.Code) || m.TextPresentation.Contains(VM.Code)) : true)
              &&
              (VM.ListId.HasValue ? (VM.Assigned ? VM.ListId == m.KeysListId : VM.ListId != m.KeysListId) : false)
              )
              .OrderBy(q => q.Code)
              .Select(q => q.Id)
              .ToListAsync();

            var VIds = await _applicationDbContext.NumericKeys
              .Where(m =>
              !VM.GetNumeric &&

               (!string.IsNullOrEmpty(VM.Code) ? (m.Code.Contains(VM.Code) || m.TextPresentation.Contains(VM.Code)) : true)
              &&
              (VM.ListId.HasValue ? (VM.Assigned ? VM.ListId == m.KeysListId : VM.ListId != m.KeysListId) : false)
              )
              .OrderBy(q => q.Code)
              .Select(q => q.Id)
              .ToListAsync();

            NIds.AddRange(VIds);
            NKeys.AddRange(VKeys);

            return Ok(new
            {
                NumberOfListAssignedKeys = NCodesNumbers.Count + VCodesNumbers.Count,
                ListAssignedKeys = NKeys,
                Ids = NIds,
                Codes = Codes

            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddList([FromBody] AddKeysListViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == VM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check if code is null
            if (string.IsNullOrEmpty(VM.Code))
                return BadRequest("Code cannot be empty");

            var CodeExists = await _applicationDbContext.KeysLists
                .AnyAsync(i => i.Code == VM.Code);

            if (CodeExists)
                return BadRequest("Code already exists");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var List = new KeysList()
            {
                Code = VM.Code,
                AddedById = Owner.Id,
                DataPoolId = DATA_POOL.Id
            };

            _applicationDbContext.KeysLists.Add(List);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateCode(int ListId, string Code, int DataPoolId)
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

            var CodeExists = await _applicationDbContext.KeysLists
                .AnyAsync(i => i.Code == Code && i.DataPoolId == DATA_POOL.Id);

            if (CodeExists)
                return BadRequest("Code already exists");

            var List = await _applicationDbContext.KeysLists
                .FirstOrDefaultAsync(l => l.Id == ListId);

            if (List is null)
                return NotFound("List not found");

            List.Code = Code;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

    }
}
