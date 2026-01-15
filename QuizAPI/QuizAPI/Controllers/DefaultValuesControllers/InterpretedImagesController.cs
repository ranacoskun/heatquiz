using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.DefaultValues.InterpretedImages;
using QuizAPI.Models.DefaultValues.InterpretedImages.ViewModel;
using QuizAPI.Models.Ownership;
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
    public class InterpretedImagesController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;

        public InterpretedImagesController(
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
        public async Task<IActionResult> GetGroups(int DataPoolId)
        {
            var Groups = await _applicationDbContext.InterpretedImageGroups
                .Include(g => g.Images)
                .ThenInclude(i => i.Left)
                .Include(g => g.Images)
                .ThenInclude(i => i.RationOfGradients)
                .Include(g => g.Images)
                .ThenInclude(i => i.Right)
                .Include(g => g.Images)
                .ThenInclude(i => i.Jump)
                .Include(g => g.Owners)
                .ThenInclude(o => o.Owner)
                .Include(g => g.Images)
                .ThenInclude(i => i.ClickCharts)
                .OrderBy(g => g.Name)
                .Where(g => g.DataPoolId == DataPoolId)
                .ToListAsync();

            return Ok(_mapper.Map<List<InterpretedImageGroup>, List<InterpretedImageGroupViewModel>>(Groups));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetGroups()
        {
            var Groups = await _applicationDbContext.InterpretedImageGroups
                .Include(g => g.Images)
                .ThenInclude(i => i.Left)
                .Include(g => g.Images)
                .ThenInclude(i => i.RationOfGradients)
                .Include(g => g.Images)
                .ThenInclude(i => i.Right)
                .Include(g => g.Images)
                .ThenInclude(i => i.Jump)
                .Include(g => g.Owners)
                .ThenInclude(o => o.Owner)
                .Include(g => g.Images)
                .ThenInclude(i => i.ClickCharts)
                .OrderBy(g => g.Name)
                .ToListAsync();

            return Ok(_mapper.Map<List<InterpretedImageGroup>, List<InterpretedImageGroupViewModel>>(Groups));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetMyGroups()
        {
            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var Groups = await _applicationDbContext.InterpretedImageGroups
                .Include(g => g.Images)
                .ThenInclude(i => i.Left)
                .Include(g => g.Images)
                .ThenInclude(i => i.RationOfGradients)
                .Include(g => g.Images)
                .ThenInclude(i => i.Right)
                .Include(g => g.Images)
                .ThenInclude(i => i.Jump)
                .Include(g => g.Owners)
                .ThenInclude(o => o.Owner)
                .Include(g => g.Images)
                .ThenInclude(i => i.ClickCharts)
                .Where(g => g.Owners.Any(o => o.OwnerId == Owner.Id))
                .OrderBy(g => g.Name)
                .ToListAsync();

            return Ok(_mapper.Map<List<InterpretedImageGroup>, List<InterpretedImageGroupViewModel>>(Groups));
        }

        [HttpGet("[action]/{DataPoolId}")]
        public async Task<IActionResult> GetMyGroups(int DataPoolId)
        {
            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var Groups = await _applicationDbContext.InterpretedImageGroups
                .Include(g => g.Images)
                .ThenInclude(i => i.Left)
                .Include(g => g.Images)
                .ThenInclude(i => i.RationOfGradients)
                .Include(g => g.Images)
                .ThenInclude(i => i.Right)
                .Include(g => g.Images)
                .ThenInclude(i => i.Jump)
                .Include(g => g.Owners)
                .ThenInclude(o => o.Owner)
                .Include(g => g.Images)
                .ThenInclude(i => i.ClickCharts)
                .Where(g => g.Owners.Any(o => o.OwnerId == Owner.Id)  && g.DataPoolId == DataPoolId)
                .OrderBy(g => g.Name)
                .ToListAsync();

            return Ok(_mapper.Map<List<InterpretedImageGroup>, List<InterpretedImageGroupViewModel>>(Groups));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetGroups_PORTLA_SIMPLE()
        {
            var Groups = await _applicationDbContext.InterpretedImageGroups
                .Include(g => g.Owners)
                .ThenInclude(o => o.Owner)
                .ToListAsync();

            return Ok(_mapper.Map<List<InterpretedImageGroup>, List<InterpretedImageGroupViewModel>>(Groups));
        }

        [HttpGet("[action]/{GroupId}")]
        public async Task<IActionResult> GetGroup(int GroupId)
        {
            //Check Group Exists
            var Group = await _applicationDbContext.InterpretedImageGroups
                .Include(g => g.Images)
                .ThenInclude(i => i.Left)
                .Include(g => g.Images)
                .ThenInclude(i => i.Right)
                .Include(g => g.Images)
                .ThenInclude(i => i.RationOfGradients)
                .Include(g => g.Images)
                .ThenInclude(i => i.Jump)
                .FirstOrDefaultAsync(g => g.Id == GroupId);

            if (Group is null)
                return NotFound($"Group {GroupId} Not Found");

            return Ok(_mapper.Map<InterpretedImageGroup, InterpretedImageGroupViewModel>(Group));
        }

        [HttpGet("[action]/{DataPoolId}")]
        public async Task<IActionResult> GetValues(int DataPoolId)
        {
            var Left = await _applicationDbContext.LeftGradientValues
                .ToListAsync();

            var Right = await _applicationDbContext.RightGradientValues
                .ToListAsync();

            var RatioOfGradients = await _applicationDbContext.RationOfGradientsValues
                .ToListAsync();

            var Jump = await _applicationDbContext.JumpValues
                .ToListAsync();

            return Ok(new
            {
                Left = _mapper.Map<List<LeftGradientValue>,
                                   List<InterpretationValueViewModel>>
                                   (Left),

                Right = _mapper.Map<List<RightGradientValue>,
                                    List<InterpretationValueViewModel>>
                                    (Right),

                RatioOfGradients = _mapper.Map<List<RationOfGradientsValue>,
                                               List<InterpretationValueViewModel>>
                                               (RatioOfGradients),

                Jump = _mapper.Map<List<JumpValue>,
                                   List<InterpretationValueViewModel>>
                                   (Jump)
            });
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetValues()
        {
            var Left = await _applicationDbContext.LeftGradientValues
                .ToListAsync();

            var Right = await _applicationDbContext.RightGradientValues
                .ToListAsync();

            var RatioOfGradients = await _applicationDbContext.RationOfGradientsValues
                .ToListAsync();

            var Jump = await _applicationDbContext.JumpValues
                .ToListAsync();

            return Ok(new
            {
                Left = _mapper.Map<List<LeftGradientValue>,
                                   List<InterpretationValueViewModel>>
                                   (Left),

                Right = _mapper.Map<List<RightGradientValue>,
                                    List<InterpretationValueViewModel>>
                                    (Right),

                RatioOfGradients = _mapper.Map<List<RationOfGradientsValue>,
                                               List<InterpretationValueViewModel>>
                                               (RatioOfGradients),

                Jump = _mapper.Map<List<JumpValue>,
                                   List<InterpretationValueViewModel>>
                                   (Jump)
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddGroup([FromBody] InterpretedImageGroupViewModel GroupVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Name Not Null
            if (string.IsNullOrEmpty(GroupVM.Name))
                return BadRequest("Name Can't Be Empty");

            //Check Name Not Taken
            var NameTaken = await _applicationDbContext.InterpretedImageGroups
                .AnyAsync(g => g.Name == GroupVM.Name);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");


            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == GroupVM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Create Group
            var Group = new InterpretedImageGroup()
            {
                Name = GroupVM.Name,
                AddedBy = Owner,
                DataPoolId = DATA_POOL.Id
            };

            Group.Owners.Add(new InterpretedTreeOwner()
            {
                Owner = Owner,
                DataPoolId = DATA_POOL.Id
            });

            _applicationDbContext.InterpretedImageGroups.Add(Group);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<InterpretedImageGroup, InterpretedImageGroupViewModel>(Group));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditGroup([FromBody] InterpretedImageGroupViewModel GroupVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Group Exists
            var Group = await _applicationDbContext.InterpretedImageGroups
                .Include(g => g.Owners)
                .FirstOrDefaultAsync(g => g.Id == GroupVM.Id);

            if (Group is null)
                return NotFound($"Group {GroupVM.Id} Not Found");

            //Check Name Not Null
            if (string.IsNullOrEmpty(GroupVM.Name))
                return BadRequest("Name Can't Be Empty");

            //Check Name Not Taken
            var NameTaken = await _applicationDbContext.InterpretedImageGroups
                .AnyAsync(g => g.Id != GroupVM.Id && g.Name == GroupVM.Name);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            //Check Ownership
            var User = await GetUser(_httpContextAccessor, _applicationDbContext);


            if (!Group.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner Of Object");

            Group.Name = GroupVM.Name;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<InterpretedImageGroup, InterpretedImageGroupViewModel>(Group));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditImagePicture(int ImageId, IFormFile Picture)
        {
            //Check Image Exists
            var Image = await _applicationDbContext.InterpretedImages
                .FirstOrDefaultAsync(i => i.Id == ImageId);

            if (Image is null)
                return NotFound($"Image {ImageId} Not Found");

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
                "wwwroot/InterpretedImages",
                $"Group_{Image.GroupId.ToString()}",
                $"Image_{Image.Id.ToString()}");

            var URL = await SaveFile(path, Picture);

            Image.URL = URL;
            Image.Size = Picture.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<InterpretedImage, InterpretedImageViewModel>(Image));
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> AddImageSingleStep(string Code, int GroupId, int JumpId, int LeftId, int RightId, int RatioId, IFormFile Picture)
        {
            //Check Group Exists
            var Group = await _applicationDbContext.InterpretedImageGroups
                .Include(g => g.Images)
                .Include(g => g.Owners)
                .FirstOrDefaultAsync(g => g.Id == GroupId);

            if (Group is null)
                return NotFound($"Group {GroupId} Not Found");

            //Check Code Not Null
            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code Can't Be Null");

            //Check Code Not Taken
            var CodeTaken = Group.Images
                .Any(i => i.Code == Code);

            if (CodeTaken)
                return BadRequest("Code Taken within the Group, Choose Different Code");

            //Check Interpretation Values Exist
            var Left = await _applicationDbContext.LeftGradientValues
                .FirstOrDefaultAsync(l => l.Id == LeftId);

            if (Left is null)
                return BadRequest($"Left {LeftId} Not Found");


            var Right = await _applicationDbContext.RightGradientValues
                .FirstOrDefaultAsync(l => l.Id == RightId);

            if (Right is null)
                return BadRequest($"Right {RightId} Not Found");


            var Ratio = await _applicationDbContext.RationOfGradientsValues
                .FirstOrDefaultAsync(l => l.Id == RatioId);

            if (Ratio is null)
                return BadRequest($"RationOfGradients {RatioId} Not Found");


            var Jump = await _applicationDbContext.JumpValues
                .FirstOrDefaultAsync(l => l.Id == JumpId);

            if (Jump is null)
                return BadRequest($"Jump {JumpId} Not Found");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            if (Picture is null)
                return BadRequest("Please Provide Picture");

            //Check if Image Already Exists [Values]
            if (Group.Images.Any(i => i.JumpId == JumpId && i.LeftId == LeftId && i.RightId == RightId && i.RationOfGradientsId == RatioId))
                return BadRequest("Values Already Used Within the Group");

            //Check Ownership
            /*var User = await _applicationDbContext.Users
               .FirstOrDefaultAsync(u => u.Id == GetUser(_httpContextAccessor));

            if (!Group.Owners.Any(o => o.OwnerId == User.Id))
                return BadRequest("Not Owner Of Object");*/

            //Create Image
            var Image = new InterpretedImage()
            {
                Code = Code,
                RightId = Right.Id,
                LeftId = Left.Id,
                RationOfGradientsId = Ratio.Id,
                JumpId = Jump.Id,
                GroupId = Group.Id,
                DataPoolId = Group.DataPoolId
            };

            //Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/InterpretedImages",
                $"Group_{GroupId.ToString()}",
                $"Image_{Code}");

            var URL = await SaveFile(path, Picture);

            Image.URL = URL;
            Image.Size = Picture.Length;

            _applicationDbContext.InterpretedImages.Add(Image);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditImageSingleStep(int ImageId, string Code, bool SameImage, int JumpId, int LeftId, int RightId, int RatioId, IFormFile Picture)
        {
            //Check Image Exists
            var Image = await _applicationDbContext.InterpretedImages
                .Include(i => i.Group)
                .ThenInclude(g => g.Images)
                .Include(i => i.Group)
                .ThenInclude(g => g.Owners)
                .FirstOrDefaultAsync(i => i.Id == ImageId);

            if (Image is null)
                return NotFound("Node Not Found");

            //Check Group Exists
            var Group = Image.Group;

            //Check Code Not Null
            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code Can't Be Null");

            //Check Code Not Taken
            var CodeTaken = Group.Images
                .Any(i => i.Code == Code && i.Id != Image.Id);

            if (CodeTaken)
                return BadRequest("Code Taken within the Group, Choose Different Code");

            //Check Interpretation Values Exist
            var Left = await _applicationDbContext.LeftGradientValues
                .FirstOrDefaultAsync(l => l.Id == LeftId);

            if (Left is null)
                return BadRequest($"Left {LeftId} Not Found");


            var Right = await _applicationDbContext.RightGradientValues
                .FirstOrDefaultAsync(l => l.Id == RightId);

            if (Right is null)
                return BadRequest($"Right {RightId} Not Found");


            var Ratio = await _applicationDbContext.RationOfGradientsValues
                .FirstOrDefaultAsync(l => l.Id == RatioId);

            if (Ratio is null)
                return BadRequest($"RationOfGradients {RatioId} Not Found");


            var Jump = await _applicationDbContext.JumpValues
                .FirstOrDefaultAsync(l => l.Id == JumpId);

            if (Jump is null)
                return BadRequest($"Jump {JumpId} Not Found");

            //Check if Image Already Exists [Values]
            if (Group.Images.Any(i => i.Id != Image.Id && (i.JumpId == JumpId && i.LeftId == LeftId && i.RightId == RightId && i.RationOfGradientsId == RatioId)))
                return BadRequest("Values Already Used Within the Group");

            if (!SameImage)
            {
                //Verify Extension
                var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

                if (!fileExtensionIsValid)
                {
                    return BadRequest("Picture Extenstion Not Valid");
                }

                if (Picture is null)
                    return BadRequest("Please Provide Picture");

                //Generate a Path for The Picture
                var path = Path.Combine(
                    "wwwroot/InterpretedImages",
                    $"Group_{Group.Id.ToString()}",
                    $"Image_{Code}");

                var URL = await SaveFile(path, Picture);

                Image.URL = URL;
                Image.Size = Picture.Length;
            }

            Image.Code = Code;
            Image.RightId = Right.Id;
            Image.LeftId = Left.Id;
            Image.RationOfGradientsId = Ratio.Id;
            Image.JumpId = Jump.Id;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditInterpretedImageName(int ImageId, string Code)
        {
            //Check Image Exists
            var Image = await _applicationDbContext.InterpretedImages
                .Include(i => i.Group)
                .ThenInclude(g => g.Images)
                .Include(i => i.Group)
                .ThenInclude(g => g.Owners)
                .FirstOrDefaultAsync(i => i.Id == ImageId);

            if (Image is null)
                return NotFound("Node Not Found");

            if (string.IsNullOrEmpty(Code))
                return BadRequest("Code Can't Be Empty");

            //Check Group Exists
            var Group = Image.Group;

            //Check Code Not Taken
            var CodeTaken = Group.Images
                .Any(i => i.Code == Code && i.Id != Image.Id);

            if (CodeTaken)
                return BadRequest("Code Taken within the Group, Choose Different Code");

            Image.Code = Code;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditInterpretedImagePicture(int ImageId, IFormFile Picture)
        {
            //Check Image Exists
            var Image = await _applicationDbContext.InterpretedImages
                .Include(i => i.Group)
                .ThenInclude(g => g.Images)
                .Include(i => i.Group)
                .ThenInclude(g => g.Owners)
                .FirstOrDefaultAsync(i => i.Id == ImageId);

            if (Image is null)
                return NotFound("Node Not Found");

            //Check Group Exists
            var Group = Image.Group;

            //Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/InterpretedImages",
                $"Group_{Group.Id.ToString()}",
                $"Image_{Image.Code}");

            var URL = await SaveFile(path, Picture);

            Image.URL = URL;
            Image.Size = Picture.Length;
            
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditInterpretedImageValues(int ImageId, int JumpId, int LeftId, int RightId, int RatioId)
        {
            //Check Image Exists
            var Image = await _applicationDbContext.InterpretedImages
                .Include(i => i.Group)
                .ThenInclude(g => g.Images)
                .Include(i => i.Group)
                .ThenInclude(g => g.Owners)
                .FirstOrDefaultAsync(i => i.Id == ImageId);

            if (Image is null)
                return NotFound("Node Not Found");

            //Check Group Exists
            var Group = Image.Group;


            //Check Interpretation Values Exist
            var Left = await _applicationDbContext.LeftGradientValues
                .FirstOrDefaultAsync(l => l.Id == LeftId);

            if (Left is null)
                return BadRequest($"Left {LeftId} Not Found");


            var Right = await _applicationDbContext.RightGradientValues
                .FirstOrDefaultAsync(l => l.Id == RightId);

            if (Right is null)
                return BadRequest($"Right {RightId} Not Found");


            var Ratio = await _applicationDbContext.RationOfGradientsValues
                .FirstOrDefaultAsync(l => l.Id == RatioId);

            if (Ratio is null)
                return BadRequest($"RationOfGradients {RatioId} Not Found");


            var Jump = await _applicationDbContext.JumpValues
                .FirstOrDefaultAsync(l => l.Id == JumpId);

            if (Jump is null)
                return BadRequest($"Jump {JumpId} Not Found");

            //Check if Image Already Exists [Values]
            if (Group.Images.Any(i => i.Id != Image.Id && (i.JumpId == JumpId && i.LeftId == LeftId && i.RightId == RightId && i.RationOfGradientsId == RatioId)))
                return BadRequest("Values Already Used Within the Group");

           
            Image.RightId = Right.Id;
            Image.LeftId = Left.Id;
            Image.RationOfGradientsId = Ratio.Id;
            Image.JumpId = Jump.Id;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteTree([FromBody] InterpretedImageGroupViewModel GroupVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Name Not Null
            if (string.IsNullOrEmpty(GroupVM.Name))
                return BadRequest("Name Can't Be Empty");


            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            //Group
            var Group = await _applicationDbContext.InterpretedImageGroups
               .Include(g => g.Images)
               .ThenInclude(i => i.ClickCharts)
               .FirstOrDefaultAsync(g => g.Id == GroupVM.Id);

            if (Group is null)
                return NotFound($"Group Not Found");

            if (Group.Images.Any(i => i.ClickCharts.Count != 0))
                return BadRequest("Tree Used in Questions, Can't Be Deleted");

            foreach(var i in Group.Images)
            {
                _applicationDbContext.InterpretedImages.Remove(i);
            }

            _applicationDbContext.InterpretedImageGroups.Remove(Group);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteNode([FromBody] InterpretedImageViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Image
            var Image = await _applicationDbContext.InterpretedImages
               .Include(i => i.ClickCharts)
               .FirstOrDefaultAsync(g => g.Id == VM.Id);

            if (Image is null)
                return NotFound($"Group Not Found");

            if (Image.ClickCharts.Count != 0)
                return BadRequest("Image Used in Questions, Can't Be Deleted");


            _applicationDbContext.InterpretedImages.Remove(Image);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
