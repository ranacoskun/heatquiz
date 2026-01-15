using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.Tutorials;
using QuizAPI.Models.Tutorials.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.TutorialsController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class TutorialsController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;

        public TutorialsController(
            IMapper mapper,
            ApplicationDbContext applicationDbContext
        )
        {
            _mapper = mapper;
            _applicationDbContext = applicationDbContext;
        }

        public IActionResult Index()
        {
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetTutorialsForApp([FromBody] QueryTutorialsViewModel QueryVM)
        {     
            if (!ModelState.IsValid)
                return BadRequest();

            var Tutorials = await _applicationDbContext.Tutorial
                  /*.Where(g => QueryVM.GroupId != -1 ? g.Id == QueryVM.GroupId : true
                  && QueryVM.Name != "" ? g.Name.Contains(QueryVM.Name) : true
                  && QueryVM.Tags.Count != 0 ? g.Tutorials.Any(t => t.Tags.Any(tag => QueryVM.Tags.Any(vtag => tag.Tag == vtag))) : true
                  && QueryVM.Reviews != -1 ? g.Tutorials.Any(t => t.Reviews >= QueryVM.Reviews) : true
                  && QueryVM.Publisher != "" ? g.Tutorials.Any(t => t.AddedBy.Name == QueryVM.Publisher) : true
                  )*/              
                .Include(t => t.AddedBy)
                .Include(t => t.Tags)
                .Include(t => t.PDFs)
                .Include(t => t.Videos)
                .ToListAsync();

            return Ok(_mapper.Map<List<Tutorial>, List<TutorialViewModel>>(Tutorials));
        }

        [HttpGet("[action]/{name}")]
        public async Task<IActionResult> GetTutorialsTopicsForApp(string name)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var TutorialGroups = await _applicationDbContext.TutorialsGroup
                .Where(g => name != "" ? g.Name.Contains(name) : true)
                .ToListAsync();

            return Ok(_mapper.Map<List<TutorialsGroup>, List<TutorialsGroupViewModel>>(TutorialGroups));
        }

        [HttpGet("[action]/{name}")]
        public async Task<IActionResult> GetTutorialsTagsForApp(string name)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var Tags = await _applicationDbContext.TutorialTag
                .Where(t => name != "" ? t.Tag.Contains(name) : true)
                .Select(t => t.Tag)
                .Distinct()
                .ToListAsync();

            return Ok(_mapper.Map<List<string>, List<string>>(Tags));
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddGroup([FromBody] TutorialsGroupViewModel GroupVM)
        {
             if (!ModelState.IsValid)
                 return BadRequest("Model Not Valid");

             //Check Name Not Null
             if (string.IsNullOrEmpty(GroupVM.Name))
                 return BadRequest("Name Can't Be Empty");

             //Check Name Not Taken 
             var NameTaken = await _applicationDbContext.TutorialsGroup
                 .AnyAsync(g => g.Name == GroupVM.Name);

             if (NameTaken)
                 return BadRequest("Name Taken, Choose Different Name");

            var Group = new TutorialsGroup()
            {
                Name = GroupVM.Name,
            };

            _applicationDbContext.TutorialsGroup.Add(Group);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<TutorialsGroup, TutorialsGroupViewModel>(Group));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddTutorial([FromBody] TutorialViewModel TutorialVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Name Not Null
            if (string.IsNullOrEmpty(TutorialVM.Name))
                return BadRequest("Name Can't Be Empty");

            //Check Name Not Taken 
            var NameTaken = await _applicationDbContext.Tutorial
                .AnyAsync(t => t.Name == TutorialVM.Name);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            //Check Group Exists
            var subtopic = await _applicationDbContext.Subtopics
                .FirstOrDefaultAsync(s => s.Id == TutorialVM.SubtopicId);

            if (subtopic is null)
                return NotFound($"Subtopic  Not Found");

            //Get Current User
            //var Current_User = HttpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;

            //Create Tutorial
            var Tutorial = new Tutorial()
            {
                Name = TutorialVM.Name,
                SubtopicId = TutorialVM.SubtopicId,
                //AddedById = Current_User,
                Tags = TutorialVM.Tags.Select(t => new TutorialTag()
                {
                    Tag = t
                }).ToList()
            };

            _applicationDbContext.Tutorial.Add(Tutorial);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Tutorial, TutorialViewModel>(Tutorial));
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditTutorialThumbnail(int TutorialId, IFormFile Picture)
        {
            //Check Tutorial Exists
            var Tutorial = await _applicationDbContext.Tutorial
                .FirstOrDefaultAsync(t => t.Id == TutorialId);

            if (Tutorial is null)
                return NotFound($"Tutorial {TutorialId} Not Found");

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
                "wwwroot/Tutorials",
                $"Tutorial_{Tutorial.Id.ToString()}",
                "Thumbnail");

            var URL = await SaveFile(path, Picture);

            Tutorial.URL = URL;
            Tutorial.Size = Picture.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Tutorial, TutorialViewModel>(Tutorial));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddTutorialPDF(int TutorialId, string Title, IFormFile PDF)
        {
            //Check Name
            if (string.IsNullOrEmpty(Title))
                return BadRequest("Title Can't Be Empty");

            //Check Tutorial Exists
            var Tutorial = await _applicationDbContext.Tutorial
                .FirstOrDefaultAsync(t => t.Id == TutorialId);

            if (Tutorial is null)
                return NotFound($"Tutorial {TutorialId} Not Found");

            if (PDF is null)
                return BadRequest("Please Provide Picture");


            //Verify Extension
            var validExtenstions = new List<string>() { ".pdf"};

            var fileExtensionIsValid = validExtenstions.Any(ve => PDF.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            //Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/Tutorials",
                $"Tutorial_{Tutorial.Id.ToString()}",
                "PDF");

            var URL = await SaveFile(path, PDF);

            Tutorial.PDFs.Add(new TutorialPDF()
            {
                PDFURL = URL,
                PDFSize = PDF.Length,
                Title = Title
            });

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Tutorial, TutorialViewModel>(Tutorial));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddTutorialVideo(int TutorialId, string Title, IFormFile Video)
        {
            //Check Name
            if (string.IsNullOrEmpty(Title))
                return BadRequest("Title Can't Be Empty");

            //Check Tutorial Exists
            var Tutorial = await _applicationDbContext.Tutorial
                .FirstOrDefaultAsync(t => t.Id == TutorialId);

            if (Tutorial is null)
                return NotFound($"Tutorial {TutorialId} Not Found");

            if (Video is null)
                return BadRequest("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".mp3", ".mp4" };

            var fileExtensionIsValid = validExtenstions.Any(ve => Video.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            //Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/Tutorials",
                $"Tutorial_{Tutorial.Id.ToString()}",
                "Video");

            var URL = await SaveFile(path, Video);

            Tutorial.Videos.Add(new TutorialVideo()
            {
                Title = Title,
                VideoSize = Video.Length,
                VideoURL = URL
            });

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<Tutorial, TutorialViewModel>(Tutorial));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddTutorialSingleStep(string Name, int SubtopicId, string Tags, List<IFormFile> PDFs, string PDFTitles, List<IFormFile> Videos, string VideoTitles)
        {
            if (string.IsNullOrEmpty(Name))
                return BadRequest("Name Cannot Be Empty");

            var NameTaken = await _applicationDbContext.Tutorial
                .AnyAsync(t => t.Name.ToUpper() == Name.ToUpper());

            if (NameTaken)
                return BadRequest("Name Taken");

            //Check Group Exists
            var subtopic = await _applicationDbContext.Subtopics
                .FirstOrDefaultAsync(s => s.Id == SubtopicId);

            if (subtopic is null)
                return NotFound($"Subtopic  Not Found");

            var PTitles = PDFTitles.Split(',');
            var VTitles = VideoTitles.Split(',');

            //Check PDF VIDEOS
            if (PDFs.Any(p => p is null))
                return BadRequest("Some PDFs Are NULL");

            if (!PTitles.Any() || PTitles.Count() != PDFs.Count())
                return BadRequest("All PDFs should have title");

            if (Videos.Any(p => p is null))
                return BadRequest("Some Videos Are NULL");

            if (!VTitles.Any() || VTitles.Count() != Videos.Count())
                return BadRequest("All PDFs should have title");

            //Verify Extension
            var validPDFExtenstions = new List<string>() { ".pdf" };
            var validVideoExtenstions = new List<string>() { ".mp4" };

            if (PDFs.Any(p => !validPDFExtenstions.Any(ve => p.FileName.EndsWith(ve))))
                return BadRequest("PDF extension not Correct");

            if (Videos.Any(v => !validVideoExtenstions.Any(ve => v.FileName.EndsWith(ve))))
                return BadRequest("Video extension not Correct");

            //Create Tutorial
            var Tutorial = new Tutorial()
            {
                Name = Name,
                SubtopicId = SubtopicId,
                //AddedById = Current_User,
                Tags = Tags.Split(',').Select(t => new TutorialTag()
                {
                    Tag = t
                }).ToList()
            };

            for (var i = 0; i < PDFs.Count; i++)
            {
                var pdf = PDFs[i];

                var path = Path.Combine(
                "wwwroot/Tutorials",
                $"Tutorial_{Name}",
                "PDF");

                var URL = await SaveFile(path, pdf);

                Tutorial.PDFs.Add(new TutorialPDF()
                {
                    PDFURL = URL,
                    PDFSize = pdf.Length,
                    Title = PTitles[i]
                });
            }

            for (var i = 0; i < Videos.Count; i++)
            {
                var video = Videos[i];

                var path = Path.Combine(
                "wwwroot/Tutorials",
                $"Tutorial_{Name}",
                "VIDEO");

                var URL = await SaveFile(path, video);

                Tutorial.Videos.Add(new TutorialVideo()
                {
                    VideoURL = URL,
                    VideoSize = video.Length,
                    Title = VTitles[i]
                });
            }

            _applicationDbContext.Tutorial.Add(Tutorial);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
