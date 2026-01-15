using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.DefaultValues.Keyboard;
using QuizAPI.Models.DefaultValues.Keyboard.ViewModels;
using QuizAPI.Models.Ownership;
using QuizAPI.Models.Questions;
using QuizAPI.Models.Questions.EnergyBalanceQuestion;
using QuizAPI.Models.Questions.EnergyBalanceQuestion.ViewModels;
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
    public class KeyboardController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;

        private readonly string PROCESS_PATH = @"C:\Users\Administrator\source\repos\ImageSaver\ImageSaver\bin\Release\netcoreapp3.1\ImageSaver.exe";

        public static int NUMERIC_KEY_TYPE = +1;
        public static int VARIABLE_KEY_TYPE = +2;

        public KeyboardController(
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

        [HttpGet("[action]/{DPId}")]
        public async Task<IActionResult> GetAllNumericKeys(int DPId)
        {
            var NKeys = await _applicationDbContext.NumericKeys
                .Include(a => a.KeysList)
                .Where(a => a.DataPoolId == DPId)
               .ToListAsync();


            return Ok(NKeys);
        }

        [HttpGet("[action]/{DPId}")]
        public async Task<IActionResult> GetAllVariableKeys(int DPId)
        {
            var NKeys = await _applicationDbContext.VariableKeys
                .Include(a => a.KeysList)
                .Where(a => a.DataPoolId == DPId)
                .Select(a => new
                {
                    Code = a.Code,
                    TextPresentation = a.TextPresentation,
                    KeysList = a.KeysList,
                    VImages = a.Images.Select(x => x.TextPresentation)
                })
               .ToListAsync();


            return Ok(NKeys);
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> SearchKeyoards_ADVANCED_PORTAL([FromBody] KeyboardsSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            Expression<Func<Keyboard, bool>> Criteria = m =>
             m.DataPoolId == VM.DataPoolId &&
                (!string.IsNullOrEmpty(VM.Code) ? m.Name.ToLower().Contains(VM.Code.ToLower()) : true);

            var CodesNumbers = await _applicationDbContext.Keyboards
              .Where(Criteria)
              .OrderBy(q => q.Name)
              .Select(q => q.Name[0])
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

            var Keyboards = await _applicationDbContext.Keyboards
                .Where(Criteria)
                .Include(k => k.Owners)
                .ThenInclude(o => o.Owner)
                .Include(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)
                .Include(k => k.VariableKeys)
                .ThenInclude(vk => vk.VariableKey)
                .ThenInclude(vk => vk.VariablesChars)

                .Include(k => k.VariableKeys)
                .ThenInclude(vk => vk.VariableKey)
                .ThenInclude(vk => vk.Images)

                .Include(k => k.VariableKeyImages)

                .OrderBy(q => q.Name)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)

                .ToListAsync();

            var Ids = await _applicationDbContext.Keyboards
              .Where(Criteria)
              .OrderBy(q => q.Name)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
            {
                NumberOfKeyboards = CodesNumbers.Count,
                Keyboards = _mapper.Map<List<Keyboard>, List<KeyboardViewModel>>(Keyboards),
                Ids = Ids,
                Codes = Codes

            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchKeyoards_ADVANCED_UPDATED_PORTAL([FromBody] KeyboardsSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            Expression<Func<Keyboard, bool>> Critera = (k) =>
            (
                k.DataPoolId == VM.DataPoolId &&
                (!string.IsNullOrEmpty(VM.Code) ? k.Name.ToLower().Contains(VM.Code.ToLower()) : true) &&
                (VM.KeyLists.Any() ? k.NumericKeys.Any(nk => VM.KeyLists.Any(kl => kl == nk.NumericKey.KeysListId)) : true) &&
               (VM.KeyLists.Any() ? k.VariableKeys.Any(vk => VM.KeyLists.Any(kl => kl == vk.VariableKey.KeysListId)) : true)
            );

            var CodesNumbers = await _applicationDbContext.Keyboards
              .Where(Critera)
              .OrderBy(q => q.Name)
              .Select(q => q.Name[0])
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

            var Keyboards = await _applicationDbContext.Keyboards
                .Where(Critera)
                .Include(k => k.Owners)
                .ThenInclude(o => o.Owner)

                .Include(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)
                .ThenInclude(nkk => nkk.KeysList)

                .Include(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)

                .Include(k => k.VariableKeys)
                .ThenInclude(vk => vk.VariableKey)

                .Include(k => k.KeyboardQuestions)
                .ThenInclude(kq => kq.SeriesElements)
                .ThenInclude(se => se.Series)

                 .Include(k => k.KeyboardQuestions)
                .ThenInclude(kq => kq.Subtopic)
                .ThenInclude(st => st.Topic)

                .OrderBy(q => q.Name)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)

                .ToListAsync();

    

            var Ids = await _applicationDbContext.Keyboards
              .Where(Critera)
              .OrderBy(q => q.Name)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
            {
                NumberOfKeyboards = CodesNumbers.Count,
                Keyboards = _mapper.Map<List<Keyboard>, List<KeyboardViewModel>>(Keyboards),
                Ids = Ids,
                Codes = Codes

            });
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> SearchKeyoardsByIds_ADVANCED([FromBody] SearchKeyboardsByIdViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            Expression<Func<Keyboard, bool>> Critera = (k) => (VM.Ids.Any(id => id == k.Id));

            var Keyboards = await _applicationDbContext.Keyboards
                .Where(Critera)
                .Include(k => k.Owners)
                .ThenInclude(o => o.Owner)

                .Include(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)
                .ThenInclude(nkk => nkk.KeysList)

                .Include(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)

                .Include(k => k.VariableKeys)
                .ThenInclude(vk => vk.VariableKey)

                .Include(k => k.KeyboardQuestions)
                .ThenInclude(kq => kq.SeriesElements)
                .ThenInclude(se => se.Series)

                 .Include(k => k.KeyboardQuestions)
                .ThenInclude(kq => kq.Subtopic)
                .ThenInclude(st => st.Topic)
                .OrderBy(q => q.Name)

                .ToListAsync();

            return Ok(new
            {
                NumberOfKeyboards = VM.NumberOfKeyboards,
                Keyboards = _mapper.Map<List<Keyboard>, List<KeyboardViewModel>>(Keyboards),
                Ids = VM.KeyboardIds,
                Codes = VM.Codes

            });

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchKeysByIds_ADVANCED([FromBody] SearchKeysByIdViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");
    
            var NKeys = await _applicationDbContext.NumericKeys
                .Where(q => VM.Type == NUMERIC_KEY_TYPE && VM.Ids.Any(Id => Id == q.Id))
                 .Include(k => k.Relations)
                 .ThenInclude(r => r.AnswerElements)
                 .Include(k => k.KeysList)
                 .OrderBy(q => q.Code)
                 .Select(q => new
              {
                  DateCreated = q.DateCreated,
                  Id = q.Id,
                  Code = q.Code,
                  TextPresentation = q.TextPresentation,
                  Used = q.Relations.Select(r => r.AnswerElements.Count).Sum(),
                  Type = NUMERIC_KEY_TYPE,
                  List = q.KeysList.Code,
                  VarKeys = new List<VariableKeyVariableCharValidValuesGroupChoiceImageViewModel>()
              })
                 .ToListAsync();

            var VKeys = await _applicationDbContext.VariableKeys
                .Where(q => VM.Type == VARIABLE_KEY_TYPE && VM.Ids.Any(Id => Id == q.Id))
                .Include(k => k.Images)
                .ThenInclude(i => i.AnswerElements)
                .Include(k => k.KeysList)
                .OrderBy(q => q.Code)
                .Select(q => new
                {
                    DateCreated = q.DateCreated,
                    Id = q.Id,
                    Code = q.Code,
                    TextPresentation = q.TextPresentation,
                    Used = q.Images.Select(r => r.AnswerElements.Count).Sum(),
                    Type = VARIABLE_KEY_TYPE,
                    List = q.KeysList.Code,
                    VarKeys = _mapper.Map<List<VariableKeyVariableCharValidValuesGroupChoiceImageViewModel>>(q.Images)
                })
                .ToListAsync();

            NKeys.AddRange(VKeys);

            return Ok(new
            {
                NumberOfKeys = VM.NumberOfKeys,
                Keys = NKeys,
                Ids = VM.KeyIds,
                Codes = VM.Codes

            });

        }



        [HttpPost("[action]")]
        public async Task<IActionResult> SearchKeys_ADVANCED_PORTAL([FromBody] KeysSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            Expression<Func<KeyboardNumericKey, bool>> Criteria1 = m =>
                 m.DataPoolId == VM.DataPoolId &&
               VM.GetNumeric &&
               (!string.IsNullOrEmpty(VM.Code) ? (m.Code.ToLower().Contains(VM.Code.ToLower()) || m.TextPresentation.ToLower().Contains(VM.Code.ToLower())) : true)
               &&
               (VM.ListId.HasValue ? VM.ListId == m.KeysListId : true);




            Expression<Func<KeyboardVariableKey, bool>> Criteria2 = m =>
               m.DataPoolId == VM.DataPoolId &&
              !VM.GetNumeric &&
              (!string.IsNullOrEmpty(VM.Code) ? (m.Code.Contains(VM.Code) || m.TextPresentation.Contains(VM.Code)) : true)
              &&
              (VM.ListId.HasValue ? VM.ListId == m.KeysListId : true);

            var NCodesNumbers = await _applicationDbContext.NumericKeys
              .Where(Criteria1)
              .OrderBy(q => q.Code)
              .Select(q => q.Code[0])
              .ToListAsync();

            var VCodesNumbers = await _applicationDbContext.VariableKeys
              .Where(Criteria2)
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
                .Where(Criteria1)
                .Include(k => k.Relations)
                .ThenInclude(r => r.AnswerElements)
                .Include(k => k.KeysList)
                .OrderBy(q => q.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)
                .Select(q => new
                {
                    DateCreated = q.DateCreated,
                    Id = q.Id,
                    Code = q.Code,
                    TextPresentation = q.TextPresentation,
                    Used = q.Relations.Select(r => r.AnswerElements.Count).Sum(),
                    Type = NUMERIC_KEY_TYPE,
                    List = q.KeysList.Code,
                    VarKeys = new List<VariableKeyVariableCharValidValuesGroupChoiceImageViewModel>()
                })
                .ToListAsync();

            var VKeys = await _applicationDbContext.VariableKeys
                .Where(Criteria2)
                .Include(k => k.Images)
                .ThenInclude(i => i.AnswerElements)
                .Include(k => k.KeysList)
                .OrderBy(q => q.Code)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)
                .Select(q => new
                {
                    DateCreated = q.DateCreated,
                    Id = q.Id,
                    Code = q.Code,
                    TextPresentation = q.TextPresentation,
                    Used = q.Images.Select(r => r.AnswerElements.Count).Sum(),
                    Type = VARIABLE_KEY_TYPE,
                    List = q.KeysList.Code,
                    VarKeys = _mapper.Map<List<VariableKeyVariableCharValidValuesGroupChoiceImageViewModel>>(q.Images)
                })
                .ToListAsync();

            var NIds = await _applicationDbContext.NumericKeys
                .Where(Criteria1)
              .OrderBy(q => q.Code)
              .Select(q => q.Id)
              .ToListAsync();

            var VIds = await _applicationDbContext.VariableKeys
              .Where(Criteria2)
              .OrderBy(q => q.Code)
              .Select(q => q.Id)
              .ToListAsync();

            NIds.AddRange(VIds);
            NKeys.AddRange(VKeys);

            return Ok(new
            {
                NumberOfKeys = NCodesNumbers.Count + VCodesNumbers.Count,
                Keys = NKeys,
                Ids = NIds,
                Codes = Codes

            });
        }

        
        [HttpPost("[action]")]
        public async Task<IActionResult> SearchOwnedKeyoards_ADVANCED_PORTAL([FromBody] KeyboardsSearchViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var CodesNumbers = await _applicationDbContext.Keyboards
              .Where(m => m.Owners.Any(o => o.OwnerId == Owner.Id) && m.DataPoolId == VM.DataPoolId)
              .OrderBy(q => q.Name)
              .Select(q => q.Name[0])
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

            var Keyboards = await _applicationDbContext.Keyboards
              .Where(m => m.Owners.Any(o => o.OwnerId == Owner.Id) && m.DataPoolId == VM.DataPoolId)
                .Include(k => k.Owners)
                .ThenInclude(o => o.Owner)

                .Include(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)
                .ThenInclude(nkk => nkk.KeysList)

                .Include(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)

                .Include(k => k.VariableKeys)
                .ThenInclude(vk => vk.VariableKey)

                .Include(k => k.KeyboardQuestions)
                .ThenInclude(kq => kq.SeriesElements)
                .ThenInclude(se => se.Series)

                 .Include(k => k.KeyboardQuestions)
                .ThenInclude(kq => kq.Subtopic)
                .ThenInclude(st => st.Topic)

                .OrderBy(q => q.Name)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)

                .ToListAsync();

            var Ids = await _applicationDbContext.Keyboards
              .Where(m => m.Owners.Any(o => o.OwnerId == Owner.Id) && m.DataPoolId == VM.DataPoolId)
              .OrderBy(q => q.Name)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
            {
                NumberOfKeyboards = CodesNumbers.Count,
                Keyboards = _mapper.Map<List<Keyboard>, List<KeyboardViewModel>>(Keyboards),
                Ids = Ids,
                Codes = Codes

            });
        }


        [HttpGet("[action]/{DatapoolId}")]
        public async Task<IActionResult> GetAllKeyboards(int DatapoolId)
        {
            var Keyboards = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)
                .Include(k => k.VariableKeys)
                .ThenInclude(vk => vk.VariableKey)
                .ThenInclude(vk => vk.VariablesChars)

                .Include(k => k.VariableKeys)
                .ThenInclude(vk => vk.VariableKey)
                .ThenInclude(vk => vk.Images)

                .Include(k => k.VariableKeyImages)

                .Include(k => k.Owners)
                .ThenInclude(o => o.Owner)
                .Where(k => k.DataPoolId == DatapoolId)
                .Select(k => new
                {
                    Name = k.Name,

                    NumericKeys = k.NumericKeys.Select(a => new KeyValuePair<int, string>(a.Order,a.NumericKey.Code)),

                    VariableKeys = k.VariableKeys.Select(a => new KeyValuePair<int, string>(a.Order, a.VariableKey.Code)),
                })
                .ToListAsync();

            return Ok(Keyboards);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllKeyboards_PORTAL_SIMPLE()
        {
            var Keyboards = await _applicationDbContext.Keyboards
                .Include(k => k.Owners)
                .ThenInclude(o => o.Owner)
                .Include(k => k.KeyboardQuestions)

                .ToListAsync();

            return Ok(_mapper.Map<List<Keyboard>, List<KeyboardViewModel>>(Keyboards));
        }

        [HttpGet("[action]/{KeyboardId}")]
        public async Task<IActionResult> GetKeyboard(int KeyboardId)
        {
            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)

                .Include(k => k.VariableKeys)
                .ThenInclude(vk => vk.VariableKey)
                .ThenInclude(key => key.VariablesChars)
                .FirstOrDefaultAsync(k => k.Id == KeyboardId);

            return Ok(_mapper.Map<Keyboard, KeyboardViewModel>(Keyboard));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetQuestionsForKeyboardKey([FromBody] GetKeyboardKeyRelationsViewModel VM)
        {

            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)

                .Include(k => k.VariableKeys)
                .ThenInclude(nk => nk.VariableKey)

                .Include(k => k.VariableKeyImages)
                .FirstOrDefaultAsync(k => k.Id == VM.KeyboardId);

            if (Keyboard is null)
                return NotFound("Not Found");

            var KeyboardQuestions = new List<KeyboardQuestion>();
            var EBQuestions = new List<EnergyBalanceQuestion>();

            if (VM.IsNumericKey)
            {
                var Key = Keyboard.NumericKeys.FirstOrDefault(nk => nk.Id == VM.KeyRelationId);

                if (Key is null)
                    return NotFound("Relation Not Found");

                KeyboardQuestions = await _applicationDbContext.KeyboardQuestion
                    .Where(kq => kq.Answers.Any(a => a.AnswerElements.Any(ae => ae.NumericKeyId == Key.Id)))
                    .ToListAsync();

                EBQuestions = await _applicationDbContext.EnergyBalanceQuestion
                    .Where(kq =>
                    kq.BoundryConditions.Any(bc => bc.Answers.Any(a => a.AnswerElements.Any(ae => ae.NumericKeyId == Key.Id)))
                    ||
                    kq.Questions.Any(q => q.Answers.Any(a => a.AnswerElements.Any(ae => ae.NumericKeyId == Key.Id))))
                    .ToListAsync();
            }
            else
            {
                var Key = Keyboard.VariableKeys.FirstOrDefault(nk => nk.Id == VM.KeyRelationId);

                if (Key is null)
                    return NotFound("Relation Not Found");

                KeyboardQuestions = await _applicationDbContext.KeyboardQuestion
                    .Where(kq => kq.Answers.Any(a => a.AnswerElements.Any(ae => ae.Image.Image.Key.Relations.Any(r => r.Id == Key.VariableKeyId))))
                    .ToListAsync();

                EBQuestions = await _applicationDbContext.EnergyBalanceQuestion
                    .Where(kq =>
                     kq.BoundryConditions.Any(bc => bc.Answers.Any(a => a.AnswerElements.Any(ae => ae.Image.Image.Key.Relations.Any(r => r.Id == Key.VariableKeyId))))
                    ||
                    kq.Questions.Any(q => q.Answers.Any(a => a.AnswerElements.Any(ae => ae.Image.Image.Key.Relations.Any(r => r.Id == Key.VariableKeyId)))))
                  .ToListAsync();

            }

            return Ok(new {
                KeyboardQuestions = _mapper.Map<List<KeyboardQuestion>,
                List<KeyboardQuestionViewModel>>(KeyboardQuestions),

                EnergyBalanceQuestions = _mapper.Map<List<EnergyBalanceQuestion>,
                List<EnergyBalanceQuestionViewModel>>(EBQuestions),
            });
        }

        [HttpGet("[action]/{KeyboardId}")]
        public async Task<IActionResult> GetKeyboard_PORTAL_VIEW_EDIT(int KeyboardId)
        {
            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.Owners)
                .ThenInclude(o => o.Owner)

                .Include(k => k.NumericKeys)
                .ThenInclude(nk => nk.NumericKey)

                .Include(k => k.NumericKeys)
                .ThenInclude(nk => nk.AnswerElements)

                .Include(k => k.VariableKeys)
                .ThenInclude(vk => vk.VariableKey)

                .Include(k => k.VariableKeyImages)
                .ThenInclude(vk => vk.AnswerElements)

                .Include(k => k.VariableKeyImages)
                .ThenInclude(vk => vk.Image)

                .Include(k => k.KeyboardQuestions)
                .FirstOrDefaultAsync(k => k.Id == KeyboardId);

            return Ok(_mapper.Map<Keyboard, KeyboardViewModel>(Keyboard));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddKeyboardNumericKey([FromBody] KeyboardNumericKeyViewModel KeyVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == KeyVM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check Code not Null
            if (string.IsNullOrEmpty(KeyVM.Code))
                return BadRequest("Code Can't Be Empty");

            //Check LATEX Code not Null
            if (string.IsNullOrEmpty(KeyVM.TextPresentation))
                return BadRequest("Latex Code Can't Be Empty");

            if(!KeyVM.KeysListId.HasValue)
                return BadRequest("Please select a key list");


            //Check Code Not Taken
            var CodeTaken = await _applicationDbContext.NumericKeys
                .AnyAsync(k => k.Code == KeyVM.Code && k.DataPoolId == DATA_POOL.Id) 
                ||
                            await _applicationDbContext.VariableKeys
                .AnyAsync(k => k.Code == KeyVM.Code && k.DataPoolId == DATA_POOL.Id);

            if (CodeTaken)
                return BadRequest("Code Taken, Choose Different Code");

            //Check Latex Code Unique 
            var LatexCodeUnique = await _applicationDbContext.NumericKeys
                .FirstOrDefaultAsync(k => k.TextPresentation == KeyVM.TextPresentation && k.DataPoolId == DATA_POOL.Id);

            if (LatexCodeUnique != null)
                return BadRequest($"Latex Code Taken By {LatexCodeUnique.Code}");

            var List = await _applicationDbContext.KeysLists
                .FirstOrDefaultAsync(l => l.Id == KeyVM.KeysListId.Value && l.DataPoolId == DATA_POOL.Id);

            if (List is null)
                return BadRequest("List not found");

            //Check Numeric Key IsInteger
            var IsInteger = int.TryParse(KeyVM.TextPresentation, out _);

           RestClient client = new RestClient("https://math.now.sh/?");
           XmlDocument doc = new XmlDocument();

            var DB_filename = Path.Combine(
                           "NumericKeys",
                           $"{Path.GetRandomFileName()}.jpg");

            var filename = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    DB_filename);

            int Width = 0;
            int Height = 0;

            var save_result = SaveLatex(client, doc, KeyVM.TextPresentation, filename, out Width, out Height);

            if (save_result.Key != System.Net.HttpStatusCode.OK)
            {
                return BadRequest(save_result.Value);
            }

            //Create Key
            var Key = new KeyboardNumericKey()
            {
                Code = KeyVM.Code,
                TextPresentation = KeyVM.TextPresentation,
                IsInteger = IsInteger,
                URL = DB_filename,
                Width = Width,
                Height = Height,
                KeysListId = List.Id,
                DataPoolId = DATA_POOL.Id
            };


            _applicationDbContext.NumericKeys.Add(Key);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<KeyboardNumericKey, KeyboardNumericKeyViewModel>(Key));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditKeyboardNumericKey([FromBody] KeyboardNumericKeyViewModel KeyVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == KeyVM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check Code not Null
            if (string.IsNullOrEmpty(KeyVM.Code))
                return BadRequest("Code Can't Be Empty");

            //Check LATEX Code not Null
            if (string.IsNullOrEmpty(KeyVM.TextPresentation))
                return BadRequest("Latex Code Can't Be Empty");

            //Check Key
            var Key = await _applicationDbContext.NumericKeys
                .FirstOrDefaultAsync(k => k.Id == KeyVM.Id && k.DataPoolId == DATA_POOL.Id);

            if (Key is null)
                return NotFound("Not Found");

            //Check Code Not Taken
            var CodeTaken = await _applicationDbContext.NumericKeys
                .AnyAsync(k => k.Code == KeyVM.Code && k.Id != Key.Id && k.DataPoolId == DATA_POOL.Id)
                ||
                            await _applicationDbContext.VariableKeys
                .AnyAsync(k => k.Code == KeyVM.Code && k.Id != Key.Id && k.DataPoolId == DATA_POOL.Id);

            if (CodeTaken)
                return BadRequest("Code Taken, Choose Different Code");

            //Check Latex Code Unique 
            var LatexCodeUnique = await _applicationDbContext.NumericKeys
                .FirstOrDefaultAsync(k => k.TextPresentation == KeyVM.TextPresentation && k.Id != Key.Id && k.DataPoolId == DATA_POOL.Id);

            if (LatexCodeUnique != null)
                return BadRequest($"Latex Code Taken By {LatexCodeUnique.Code}");

            //Create Key
            Key.Code = KeyVM.Code;
            Key.TextPresentation = KeyVM.TextPresentation;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveKeyboardNumericKey([FromBody] KeyboardNumericKeyViewModel KeyVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            var Key = await _applicationDbContext.NumericKeys
                .Include(k => k.Relations)
                .ThenInclude(r => r.AnswerElements)
                .FirstOrDefaultAsync(k => k.Id == KeyVM.Id);

            if (Key is null)
                return NotFound("Not Found");

            if (Key.Relations.Select(r => r.AnswerElements.Count).Sum() != 0)
                return BadRequest("Key Used, Can't Be Deleted");

            _applicationDbContext.NumericKeys.Remove(Key);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveKeyboardVariableKey([FromBody] KeyboardNumericKeyViewModel KeyVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            var Key = await _applicationDbContext.VariableKeys
                .Include(k => k.Images)
                .ThenInclude(r => r.AnswerElements)
                .FirstOrDefaultAsync(k => k.Id == KeyVM.Id);

            if (Key is null)
                return NotFound("Not Found");
            
            if (Key.Images.Select(r => r.AnswerElements.Count).Sum() != 0)
                return BadRequest("Key Used, Can't Be Deleted");

            _applicationDbContext.VariableKeys.Remove(Key);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveKeyboardVariableKeyImage([FromBody] VariableKeyVariableCharValidValuesGroupChoiceImageViewModel KeyVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            var Key = await _applicationDbContext.VariableKeys
                .Include(k => k.Images)
                .ThenInclude(r => r.AnswerElements)
                .FirstOrDefaultAsync(k => k.Id == KeyVM.KeyId);

            if (Key is null)
                return NotFound("Not Found");

            var Image = Key.Images.FirstOrDefault(i => i.Id == KeyVM.Id);

            if (Image is null)
                return NotFound("Not Found");

            if (Image.AnswerElements.Count != 0)
                return BadRequest("Key Image Used, Can't Be Deleted");

            Key.Images.Remove(Image);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllNumericKeys()
        {
            var Keys = await _applicationDbContext.NumericKeys
                .ToListAsync();

            return Ok(_mapper.Map<List<KeyboardNumericKey>, List<KeyboardNumericKeyViewModel>>(Keys));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllNumericKeys_PORTAL()
        {
            var Keys = await _applicationDbContext.NumericKeys
                .Include(k => k.Relations)
                .ThenInclude(r => r.AnswerElements)
                .ToListAsync();

            return Ok(Keys.OrderBy(k => k.Code).Select(k => new {
                Key = _mapper.Map<KeyboardNumericKey, KeyboardNumericKeyViewModel>(k),
                NumberUsed = k.Relations.Select(r => r.AnswerElements.Count).Sum()
            }));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddKeyboardVariableKey([FromBody] KeyboardVariableKeyViewModel KeyVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == KeyVM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check Code not Null
            if (string.IsNullOrEmpty(KeyVM.Code))
                return BadRequest("Code Can't Be Empty");

            //Check LATEX Code not Null
            if (string.IsNullOrEmpty(KeyVM.TextPresentation))
                return BadRequest("Latex Code Can't Be Empty");

            if(!KeyVM.KeysListId.HasValue)
                return BadRequest("Please select a key list");

            //Check Code Not Taken
            var CodeTaken = await _applicationDbContext.NumericKeys
                .AnyAsync(k => k.Code == KeyVM.Code && k.DataPoolId == DATA_POOL.Id)
                ||
                            await _applicationDbContext.VariableKeys
                .AnyAsync(k => k.Code == KeyVM.Code && k.DataPoolId == DATA_POOL.Id);

            if (CodeTaken)
                return BadRequest("Code Taken, Choose Different Code");

            //Check Latex Code Unique 
            var LatexCodeUnique = await _applicationDbContext.VariableKeys
                .FirstOrDefaultAsync(k => k.TextPresentation == KeyVM.TextPresentation && k.DataPoolId == DATA_POOL.Id);

            if (LatexCodeUnique != null)
                return BadRequest($"Latex Code Taken By {LatexCodeUnique.Code}");

            //Check Has Variables
            //if (!KeyVM.VariablesChars.Any())
            //    return BadRequest("Please Provide Variables");

            //Check Has Variables
            //if (KeyVM.VariablesChars.Count() != KeyVM.VariablesChars.Distinct().Count())
            //    return BadRequest("Some Variables are Repeated");

            //Check all Varibale Chars are in Latex Code
            //if (KeyVM.VariablesChars.Any(v => !KeyVM.TextPresentation.Contains(v.VariableChar)))
            //    return BadRequest("Atleast One Variable Does Not Exist In Latex Code");

            //Check All Variables Have Valid Values
            if (!KeyVM.Images.Any())
                return BadRequest("Please Provide Values for Images");

            var List = await _applicationDbContext.KeysLists
               .FirstOrDefaultAsync(l => l.Id == KeyVM.KeysListId.Value && l.DataPoolId == DATA_POOL.Id);

            if (List is null)
                return BadRequest("List not found");

            var Image_Files = new List<Key_Info>();

            RestClient client = new RestClient("https://math.now.sh/?");
           XmlDocument doc = new XmlDocument();
            var ImagePresentation = "";

            ImagePresentation = Path.Combine(
                           "VariableChoices",
                           $"{Path.GetRandomFileName()}.jpg");

            var filename = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    ImagePresentation);

            int BWidth = 0;
            int BHeight = 0;

            var save_result = SaveLatex(client, doc, KeyVM.TextPresentation, filename, out BWidth, out BHeight);

            if (save_result.Key != System.Net.HttpStatusCode.OK)
            {
                return BadRequest(save_result.Value);
            }

            foreach (var i in KeyVM.Images)
           {

                var DB_filename = Path.Combine(
                          "VariableChoices",
                          $"{Path.GetRandomFileName()}.jpg");

                filename = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        DB_filename);

                int Width = 0;
                int Height = 0;

                save_result = SaveLatex(client, doc, i, filename, out Width, out Height);

                if (save_result.Key != System.Net.HttpStatusCode.OK)
                {
                    return BadRequest(save_result.Value);
                }
                var KInfo = new Key_Info() 
                {
                    File = DB_filename,
                    Width = Width,
                    Height = Height,
                    TextPresentation = i,

                };

                Image_Files.Add(KInfo);
            }

            //Create Key
            var Key = new KeyboardVariableKey()
            {
                Code = KeyVM.Code,
                TextPresentation = KeyVM.TextPresentation,
                ImagePresentation = ImagePresentation,
                Width = BWidth,
                Height = BHeight,
                VariablesChars = KeyVM.VariablesChars.Select(v => new VariableKeyVariableChar()
                {
                    VariableChar = v.VariableChar, 
                    DataPoolId = DATA_POOL.Id
                   
                }).ToList(),
                Images = Image_Files.Select(image => new VariableKeyVariableCharValidValuesGroupChoiceImage()
                {
                    URL = image.File,
                    Width = image.Width,
                    Height = image.Height,
                    TextPresentation = image.TextPresentation,
                    DataPoolId = DATA_POOL.Id
                }).ToList(),
                KeysListId = List.Id,
                DataPoolId = DATA_POOL.Id
            };
            
            _applicationDbContext.VariableKeys.Add(Key);
            await _applicationDbContext.SaveChangesAsync();
            
            return Ok(_mapper.Map<KeyboardVariableKey, KeyboardVariableKeyViewModel>(Key));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddKeyboardVariableKeyImage([FromBody] VariableKeyVariableCharValidValuesGroupChoiceImageViewModel KeyVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == KeyVM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var Key = await _applicationDbContext.VariableKeys
                .Include(k => k.Images)
                .FirstOrDefaultAsync(k => k.Id == KeyVM.KeyId && k.DataPoolId == DATA_POOL.Id);

            if (Key is null)
                return NotFound("Not Found");

            if (Key.Images.Any(i => i.TextPresentation == KeyVM.TextPresentation && i.DataPoolId == DATA_POOL.Id))
                return BadRequest("Already Exists");


            RestClient client = new RestClient("https://math.now.sh/?");
            XmlDocument doc = new XmlDocument();
            var ImagePresentation = "";

            ImagePresentation = Path.Combine(
                           "VariableChoices",
                           $"{Path.GetRandomFileName()}.jpg");

            var filename = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    ImagePresentation);

            int BWidth = 0;
            int BHeight = 0;

            var save_result = SaveLatex(client, doc, KeyVM.TextPresentation, filename, out BWidth, out BHeight);

            if (save_result.Key != System.Net.HttpStatusCode.OK)
            {
                return BadRequest(save_result.Value);
            }

            var Image = new VariableKeyVariableCharValidValuesGroupChoiceImage()
            {
                TextPresentation = KeyVM.TextPresentation,
                URL = ImagePresentation,
                Width = BWidth,
                Height = BHeight,
                DataPoolId = DATA_POOL.Id
            };

            Key.Images.Add(Image);

            var Keyboards = await _applicationDbContext.Keyboards
                .Where(k => k.VariableKeys.Any(vk => vk.VariableKeyId == Key.Id))
                .ToListAsync();

            foreach(var keyboard in Keyboards)
            {
                var CHARS = GetChars()
                .Where(c => !keyboard.NumericKeys.Any(k => k.KeySimpleForm == c)
                && !keyboard.VariableKeyImages.Any(k => k.ReplacementCharacter == c))
                .ToArray();

                keyboard.VariableKeyImages.Add(new KeyboardVariableKeyImageRelation()
                {
                    Image = Image,
                    ReplacementCharacter = CHARS[0],
                    DataPoolId = DATA_POOL.Id
                });
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditKeyboardVariableKey([FromBody] KeyboardVariableKeyViewModel KeyVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Data Not Valid");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == KeyVM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check Code not Null
            if (string.IsNullOrEmpty(KeyVM.Code))
                return BadRequest("Code Can't Be Empty");

            //Check Key
            var Key = await _applicationDbContext.VariableKeys
                .FirstOrDefaultAsync(k => k.Id == KeyVM.Id && k.DataPoolId == DATA_POOL.Id);

            if (Key is null)
                return NotFound("Not Found");

            //Check Code Not Taken
            var CodeTaken = await _applicationDbContext.NumericKeys
                .AnyAsync(k => k.Code == KeyVM.Code && k.Id != Key.Id && k.DataPoolId == DATA_POOL.Id)
                ||
                            await _applicationDbContext.VariableKeys
                .AnyAsync(k => k.Code == KeyVM.Code && k.Id != Key.Id && k.DataPoolId == DATA_POOL.Id);

            if (CodeTaken)
                return BadRequest("Code Taken, Choose Different Code");
           
            //Create Key
            Key.Code = KeyVM.Code;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllVariableKeys()
        {
            var Keys = await _applicationDbContext.VariableKeys
                .Include(k => k.Images)
                .ToListAsync();

            return Ok(Keys.OrderBy(k =>k.Code).Select(k => new {
                Key = _mapper.Map<KeyboardVariableKey, KeyboardVariableKeyViewModel>(k),
                NumberUsed = k.Images.Select(i => i.AnswerElements.Count).Sum()
            }));
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetQuestionsSpecificKeyboard(int Id)
        {
            var Keyboard = await _applicationDbContext.Keyboards
               
               .Include(k => k.KeyboardQuestions)
               .ThenInclude(q => q.Subtopic)
               .ThenInclude(st => st.Topic)

               .Include(k => k.KeyboardQuestions)
               .ThenInclude(q => q.LevelOfDifficulty)

               .Include(k => k.KeyboardQuestions)
               .ThenInclude(q => q.AddedBy)

               .FirstOrDefaultAsync(k => k.Id == Id);

            if (Keyboard is null)
                return NotFound("Not Found");

            var KeyboardQuestions = Keyboard.KeyboardQuestions;


            var EBQuestions = new List<EnergyBalanceQuestion>();

            EBQuestions = await _applicationDbContext.EnergyBalanceQuestion
                    .Where(kq =>
                    kq.BoundryConditionKeyboardId == Keyboard.Id
                    ||
                    kq.Questions.Any(q => q.KeyboardId == Keyboard.Id))
                    .ToListAsync();

            return Ok(new
            {
                KeyboardQuestions = _mapper.Map<List<KeyboardQuestion>,
                List<KeyboardQuestionViewModel>>(KeyboardQuestions),

                EnergyBalanceQuestions = _mapper.Map<List<EnergyBalanceQuestion>,
                List<EnergyBalanceQuestionViewModel>>(EBQuestions),
            });

        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllKeys()
        {
            var NKeys = await _applicationDbContext.NumericKeys
                .Include(k => k.Relations)
                .ThenInclude(r => r.AnswerElements)
                .OrderBy(n => n.Code)
               .ToListAsync();

            var VKeys = await _applicationDbContext.VariableKeys
                .OrderBy(n => n.Code)
                .Include(g => g.Images)
                .ThenInclude(i => i.AnswerElements)
                .ToListAsync();

            var Keys = new
            {
                NumericKeys = NKeys.Select(k => new {
                    Key = _mapper.Map<KeyboardNumericKey, KeyboardNumericKeyViewModel>(k),
                    NumberUsed = k.Relations.Select(r => r.AnswerElements.Count).Sum(),
                    R = k.Relations
                }),
                VariableKeys = VKeys.Select(k => new {
                    Key = _mapper.Map<KeyboardVariableKey, KeyboardVariableKeyViewModel>(k),
                    NumberUsed = k.Images.Select(i => i.AnswerElements.Count).Sum(),
                    R = k.Relations
                }),
            };

            return Ok(Keys);
        }

      
        [HttpPost("[action]")]
        public async Task<IActionResult> EditKeyboardName([FromBody] KeyboardViewModel KeyboardVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Name Not Taken 
            var NameTaken = await _applicationDbContext.Keyboards
                .AnyAsync(k => k.Name == KeyboardVM.Name && k.Id != KeyboardVM.Id);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            //Create Keyboard
            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.Owners)
                .FirstOrDefaultAsync(k => k.Id == KeyboardVM.Id);

            if (Keyboard is null)
                return NotFound();

            var User = await GetUser(_httpContextAccessor, _applicationDbContext);


            if (!Keyboard.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner");


            Keyboard.Name = KeyboardVM.Name;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddKeyboard([FromBody] KeyboardViewModel KeyboardVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == KeyboardVM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check Name not Null
            if (string.IsNullOrEmpty(KeyboardVM.Name))
                return BadRequest("Name Can't Be Empty");

            //Check Name Not Taken 
            var NameTaken = await _applicationDbContext.Keyboards
                .AnyAsync(k => k.Name == KeyboardVM.Name);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            if (KeyboardVM.KeysPerRow <= 0)
                return BadRequest("Keys Per Row Must Be Positive Number");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Create Keyboard
            var Keyboard = new Keyboard()
            {
                Name = KeyboardVM.Name,
                AddedBy = Owner,
                KeysPerRow = KeyboardVM.KeysPerRow,
                DataPoolId = DATA_POOL.Id
            };

            Keyboard.Owners.Add(new KeyboardOwner()
            {
                Owner = Owner,
                DataPoolId = DATA_POOL.Id
            });

            //Check Keys Exist
            var NKeys = await _applicationDbContext.NumericKeys
                .Where(k => KeyboardVM.NumericKeys.Any(kvm => k.Id == kvm.Id))
                .ToListAsync();

            if (NKeys.Count != KeyboardVM.NumericKeys.Distinct().Count())
                return BadRequest("Alteast One Numeric Key Doest Not Exist");

            //Check Keys Exist
            var VKeys = await _applicationDbContext.VariableKeys
                .Include(k => k.Images)
                .Where(k => KeyboardVM.VariableKeys.Any(kvm => k.Id == kvm.Id))
                .ToListAsync();

            if (VKeys.Count != KeyboardVM.VariableKeys.Distinct().Count())
                return BadRequest("Alteast One Variable Key Doest Not Exist");

            var CHARS = GetChars();

            Keyboard.NumericKeys.AddRange(NKeys.Select((k,i) => new KeyboardNumericKeyRelation()
            {
                NumericKeyId = k.Id,
                KeySimpleForm = CHARS[i],
                Keyboard = Keyboard,
                Order = KeyboardVM.NumericKeys.FirstOrDefault(nk => nk.Id == k.Id).Order,
                DataPoolId = DATA_POOL.Id
            }));

            var VK_Index = NKeys.Count;

            foreach(var VK in VKeys)
            {
                Keyboard.VariableKeys.Add(new KeyboardVariableKeyRelation()
                {
                    VariableKey = VK,
                    KeySimpleForm = "*",
                    Keyboard = Keyboard,
                    Order = KeyboardVM.VariableKeys.FirstOrDefault(nk => nk.Id == VK.Id).Order,
                    DataPoolId = DATA_POOL.Id
                });

                Keyboard.VariableKeyImages.AddRange(VK.Images.Select((k, i) => new KeyboardVariableKeyImageRelation()
                {
                    ImageId = k.Id,
                    ReplacementCharacter = CHARS[VK_Index + i],
                    DataPoolId = DATA_POOL.Id
                }));

                VK_Index += VK.Images.Count;
            }
            
            _applicationDbContext.Keyboards.Add(Keyboard);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Keyboard, KeyboardViewModel>(Keyboard));
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveKeyboard([FromBody] KeyboardViewModel KeyboardVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Keyboard = await _applicationDbContext.Keyboards
                 .Include(k => k.KeyboardQuestions)
                 .FirstOrDefaultAsync(k => k.Id == KeyboardVM.Id);

            if (Keyboard is null)
                return NotFound("Not Found");

            if (Keyboard.KeyboardQuestions.Count != 0)
                return BadRequest("Keyboard Is Used, Can't Be Deleted");

            _applicationDbContext.Keyboards.Remove(Keyboard);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveKeyFromKeyboard([FromBody] RemoveKeyFromKeyboardViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Keyboard = await _applicationDbContext.Keyboards
                 .Include(k => k.NumericKeys)
                 .Include(k => k.VariableKeys)
                 .FirstOrDefaultAsync(k => k.Id == VM.KeyboardId);

            if (Keyboard is null)
                return NotFound("Not Found");

            if (VM.IsNumeric && !Keyboard.NumericKeys.Any((nk) => nk.NumericKeyId == VM.KeyId))
                return BadRequest("Keyboard Does Not Contain This Key");

            if (!VM.IsNumeric && !Keyboard.VariableKeys.Any((nk) => nk.VariableKeyId == VM.KeyId))
                return BadRequest("Keyboard Does Not Contain This Key");

            if (VM.IsNumeric)
            {
                var Key = Keyboard.NumericKeys.FirstOrDefault((nk) => nk.NumericKeyId == VM.KeyId);

                var EBQ = await _applicationDbContext.EnergyBalanceQuestion
                    .AnyAsync(ebq =>
                    ebq.BoundryConditions.Any(bc => bc.Answers.Any(a => a.AnswerElements.Any(ae => ae.NumericKey.Id == Key.Id)))
                    ||
                    ebq.Questions.Any(q => q.Answers.Any(a => a.AnswerElements.Any(ae => ae.NumericKey.Id == Key.Id)))

                    );

                var KQ = await _applicationDbContext.KeyboardQuestion
                    .AnyAsync(q => q.Answers.Any(a => a.AnswerElements.Any(ae => ae.NumericKey.Id == Key.Id))

                    );

                if(KQ || EBQ)
                {
                    return BadRequest("Key used in questions!");
                }

                Keyboard.NumericKeys.Remove(Key);
            }
            else
            {
                var Key = Keyboard.VariableKeys.FirstOrDefault((nk) => nk.VariableKeyId == VM.KeyId);

                var EBQ = await _applicationDbContext.EnergyBalanceQuestion
                    .AnyAsync(ebq =>
                    ebq.BoundryConditions.Any(bc => bc.Answers.Any(a => a.AnswerElements.Any(ae => ae.Image.Image.KeyId== VM.KeyId)))
                    ||
                    ebq.Questions.Any(q => q.Answers.Any(a => a.AnswerElements.Any(ae => ae.Image.Image.KeyId == VM.KeyId)))

                    );

                var KQ = await _applicationDbContext.KeyboardQuestion
                    .AnyAsync(q => q.Answers.Any(a => a.AnswerElements.Any(ae => ae.Image.Image.KeyId == VM.KeyId))

                    );

                if (KQ || EBQ)
                {
                    return BadRequest("Key used in questions!");
                }

                Keyboard.VariableKeys.Remove(Key);
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddKeyboardKeys([FromBody] KeyboardViewModel KeyboardVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == KeyboardVM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeys)
                .Include(k => k.VariableKeyImages)
                .FirstOrDefaultAsync(k => k.Id == KeyboardVM.Id && k.DataPoolId == DATA_POOL.Id);

            if (Keyboard is null)
                return NotFound("Not Found");

            //Check Keys Exist
            var NKeys = await _applicationDbContext.NumericKeys
                .Where(k => KeyboardVM.NumericKeys.Any(kvm => k.Id == kvm.Id) && k.DataPoolId == DATA_POOL.Id)
                .ToListAsync();

            if (NKeys.Count != KeyboardVM.NumericKeys.Distinct().Count())
                return BadRequest("Alteast One Numeric Key Doest Not Exist");

            //Check Keys Exist
            var VKeys = await _applicationDbContext.VariableKeys
                .Include(k => k.Images)
                .Where(k => KeyboardVM.VariableKeys.Any(kvm => k.Id == kvm.Id) && k.DataPoolId == DATA_POOL.Id)
                .ToListAsync();

            if (VKeys.Count != KeyboardVM.VariableKeys.Distinct().Count())
                return BadRequest("Alteast One Variable Key Doest Not Exist");

            //Check Not Used Already
            if (Keyboard.NumericKeys.Any(nk => NKeys.Any(vnk => vnk.Id == nk.NumericKeyId)))
                return BadRequest("Some Keys Already Included");

            if (Keyboard.VariableKeys.Any(nk => VKeys.Any(vnk => vnk.Id == nk.VariableKeyId)))
                return BadRequest("Some Keys Already Included");


            var CHARS = GetChars()
                .Where(c => !Keyboard.NumericKeys.Any(k => k.KeySimpleForm == c) 
                && !Keyboard.VariableKeyImages.Any(k => k.ReplacementCharacter == c))
                .ToArray();

            var BaseOrder = Math.Max(
                Keyboard.NumericKeys.Count != 0 ? Keyboard.NumericKeys.Max(nk => nk.Order) : 0,
                Keyboard.VariableKeys.Count != 0 ? Keyboard.VariableKeys.Max(nk => nk.Order) : 0
                );

            Keyboard.NumericKeys.AddRange(KeyboardVM.NumericKeys.OrderBy(nk => nk.Order).Select((k, i) => new KeyboardNumericKeyRelation()
            {
                NumericKeyId = k.Id,
                KeySimpleForm = CHARS[i],
                Order = BaseOrder + i + 1,
                DataPoolId = DATA_POOL.Id
            }));

            //BaseOrder = Math.Max(Keyboard.NumericKeys.Max(nk => nk.Order), Keyboard.VariableKeys.Max(nk => nk.Order));


            var VK_Index = NKeys.Count;
            var Index = 0;

            foreach (var vk in KeyboardVM.VariableKeys.OrderBy(nk => nk.Order))
            {
                var VK = VKeys.FirstOrDefault(vkid => vkid.Id == vk.Id);

                Keyboard.VariableKeys.Add(new KeyboardVariableKeyRelation()
                {
                    VariableKey = VK,
                    KeySimpleForm = "*",
                    Order = BaseOrder + Index + 1,
                    DataPoolId = DATA_POOL.Id
                }); 

                Keyboard.VariableKeyImages.AddRange(VK.Images.Select((k, i) => new KeyboardVariableKeyImageRelation()
                {
                    ImageId = k.Id,
                    ReplacementCharacter = CHARS[VK_Index + i],
                    DataPoolId = DATA_POOL.Id
                }));

                VK_Index += VK.Images.Count;
                Index += 1;

            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Keyboard, KeyboardViewModel>(Keyboard));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SwabKeyboardKeys([FromBody] SwabKeyboardKeysViewModel KeyboardVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeys)
                .FirstOrDefaultAsync(k => k.Id == KeyboardVM.KeyboardId);

            if (Keyboard is null)
                return NotFound("Not Found");

            if (KeyboardVM.IsFirstNumeric)
            {
                var First = Keyboard.NumericKeys.FirstOrDefault((fk) => fk.NumericKeyId == KeyboardVM.FirstKeyId);

                if (First is null)
                    return BadRequest("Key Not Found");

                if (KeyboardVM.IsSecondNumeric)
                {
                    var Second = Keyboard.NumericKeys.FirstOrDefault((fk) => fk.NumericKeyId == KeyboardVM.SecondKeyId);

                    if (Second is null)
                        return BadRequest("Key Not Found");

                    var FirstOrder = First.Order;

                    First.Order = Second.Order;
                    Second.Order = FirstOrder;
                }
                else
                {
                    var Second = Keyboard.VariableKeys.FirstOrDefault((fk) => fk.VariableKeyId == KeyboardVM.SecondKeyId);

                    if (Second is null)
                        return BadRequest("Key Not Found");

                    var FirstOrder = First.Order;

                    First.Order = Second.Order;
                    Second.Order = FirstOrder;
                }
            }
            else
            {
                var First = Keyboard.VariableKeys.FirstOrDefault((fk) => fk.VariableKeyId == KeyboardVM.FirstKeyId);

                if (First is null)
                    return BadRequest("Key Not Found");

                if (KeyboardVM.IsSecondNumeric)
                {
                    var Second = Keyboard.NumericKeys.FirstOrDefault((fk) => fk.NumericKeyId == KeyboardVM.SecondKeyId);

                    if (Second is null)
                        return BadRequest("Key Not Found");

                    var FirstOrder = First.Order;

                    First.Order = Second.Order;
                    Second.Order = FirstOrder;
                }
                else
                {
                    var Second = Keyboard.VariableKeys.FirstOrDefault((fk) => fk.VariableKeyId == KeyboardVM.SecondKeyId);

                    if (Second is null)
                        return BadRequest("Key Not Found");

                    var FirstOrder = First.Order;

                    First.Order = Second.Order;
                    Second.Order = FirstOrder;
                }
            }
            
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Keyboard, KeyboardViewModel>(Keyboard));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> MoveAfterKey([FromBody] SwabKeyboardKeysViewModel KeyboardVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Keyboard = await _applicationDbContext.Keyboards
                .Include(k => k.NumericKeys)
                .Include(k => k.VariableKeys)
                .FirstOrDefaultAsync(k => k.Id == KeyboardVM.KeyboardId);

            if (Keyboard is null)
                return NotFound("Not Found");

            if (KeyboardVM.IsFirstNumeric)
            {
                var First = Keyboard.NumericKeys.FirstOrDefault((fk) => fk.NumericKeyId == KeyboardVM.FirstKeyId);

                if (First is null)
                    return BadRequest("Key Not Found");

                if (KeyboardVM.IsSecondNumeric)
                {
                    var Second = Keyboard.NumericKeys.FirstOrDefault((fk) => fk.NumericKeyId == KeyboardVM.SecondKeyId);

                    var FirstOrder = First.Order;
                    var SecondOrder = Second.Order;

                    foreach (var e in Keyboard.NumericKeys.Where(e => e.Order > SecondOrder))
                    {
                        e.Order = e.Order + 1;
                    }

                    foreach (var e in Keyboard.VariableKeys.Where(e => e.Order > SecondOrder))
                    {
                        e.Order = e.Order + 1;
                    }

                    First.Order = SecondOrder + 1;

                }
                else
                {
                    var Second = Keyboard.VariableKeys.FirstOrDefault((fk) => fk.VariableKeyId == KeyboardVM.SecondKeyId);

                    if (Second is null)
                        return BadRequest("Key Not Found");

                    var FirstOrder = First.Order;
                    var SecondOrder = Second.Order;

                    foreach (var e in Keyboard.NumericKeys.Where(e => e.Order > SecondOrder))
                    {
                        e.Order = e.Order + 1;
                    }

                    foreach (var e in Keyboard.VariableKeys.Where(e => e.Order > SecondOrder))
                    {
                        e.Order = e.Order + 1;
                    }

                    First.Order = SecondOrder + 1;

                }

            }
            else
            {
                var First = Keyboard.VariableKeys.FirstOrDefault((fk) => fk.VariableKeyId == KeyboardVM.FirstKeyId);

                if (First is null)
                    return BadRequest("Key Not Found");

                if (KeyboardVM.IsSecondNumeric)
                {
                    var Second = Keyboard.NumericKeys.FirstOrDefault((fk) => fk.NumericKeyId == KeyboardVM.SecondKeyId);

                    if (Second is null)
                        return BadRequest("Key Not Found");

                    var FirstOrder = First.Order;
                    var SecondOrder = Second.Order;

                    foreach (var e in Keyboard.NumericKeys.Where(e => e.Order > SecondOrder))
                    {
                        e.Order = e.Order + 1;
                    }

                    foreach (var e in Keyboard.VariableKeys.Where(e => e.Order > SecondOrder))
                    {
                        e.Order = e.Order + 1;
                    }

                    First.Order = SecondOrder + 1;

                }
                else
                {
                    var Second = Keyboard.VariableKeys.FirstOrDefault((fk) => fk.VariableKeyId == KeyboardVM.SecondKeyId);

                    if (Second is null)
                        return BadRequest("Key Not Found");

                    var FirstOrder = First.Order;
                    var SecondOrder = Second.Order;

                    foreach (var e in Keyboard.NumericKeys.Where(e => e.Order > SecondOrder))
                    {
                        e.Order = e.Order + 1;
                    }

                    foreach (var e in Keyboard.VariableKeys.Where(e => e.Order > SecondOrder))
                    {
                        e.Order = e.Order + 1;
                    }

                    First.Order = SecondOrder + 1;
                }
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Keyboard, KeyboardViewModel>(Keyboard));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditKeyboardKeysPerRow([FromBody] KeyboardViewModel KeyboardVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Keyboard = await _applicationDbContext.Keyboards
                .FirstOrDefaultAsync(k => k.Id == KeyboardVM.Id);

            if (Keyboard is null)
                return NotFound("Not Found");

            if (KeyboardVM.KeysPerRow <= 0)
                return BadRequest("Keys Per Row Should be Positive");

            Keyboard.KeysPerRow = KeyboardVM.KeysPerRow;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Keyboard, KeyboardViewModel>(Keyboard));
        }
    }
}

public class Key_Info
{
    public string File { get; set; }

    public int Width { get; set; }

    public int Height { get; set; }

    public string TextPresentation { get; set; }
}