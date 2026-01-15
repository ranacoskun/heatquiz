using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PdfSharpCore.Pdf;
using PdfSharpCore.Drawing;
using PdfSharpCore.Fonts;
using PdfSharpCore.Utils;
using QuizAPI.Data;
using QuizAPI.Models;
using QuizAPI.Models.Course;
using QuizAPI.Models.Course.ViewModels;
using QuizAPI.Models.Questions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using static QuizAPI.Controllers.QuestionsController.SimpleClickableController;
using static QuizAPI.Utilities.Utilities;
using QuizAPI.Mapping;
using PdfSharpCore;

namespace QuizAPI.Controllers.CourseController
{
    [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class CourseMapController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        private readonly string SECRET = "XAyCAwQFMgcIWStADu0ODw=r"; 
        private readonly string SECRET2 = "qXyACuQWJggIfSbADf2ODw=R";
        private readonly IHostingEnvironment _environment;

        IHttpContextAccessor _httpContextAccessor;

        public CourseMapController(
            IMapper mapper,
            ApplicationDbContext applicationDbContext,
            IHttpContextAccessor httpContextAccessor,
            IHostingEnvironment environment
        )
        {
            _mapper = mapper;
            _applicationDbContext = applicationDbContext;
            _httpContextAccessor = httpContextAccessor;
            _environment = environment;

        }

        public IActionResult Index()
        {
            return Ok();
        }

      

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetCourseMapsById_APP(int Id)
        {
            var Course = await _applicationDbContext.Courses
                .Include(c => c.CourseMaps)
                .ThenInclude(m => m.Elements)

                .FirstOrDefaultAsync(c => c.Id == Id);

            if (Course is null)
                return NotFound("Course Not Found");

            return Ok(_mapper.Map<Course, CourseViewModel>(Course));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetRecentlyVisitedCourseMapsByIds(List<int> Ids)
        {
            var Maps = await _applicationDbContext.CourseMap
                .Where(c => Ids.Any(a => a == c.Id))
                .ToListAsync();

            var MapsOrdered = new List<CourseMap>();

            foreach(var Id in Ids){
                var map = Maps.FirstOrDefault(a => a.Id == Id);

                if(map != null)
                {
                    MapsOrdered.Add(map);
                }
            }

            MapsOrdered.Reverse();

            return Ok(_mapper.Map<List<CourseMapViewModel>>(MapsOrdered));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddMap([FromForm]  AddCourseMapSingleStepViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == VM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            //Check Course Exists
            var Course = await _applicationDbContext.Courses
                .Include(c => c.CourseMaps)
                .FirstOrDefaultAsync(c => c.Id == VM.CourseId && c.DataPoolId == DATA_POOL.Id);

            if (Course is null)
                return NotFound("Course Not Found");

            if (Course.CourseMaps.Any(m => m.Title == VM.Title))
                return BadRequest("Course Already Has a Map with Same Name");

            if (VM.Picture is null)
                return Ok("Please Provide Picture");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => VM.Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            var Elements = Newtonsoft.Json.JsonConvert.DeserializeObject<List<CourseMapElementViewModel>>(VM.ElementsString);

            if (Elements is null)
                return BadRequest("Invalid Data Of Click Parts");

            if (Elements.Count == 0)
                return BadRequest("Please Add Elements");

          
            //Check MC Images 
            if (VM.BackgroundImages.Count != Elements.Count(a => !string.IsNullOrEmpty(a.BackgroundImage)))
                return BadRequest("Number of images does not match clickable parts selected to have an image");


            if (VM.IsSeriesMap && Elements.Any(e => e.QuestionSeriesId == null))
                return BadRequest("Series Map, Link all Elements to a Series");

            var Series = await _applicationDbContext.QuestionSeries
                .Where(s => Elements.Any(e => e.QuestionSeriesId == s.Id && s.DataPoolId == DATA_POOL.Id))
                .ToListAsync();

            if (Series.Count != Elements.Where(e => e.QuestionSeriesId != null).Select(e => e.QuestionSeriesId).Distinct().Count())
                return BadRequest("Some Questions Series Do Not Exist");

            var BackgroundImages = await _applicationDbContext.BackgroundImage
                .Where(bi => Elements.Any(e => e.Background_ImageId == bi.Id))
                .ToListAsync();

            if (BackgroundImages.Count != Elements.Where(e => e.Background_ImageId != null).Select(e => e.Background_ImageId).Distinct().Count())
                return BadRequest("Some Background Images Do Not Exist");


            //Picture
            var path = Path.Combine(
                "wwwroot/CourseaMap");

            var URL = await SaveFile(path, VM.Picture);

            var Map = new CourseMap()
            {
                Title = VM.Title,
                IsSeriesMap = VM.IsSeriesMap,
                ShowBorder = VM.ShowBorder,
                CourseId = Course.Id,
                LargeMapURL = URL,
                LargeMapWidth = (int)VM.LargeMapWidth,
                LargeMapLength = (int)VM.LargeMapLength,
                DataPoolId = DATA_POOL.Id
            };

            Map.Elements.AddRange(Elements.Select(e => new CourseMapElement()
            {
                Title = e.Title,
                QuestionSeriesId = e.QuestionSeriesId,
                ExternalVideoLink = e.ExternalVideoLink,
                X = e.X,
                Y = e.Y,
                Width = e.Width,
                Length = e.Length,
                Background_ImageId = e.Background_ImageId,
                DataPoolId = DATA_POOL.Id
            }));


            Course.CourseMaps.Add(Map);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapViewModel>(Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddBadgeGroup([FromForm]  AddCourseMapBadgeGroupSingleStepViewModel VM)
        {
            var Map = await _applicationDbContext.CourseMap
                .Include(m => m.BadgeSystems)
                .FirstOrDefaultAsync(m => m.Id == VM.MapId);

            if (Map is null)
                return NotFound("Map Not Found");

            if(Map.BadgeSystems.Any(s => s.Title.ToUpper() == VM.Title.ToUpper()))
                return BadRequest("Title Should Be Unique");

            if (!VM.Pictures.Any())
                return BadRequest("Please Provide Images");

            if (!VM.ProgressList.Any())
                return BadRequest("Please Provide Progress Data");

            

            if (VM.ProgressList.Any(p => p < 0))
                return BadRequest("Progress Must be Zero or Positive");


            if (VM.ProgressList.Distinct().Count() != VM.ProgressList.Count)
                return BadRequest("Repeated Progress Value !");

            if (VM.ProgressList.Distinct().Count() != VM.Pictures.Count)
                return BadRequest("Please Provide Picture for each Progress Value and Vice Versa!");

            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };

            if(VM.Pictures.Any(p => !validExtenstions.Any(ve => p.FileName.EndsWith(ve))))
                return BadRequest("Pictures Should Have Valid Extenstion");
        
            var URL_List = new List<string>();

            foreach(var P in VM.Pictures)
            {
                //Picture
                var path = Path.Combine(
                    "wwwroot/CourseaMap");

                var URL = await SaveFile(path, P);
                URL_List.Add(URL);
            }

            var System = new CourseMapBadgeSystem()
            {
                Title = VM.Title,
                Entities = URL_List.Select((e, i) => new CourseMapBadgeSystemEntity()
                {
                    URL = URL_List[i],
                    Progress = VM.ProgressList[i]
                }).ToList()
            };

            Map.BadgeSystems.Add(System);        
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapViewModel>(Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditBadgeGroup(int Id, string Title)
        {
            //Get Badge System
            var Group = await _applicationDbContext.CourseMapBadgeSystem
               .Include(s => s.Entities)
               .FirstOrDefaultAsync(s => s.Id == Id);

            if (Group is null)
                return NotFound("Badge Entity Not Found");

            if (string.IsNullOrEmpty(Title))
                return BadRequest("Title Can't Be Empty");

            Group.Title = Title; 

             await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapBadgeSystemViewModel>(Group));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveBadgeGroup(int Id)
        {
            //Get Badge System
            var Group = await _applicationDbContext.CourseMapBadgeSystem
               .Include(s => s.Entities)
               .FirstOrDefaultAsync(s => s.Id == Id);

            if (Group is null)
                return NotFound("Badge System Not Found");


            _applicationDbContext.CourseMapBadgeSystem.Remove(Group);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddBadgeGroupEntities([FromForm]  AddCourseMapBadgeGroupSingleStepViewModel VM)
        {
            //Get Badge System
            var Group = await _applicationDbContext.CourseMapBadgeSystem
               .Include(s => s.Entities)
               
               .FirstOrDefaultAsync(s=> s.Id == VM.MapId);

            if (Group is null)
                return NotFound("Badge System Not Found");

            if (!VM.Pictures.Any())
                return BadRequest("Please Provide Images");

            if (!VM.ProgressList.Any())
                return BadRequest("Please Provide Progress Data");

            if (VM.ProgressList.Any(p => p < 0))
                return BadRequest("Progress Must be Zero or Positive");


            if (VM.ProgressList.Distinct().Count() != VM.ProgressList.Count)
                return BadRequest("Repeated Progress Value !");

            if (VM.ProgressList.Distinct().Count() != VM.Pictures.Count)
                return BadRequest("Please Provide Picture for each Progress Value and Vice Versa!");

            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };

            if (VM.Pictures.Any(p => !validExtenstions.Any(ve => p.FileName.EndsWith(ve))))
                return BadRequest("Pictures Should Have Valid Extenstion");

            if(Group.Entities.Any(e => VM.ProgressList.Any(p => e.Progress == p)))
                return BadRequest("Progress Value Already Exists!");

            var URL_List = new List<string>();

            foreach (var P in VM.Pictures)
            {
                //Picture
                var path = Path.Combine(
                    "wwwroot/CourseaMap");

                var URL = await SaveFile(path, P);
                URL_List.Add(URL);
            }

            Group.Entities.AddRange(URL_List.Select((e, i) => new CourseMapBadgeSystemEntity()
            {
                URL = URL_List[i],
                Progress = VM.ProgressList[i]
            }).ToList());

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapBadgeSystemViewModel>(Group));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditBadgeGroupEntity(int BadgeEntityId, int? Progress, IFormFile Picture)
        {
            //Get Badge System
            var Group = await _applicationDbContext.CourseMapBadgeSystem
               .Include(s => s.Entities)
               .FirstOrDefaultAsync(s => s.Entities.Any(e => e.Id == BadgeEntityId));

            if (Group is null)
                return NotFound("Badge Entity Not Found");

            var Entity = Group.Entities.FirstOrDefault(e => e.Id == BadgeEntityId);

            if (Picture is null && !Progress.HasValue)
                return BadRequest("Provide Badge Image or Progress Value");

            if (Progress.HasValue)
            {
                if (Progress < 0 || Progress > 100)
                    return BadRequest("Provide Correct Progress Value");

                if (Group.Entities.Any(e => e.Id != Entity.Id && e.Progress == Progress.Value))
                    return BadRequest("Progress Already Exists");

                Entity.Progress = Progress.Value;
            }

            if (Picture != null)
            {
                var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };

                if (!validExtenstions.Any(ve => Picture.FileName.EndsWith(ve)))
                    return BadRequest("Image Should Have Valid Extenstion");

                //Picture
                var path = Path.Combine(
                    "wwwroot/CourseaMap");

                var URL = await SaveFile(path, Picture);

                Entity.URL = URL;
            }
          

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapBadgeSystemViewModel>(Group));
        }
        

       [HttpPost("[action]")]
        public async Task<IActionResult> RemoveBadgeGroupEntity(int Id)
        {
            //Get Badge Entity
            var Entity = await _applicationDbContext.CourseMapBadgeSystemEntity
                .Include(e => e.System)
               .FirstOrDefaultAsync(s => s.Id == Id);

            if (Entity is null)
                return NotFound("Badge Entity Not Found");

            var Group = Entity.System;

            _applicationDbContext.CourseMapBadgeSystemEntity.Remove(Entity);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapBadgeSystemViewModel>(Group));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CopyBadgeGroupEntities([FromForm]  CopyBadgesViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Element = await _applicationDbContext.CourseMapElement
                .Include(e => e.Badges)
                .FirstOrDefaultAsync(e => e.Id == VM.MapElementId);

            if (Element is null)
                return NotFound("Map Element Not Found");

            var Badges = await _applicationDbContext.CourseMapBadgeSystemEntity
                .Where(b => VM.BadgeEntityIds.Any(e => e == b.Id))
                .ToListAsync();

            if (Element.Badges.Any(b => Badges.Any(be => be.Progress == b.Progress)))
                return BadRequest("Repeated Progress!");

            foreach (var Badge in Badges)
            {
                var URL = @"Maps\Pictures\" + Path.GetRandomFileName() + ".jpg";

                System.IO.File.Copy(
                 Directory.GetCurrentDirectory() + "\\wwwroot\\" + Badge.URL,
                 Directory.GetCurrentDirectory() + @"\wwwroot\" +  URL
                 );

                Element.Badges.Add(new CourseMapElementBadge()
                {
                    Progress = Badge.Progress,
                    URL = URL
                });

            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> SearchCourseMap_ADVANCED_PORTAL([FromBody] SearchMapsViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == VM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            Expression<Func<CourseMap, bool>> criteria = m => (
            (m.DataPoolId == DATA_POOL.Id)
               &&
              (VM.CourseId != null ? (m.CourseId == VM.CourseId) : true)
              &&
              (!string.IsNullOrEmpty(VM.Title) ? m.Title.ToLower().Contains(VM.Title.ToLower()) : true)
              );

            var CodesNumbers = await _applicationDbContext.CourseMap
              .Where(criteria)
              .OrderBy(q => q.Title)
              .Select(q => q.Title[0])
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

            var CourseMaps = await _applicationDbContext.CourseMap
                .Where(criteria)
                .Include(m => m.Course)
                .Include(c => c.Elements)
                .ThenInclude(e => e.QuestionSeries)
                .OrderBy(q => q.Title)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)

                .ToListAsync();

            var Ids = await _applicationDbContext.CourseMap
              .Where(criteria)
              .OrderBy(q => q.Title)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
            {
                NumberOfMaps = CodesNumbers.Count,
                Maps = _mapper.Map<List<CourseMap>, List<CourseMapViewModel>>(CourseMaps),
                Ids = Ids,
                Codes = Codes
               
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchOwnedCourseMap_ADVANCED_PORTAL([FromBody] SearchMapsViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request");

            //Check Code Not Taken
            var DATA_POOL = await _applicationDbContext.DataPools
               .FirstOrDefaultAsync(dp => dp.Id == VM.DataPoolId);

            if (DATA_POOL is null)
                return NotFound("DATA_POOL not found");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            var CodesNumbers = await _applicationDbContext.CourseMap
              .Where(m =>
              (m.DataPoolId == DATA_POOL.Id)
                &&
              m.Course.Owners.Any(o => o.OwnerId == Owner.Id))
              .OrderBy(q => q.Title)
              .Select(q => q.Title[0])
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

            var CourseMaps = await _applicationDbContext.CourseMap
                 .Where(m =>
                 (m.DataPoolId == DATA_POOL.Id)
                &&
                 m.Course.Owners.Any(o => o.OwnerId == Owner.Id))
                .Include(m => m.Course)
                .Include(c => c.Elements)
                .ThenInclude(e => e.QuestionSeries)
                .OrderBy(q => q.Title)
                .Skip(VM.Page * VM.QperPage)
                .Take(VM.QperPage)
                .ToListAsync();

            var Ids = await _applicationDbContext.CourseMap
               .Where(m =>
               (m.DataPoolId == DATA_POOL.Id)
                &&
               m.Course.Owners.Any(o => o.OwnerId == Owner.Id))

              .OrderBy(q => q.Title)
              .Select(q => q.Id)
              .ToListAsync();

            return Ok(new
            {
                NumberOfMaps = CodesNumbers.Count,
                Maps = _mapper.Map<List<CourseMap>, List<CourseMapViewModel>>(CourseMaps),
                Ids = Ids,
                Codes = Codes

            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SearchCourseMaps_PORTAL([FromBody] SearchMapsViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var CourseMaps = await _applicationDbContext.CourseMap
                .Where(m =>
                (VM.CourseId.HasValue ? m.CourseId == VM.CourseId : true)
                &&
                ((VM.Title == null || string.IsNullOrEmpty(VM.Title)) ? true: m.Title.ToUpper().Contains(VM.Title.ToUpper()))

                )
                .Include(m => m.Course)
                .Include(c => c.Elements)
                .ThenInclude(e => e.QuestionSeries)
                .ToListAsync();

            return Ok(_mapper.Map<List<CourseMap>, List<CourseMapViewModel>>(CourseMaps.OrderBy(m => m.Title).ToList()));
        }

        [HttpGet("[action]/{DatapoolId}")]
        public async Task<IActionResult> GetAllMaps(int DatapoolId)
        {
            var Course = await _applicationDbContext.CourseMap
                
                .Include(c => c.Elements)
               
                .ThenInclude(e => e.RequiredElement)

                .Where(c => c.DataPoolId == DatapoolId)
                .ToListAsync();

            return Ok(_mapper.Map<List<CourseMapViewModel>>(Course));
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetCourseMapPlayById_PORTAL(int Id)
        {
            var Course = await _applicationDbContext.CourseMap
                .Include(m => m.Course)
                .ThenInclude(c => c.Owners)
                .ThenInclude(o => o.Owner)
                .Include(c => c.Elements)
                .ThenInclude(e => e.QuestionSeries)
                .ThenInclude(qs => qs.Elements)
                .Include(c => c.Elements)
                .ThenInclude(e => e.RequiredElement)

                .Include(c => c.Elements)
                .ThenInclude(e => e.Relations)
                .ThenInclude(r => r.RequiredElement)

                .Include(c => c.Elements)
                .ThenInclude(e => e.Badges)
                 .Include(c => c.Elements)
                .ThenInclude(e => e.CourseMapElementImages)
                .Include(c => c.Elements)
                .ThenInclude(e => e.Background_Image)
                .Include(c => c.Elements)
                .ThenInclude(e => e.MapAttachment)
                .ThenInclude(a => a.Map)
                .Include(c => c.Elements)
                .ThenInclude(e => e.QuestionnaireRelation)
                .ThenInclude(r => r.Questionnaire)
                .FirstOrDefaultAsync(c => c.Id == Id && !c.Disabled);

            if (Course is null)
                return NotFound("Map Not Found");

            return Ok(_mapper.Map<CourseMap, CourseMapViewModel>(Course));
        }

        [HttpGet("[action]/{Id}/{PlayerKey}")]
        public async Task<IActionResult> GetCourseMapPlayById_PORTAL(int Id, string PlayerKey)
        {
            var Course = await _applicationDbContext.CourseMap
                .Include(m => m.Course)
                .ThenInclude(c => c.Owners)
                .ThenInclude(o => o.Owner)
                .Include(c => c.Elements)
                .ThenInclude(e => e.QuestionSeries)
                .ThenInclude(qs => qs.Elements)
                .Include(c => c.Elements)
                .ThenInclude(e => e.RequiredElement)

                .Include(c => c.Elements)
                .ThenInclude(e => e.Relations)
                .ThenInclude(r => r.RequiredElement)

                .Include(c => c.Elements)
                .ThenInclude(e => e.Badges)
                 .Include(c => c.Elements)
                .ThenInclude(e => e.CourseMapElementImages)
                .Include(c => c.Elements)
                .ThenInclude(e => e.Background_Image)
                .Include(c => c.Elements)
                .ThenInclude(e => e.MapAttachment)
                .ThenInclude(a => a.Map)
                .Include(c => c.Elements)
                .ThenInclude(e => e.QuestionnaireRelation)
                .ThenInclude(r => r.Questionnaire)
                .FirstOrDefaultAsync(c => c.Id == Id && !c.Disabled);

            if (Course is null)
                return NotFound("Map Not Found");

            foreach (var e in Course.Elements)
            {
                var relation = e.QuestionnaireRelation;

                if (relation is null) continue;

                //Get last play for half day
                var includeSurvey = true;

                if (relation.IsRepeatable)
                {
                    DateTime time = (DateTime.Now).AddMinutes(-1);
                    var alreadyPlayed = await _applicationDbContext.QuestionnaireStatisticInstanceBase
                        .AnyAsync(i => 
                        i.MapElementId == e.Id
                        && i.QuestionnaireId == relation.QuestionnaireId
                        && i.Player == PlayerKey && i.DateCreated >= time);

                    includeSurvey = !alreadyPlayed;
                }
                else
                {
                    var alreadyPlayed = await _applicationDbContext.QuestionnaireStatisticInstanceBase
                        .AnyAsync(i => 
                        i.MapElementId == e.Id
                        && i.QuestionnaireId == relation.QuestionnaireId
                        && i.Player == PlayerKey);

                    includeSurvey = !alreadyPlayed;
                }

                if (!includeSurvey) e.QuestionnaireRelation = null;
            }

            // Debug: Check for elements with QuestionSeriesId but null QuestionSeries
            foreach (var e in Course.Elements)
            {
                if (e.QuestionSeriesId.HasValue && e.QuestionSeries == null)
                {
                    // Try to verify if the QuestionSeries exists
                    var seriesExists = await _applicationDbContext.QuestionSeries
                        .AnyAsync(s => s.Id == e.QuestionSeriesId.Value);
                    
                    if (!seriesExists)
                    {
                        Console.WriteLine($"WARNING: CourseMapElement {e.Id} has QuestionSeriesId {e.QuestionSeriesId.Value} but QuestionSeries doesn't exist in database!");
                    }
                    else
                    {
                        Console.WriteLine($"WARNING: CourseMapElement {e.Id} has QuestionSeriesId {e.QuestionSeriesId.Value} but Include didn't load it!");
                        // Manually load it
                        e.QuestionSeries = await _applicationDbContext.QuestionSeries
                            .Include(s => s.Elements)
                            .FirstOrDefaultAsync(s => s.Id == e.QuestionSeriesId.Value);
                    }
                }
            }

            return Ok(_mapper.Map<CourseMap, CourseMapViewModel>(Course));
        }


        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetCourseMapTESTINFOREXAM_2021_09_2_ById_PORTAL(int Id)
        {
            BaseUser Owner = null;
            try
            {
                Owner = await GetUser(_httpContextAccessor, _applicationDbContext);
            }
            catch
            {
                return Unauthorized();
            }


            var Course = await _applicationDbContext.CourseMap
                .Include(m => m.Course)
                .ThenInclude(c => c.Owners)
                .ThenInclude(o => o.Owner)
                .Include(c => c.Elements)
                .ThenInclude(e => e.QuestionSeries)
                .ThenInclude(qs => qs.Elements)
                .Include(c => c.Elements)
                .ThenInclude(e => e.RequiredElement)
                .Include(c => c.Elements)
                .ThenInclude(e => e.Badges)
                .FirstOrDefaultAsync(c => c.Id == Id);

            if (Course is null)
                return NotFound("Map Not Found");

            return Ok(_mapper.Map<CourseMap, CourseMapViewModel>(Course));
        }



        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetCourseMapViewEditById_PORTAL(int Id)
        {
            var Course = await _applicationDbContext.CourseMap

                .Include(m => m.Course)

                .ThenInclude(c => c.Owners)
                .ThenInclude(o => o.Owner)

                .Include(c => c.Elements)
                .ThenInclude(e => e.Relations)
                .ThenInclude(r => r.RequiredElement)


                .Include(c => c.Elements)
                .ThenInclude(e => e.QuestionSeries)
                //.ThenInclude(qs => qs.Elements)

                //.Include(c => c.Elements)
                //.ThenInclude(e => e.QuestionSeries)
                //.ThenInclude(qs => qs.Statistics)

                .Include(c => c.Elements)
                .ThenInclude(e => e.RequiredElement)
                
                .Include(c => c.Elements)
                .ThenInclude(e => e.Badges)
                
                .Include(m => m.BadgeSystems)
                .ThenInclude(s => s.Entities)
                
                .Include(m => m.Arrows)
                
                .Include(c => c.Elements)
                .ThenInclude(e => e.CourseMapElementImages)
                
                .Include(c => c.Elements)
                .ThenInclude(e => e.Background_Image)

                .Include(c => c.Elements)
                .ThenInclude(e => e.MapAttachment)
                .ThenInclude(a => a.Map)

                 .Include(c => c.Elements)
                .ThenInclude(e => e.QuestionnaireRelation)
                .ThenInclude(r => r.Questionnaire)

                .FirstOrDefaultAsync(c => c.Id == Id);

            if (Course is null)
                return NotFound("Map Not Found");

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Course));
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> ExportMapPDF(int Id)
        {
            var Map = await _applicationDbContext.CourseMap

                .Include(c => c.Elements)
                .ThenInclude(e => e.QuestionSeries)

                .FirstOrDefaultAsync(c => c.Id == Id);

            if (Map is null)
                return NotFound("Map not found");

            var document = new PdfDocument();

            PdfPage page = document.AddPage();
            XGraphics gfx = XGraphics.FromPdfPage(page);

            var basePath = Path.GetFullPath("wwwroot");
            var backgroundInage = XImage.FromFile(basePath + "/" + Map.LargeMapURL);

            XSize A4PageSize = PageSizeConverter.ToSize(PageSize.A4);

            double A4pageWidth = A4PageSize.Width;
            double A4pageHeight = A4PageSize.Height;

            double imageWidth = Map.LargeMapWidth;
            double imageHeight = Map.LargeMapLength;

            double resultingHeight = (((double)(imageHeight * A4pageWidth)) / imageWidth);

            gfx.DrawImage(backgroundInage, 0, 0, A4pageWidth, resultingHeight);

            //Draw elements 
            foreach(var e in Map.Elements)
            {
                var newX = (e.X * A4pageWidth) / imageWidth;
                var newY = (e.Y * resultingHeight) / imageHeight;
                var newW = (e.Width * A4pageWidth) / imageWidth;
                var newH = (e.Length * resultingHeight) / imageHeight;

                XRect elementRect = new XRect(newX, newY, newW, newH);
                //gfx.DrawRectangle(XPens.Transparent, elementRect);

                var rect = gfx.Transformer.WorldToDefaultPage(elementRect);
                var pdfrect = new PdfRectangle(rect);


                //Links
                var URL = e.ExternalVideoLink;

                //PDF
                if (string.IsNullOrEmpty(URL) && !string.IsNullOrEmpty(e.PDFURL))
                {
                    URL = MappingProfile.FILES_PATH + "/" + e.PDFURL;
                }

                //Series
                if (string.IsNullOrEmpty(URL))
                {
                    var series = e.QuestionSeries;

                    if(series != null)
                    {
                        URL = "http://167.86.98.171:3004/series_play/" + series.Code;
                    }

                }

                if (!string.IsNullOrEmpty(URL)) page.AddWebLink(pdfrect, URL);
            }

            byte[] response = null;
            using (MemoryStream ms = new MemoryStream())
            {
                document.Save(ms);
                response = ms.ToArray();
            }
            string fileName = Map.Title + ".pdf";
            return File(response, "application/pdf", fileName);
           
        }

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetCourseMapStatisticsById_PORTAL(int Id)
        {
            var Stats = await _applicationDbContext.CourseMap
               
                .Select(c => new
                {
                    Id = c.Id,
                    Elements = c.Elements.Select(e => new {
                        Id = e.Id,
                        PDFStatisticsCount = e.PDFStatistics.Count,
                        PDFStatisticsCountOnMobile = e.PDFStatistics.Count(s => s.OnMobile),

                         SeriesPlayCount = e.QuestionSeries != null ? e.QuestionSeries.Statistics.Count : 0,
                         SeriesPlayCountOnMobile = e.QuestionSeries != null ?
                         e.QuestionSeries.Statistics.Count(s => s.OnMobile) : 0,

                        SeriesPlayMedianTime = e.QuestionSeries != null ?
                        e.QuestionSeries.Statistics.OrderBy(a => a.TotalTime).Skip(e.QuestionSeries.Statistics.Count()/2).FirstOrDefault().TotalTime : 0,

                        LinkStatisticsCount = e.LinkStatistics.Count,

                    }).ToList()
                })
               .FirstOrDefaultAsync(c => c.Id == Id);

            if (Stats is null)
                return NotFound("Map Not Found");

            return Ok(Stats);
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteMap([FromBody]  CourseMapViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Map = await _applicationDbContext.CourseMap
                .Include(c => c.Elements)
                .FirstOrDefaultAsync(m => m.Id == VM.Id);

            if (Map is null)
                return NotFound();

            _applicationDbContext.CourseMap.Remove(Map);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditMapBasicInfo([FromBody]  CourseMapViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Map = await _applicationDbContext.CourseMap
                .Include(m => m.Course)
                .ThenInclude(c => c.CourseMaps)
                .Include(c => c.Elements)
                .FirstOrDefaultAsync(m => m.Id == VM.Id);

            if (Map is null)
                return NotFound();

            if (Map.Course.CourseMaps.Any(m => m.Id != Map.Id && m.Title == VM.Title))
                return BadRequest("Title Already Exist in Course");

            Map.Title = VM.Title;
            Map.ShowBorder = VM.ShowBorder;
            Map.Disabled = VM.Disabled;
            Map.ShowSolutions = VM.ShowSolutions;
            Map.KeyInfo = VM.KeyInfo;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditMapElementBasicInfo([FromBody]  CourseMapElementViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Element = await _applicationDbContext.CourseMapElement
                .Include(e => e.Map)
                
               .FirstOrDefaultAsync(e => e.Id == VM.Id);

            if (Element is null)
                return NotFound();

            if (string.IsNullOrEmpty(VM.Title))
                return BadRequest("Please Provide Title");

            Element.Title = VM.Title;
            Element.ExternalVideoLink = VM.ExternalVideoLink;
            Element.AdditionalInfo = VM.AdditionalInfo;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Element.Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ReassignMap(int CourseId, int MapId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Map = await _applicationDbContext.CourseMap
              .FirstOrDefaultAsync(m => m.Id == MapId);

            if (Map is null)
                return NotFound("Map not found");

            var Course = await _applicationDbContext.Courses
                .FirstOrDefaultAsync(c => c.Id == CourseId);

            if (Course is null)
                return NotFound("Course not found");

            if(Course.DataPoolId != Map.DataPoolId)
                return BadRequest("Datapool mismatch");

            Map.CourseId = Course.Id;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteElement([FromBody]  CourseMapElementViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Element = await _applicationDbContext.CourseMapElement
                 .Include(e => e.Badges)
                 .Include(e => e.Map)
                .FirstOrDefaultAsync(e => e.Id == VM.Id);

            if (Element is null)
                return NotFound();

            _applicationDbContext.CourseMapElement.Remove(Element);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Element.Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteArrow(int Id)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Map = await _applicationDbContext.CourseMap
                 .Include(e => e.Arrows)
                .FirstOrDefaultAsync(e => e.Arrows.Any(ar => ar.Id == Id));

            if (Map is null)
                return NotFound("Arrow not found");

            var arrow = Map.Arrows.FirstOrDefault(ar => ar.Id == Id);
            Map.Arrows.Remove(arrow);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AttachMapToElement(int ElementId, int MapId)
        {
            
            var Element = await _applicationDbContext.CourseMapElement
                .Include(e => e.MapAttachment)
                .FirstOrDefaultAsync(e => e.Id == ElementId);

            if (Element is null)
                return NotFound("Element not found");

            var Map = await _applicationDbContext.CourseMap
              .FirstOrDefaultAsync(m => m.Id == MapId);
            
            if (Map is null)
                return NotFound("Map not found");

            if (Map.Id == Element.MapId)
                return NotFound("Cannot attach the element's parent map to it");

            if (Element.MapAttachment != null)
            {
                _applicationDbContext.MapElementLink.Remove(Element.MapAttachment);

                await _applicationDbContext.SaveChangesAsync();
            }

            Element.MapAttachment = new MapElementLink() { 
                ElementId = Element.Id,
                MapId = Map.Id
            };

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapElementViewModel>(Element));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeattachMapToElement(int ElementId)
        {

            var Element = await _applicationDbContext.CourseMapElement
                .Include(e => e.MapAttachment)
                .FirstOrDefaultAsync(e => e.Id == ElementId);

            if (Element is null)
                return NotFound("Element not found");

            if (Element.MapAttachment != null)
            {
                _applicationDbContext.MapElementLink.Remove(Element.MapAttachment);

                await _applicationDbContext.SaveChangesAsync();
            }


            return Ok(_mapper.Map<CourseMapElementViewModel>(Element));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditArrowDashed(int Id)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Map = await _applicationDbContext.CourseMap
                 .Include(e => e.Arrows)
                .FirstOrDefaultAsync(e => e.Arrows.Any(ar => ar.Id == Id));

            if (Map is null)
                return NotFound("Arrow not found");

            var arrow = Map.Arrows.FirstOrDefault(ar => ar.Id == Id);

            arrow.Dashed = !arrow.Dashed;
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditArrowColor(int Id, string Color)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Map = await _applicationDbContext.CourseMap
                 .Include(e => e.Arrows)
                .FirstOrDefaultAsync(e => e.Arrows.Any(ar => ar.Id == Id));

            if (Map is null)
                return NotFound("Arrow not found");

            var arrow = Map.Arrows.FirstOrDefault(ar => ar.Id == Id);

            arrow.Color = Color;
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteElementBackgroundImage([FromBody]  CourseMapElementViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Element = await _applicationDbContext.CourseMapElement
                 .Include(e => e.Badges)
                .FirstOrDefaultAsync(e => e.Id == VM.Id);

            if (Element is null)
                return NotFound("Element not found");

            Element.Background_Image = null;
            Element.Background_ImageId = null;
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Element.Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteElementSeries([FromBody]  CourseMapElementViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Element = await _applicationDbContext.CourseMapElement
                .Include(e => e.Map)
                .FirstOrDefaultAsync(e => e.Id == VM.Id);

            if (Element is null)
                return NotFound();

            if (Element.Map.IsSeriesMap)
                return BadRequest("Can't Delete Series, Series Map!");

            Element.QuestionSeriesId = null;
            Element.QuestionSeries = null;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Element.Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SetElementSeries([FromBody]  CourseMapElementViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Element = await _applicationDbContext.CourseMapElement
                .Include(e => e.Map)
                .FirstOrDefaultAsync(e => e.Id == VM.Id);

            if (Element is null)
                return NotFound();

            var Series = await _applicationDbContext.QuestionSeries
                .FirstOrDefaultAsync(s => VM.QuestionSeriesId.HasValue ? s.Id == VM.QuestionSeriesId.Value : false);

            if (Series is null)
                return NotFound("Series Not Found");


            Element.QuestionSeriesId = Series.Id;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Element.Map));
        }

        [HttpPost("[action]")] 
        public async Task<IActionResult> AddMapElements([FromBody]  CourseMapViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Map = await _applicationDbContext.CourseMap
               
                .Include(c => c.Elements)
                .FirstOrDefaultAsync(m => m.Id == VM.Id);

            if (Map is null)
                return NotFound();

            if (!VM.Elements.Any())
                return BadRequest("Please Include Elements");

            if (VM.Elements.Any(e => string.IsNullOrEmpty(e.Title)))
                return BadRequest("Elements Should Have Title");

            if(Map.Elements.Any(e => VM.Elements.Any(evm => !string.IsNullOrEmpty(e.Title) ? evm.Title.ToUpper() == e.Title.ToUpper() : false)))
                return BadRequest("Element Titles Should Be Unique");

            if (Map.IsSeriesMap && VM.Elements.Any(e => !e.QuestionSeriesId.HasValue))
                return BadRequest("Series Map!, Elements Should Have Series Relation");

            var Series = await _applicationDbContext.QuestionSeries
               .Where(s => VM.Elements.Any(e => e.QuestionSeriesId == s.Id))
               .ToListAsync();

            if (Series.Count != VM.Elements.Where(e => e.QuestionSeriesId != null).Select(e => e.QuestionSeriesId).Distinct().Count())
                return BadRequest("Some Questions Series Do Not Exist");

            //Check Required Elements
            var RequiredElements = await _applicationDbContext.CourseMapElement
                .Where(e => VM.Elements.Any(evm => evm.RequiredElementId.HasValue && evm.RequiredElementId == e.Id))
                .ToListAsync();

            if(RequiredElements.Count != VM.Elements.Where(evm => evm.RequiredElementId.HasValue).Count())
                return BadRequest("Some Elements' Prequisit Element does not Exist");


            if (VM.Elements.Any(evm => evm.RequiredElementId.HasValue && (evm.Threshold <= 0 || evm.Threshold > 100)))
                return BadRequest("Threshold Should be Positive and Less than 100%");


            Map.Elements.AddRange(VM.Elements.Select(e => new CourseMapElement()
            {
                Title = e.Title,
                QuestionSeriesId = e.QuestionSeriesId,
                ExternalVideoLink = e.ExternalVideoLink,
                X = e.X,
                Y = e.Y,
                Width = e.Width,
                Length = e.Length,
                Threshold = e.Threshold,
                RequiredElementId =(e.RequiredElementId.HasValue ?
                 new Nullable<int>(RequiredElements.FirstOrDefault(edb => edb.Id == e.RequiredElementId.Value).Id) : null)
            }));

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Map));
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditElementPDF(int ElementId, IFormFile PDF)
        {
            //Check Element Exists
            var Element = await _applicationDbContext.CourseMapElement
                 .Include(e => e.Map)
                 .FirstOrDefaultAsync(e => e.Id == ElementId);

            if (Element is null)
                return NotFound();


            if (Element is null)
                return NotFound($"Element {ElementId} Not Found");

            if (PDF is null)
                return BadRequest("Please Provide PDF File");

            //Verify Extension
            var validExtenstions = new List<string>() { ".pdf" };

            var fileExtensionIsValid = validExtenstions.Any(ve => PDF.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            // Generate a Path for The Picture
            var path = Path.Combine(
                 "wwwroot/Maps",
                 "PDF");

            var URL = await SaveFile(path, PDF);

            Element.PDFURL = URL;
            Element.PDFSize = PDF.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Element.Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditElementAudio(int ElementId, IFormFile Audio)
        {
            //Check Element Exists
            var Element = await _applicationDbContext.CourseMapElement
                 .Include(e => e.Map)
                 .FirstOrDefaultAsync(e => e.Id == ElementId);

            if (Element is null)
                return NotFound($"Element not found");

            if (Audio is null)
                return BadRequest("Please Provide PDF File");

            //Verify Extension
            var validExtenstions = new List<string>() { ".mp3" };

            var fileExtensionIsValid = validExtenstions.Any(ve => Audio.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Audio extension not valid");
            }

            // Generate a Path for The Picture
            var path = Path.Combine(
                 "wwwroot/Maps",
                 "Audio");

            var URL = await SaveFile(path, Audio);

            Element.AudioURL = URL;
            Element.AudioSize = Audio.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Element.Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveElementPDF(int ElementId)
        {
            //Check Element Exists
            var Element = await _applicationDbContext.CourseMapElement
                .Include(e => e.Map)
                 .FirstOrDefaultAsync(e => e.Id == ElementId);

            if (Element is null)
                return NotFound();


            if (Element is null)
                return NotFound($"Element {ElementId} Not Found");

            Element.PDFURL = null;
            Element.PDFSize = 0;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Element.Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveElementAudio(int ElementId)
        {
            //Check Element Exists
            var Element = await _applicationDbContext.CourseMapElement
                .Include(e => e.Map)
                 .FirstOrDefaultAsync(e => e.Id == ElementId);

            if (Element is null)
                return NotFound($"Element not found");

            Element.AudioURL = null;
            Element.AudioSize = 0;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Element.Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditElementVideo(int ElementId, IFormFile Video)
        {
            //Check Element Exists
            var Element = await _applicationDbContext.CourseMapElement
                 .FirstOrDefaultAsync(e => e.Id == ElementId);

            if (Element is null)
                return NotFound();


            if (Element is null)
                return NotFound($"Element {ElementId} Not Found");

            if (Video is null)
                return BadRequest("Please Provide Video File");

            //Verify Extension
            var validExtenstions = new List<string>() { ".mp4" };

            var fileExtensionIsValid = validExtenstions.Any(ve => Video.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            // Generate a Path for The Picture
            var path = Path.Combine(
                 "wwwroot/Maps",
                 "Video");

            var URL = await SaveFile(path, Video);

            Element.VideoURL = URL;
            Element.VideoSize = Video.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveElementVideo(int ElementId)
        {
            //Check Element Exists
            var Element = await _applicationDbContext.CourseMapElement
                 .FirstOrDefaultAsync(e => e.Id == ElementId);

            if (Element is null)
                return NotFound();


            if (Element is null)
                return NotFound($"Question {ElementId} Not Found");

            Element.VideoURL = null;
            Element.VideoSize = 0;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ClearElementRelations(
            int BaseElementId
        )
        {
            var map = await _applicationDbContext.CourseMap
                .Include(m => m.Elements)
                .ThenInclude(e => e.Relations)
                .FirstOrDefaultAsync(m => m.Elements.Any(a => a.Id == BaseElementId));

            if (map is null)
                return BadRequest("Element not found");

            var baseElement = map.Elements.FirstOrDefault(e => e.Id == BaseElementId);

            baseElement.Relations.Clear();

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AssingElementRelations(
            int BaseElementId,
            List<int> RequiredElementsIds,
            List<int> Thresholds
        )
        {

            //Check base element not in required elements
            if (RequiredElementsIds.Any(Id => Id == BaseElementId))
                return BadRequest("Base element cannot be in required elements");

            //Check required elements not repeated
            if (RequiredElementsIds.Distinct().Count() != RequiredElementsIds.Count())
                return BadRequest("Repeated required elements");

            //Check thrsholds exists for every required element
            if (Thresholds.Count != RequiredElementsIds.Count)
                return BadRequest("Every required element should have a corrosponding threshold");

            //Check thrsholds between 0 and 100
            if (Thresholds.Any(t => t < 1 || t > 100))
                return BadRequest("Please provide valid values for the thresholds");

            var map = await _applicationDbContext.CourseMap
                .Include(m => m.Elements)
                .ThenInclude(e => e.Relations)
                .FirstOrDefaultAsync(m => m.Elements.Any(a => a.Id == BaseElementId));

            if (map is null)
                return BadRequest("Base element not found");

            var requiredElements = map.Elements.Where(e => RequiredElementsIds.Any(Id => Id == e.Id)).ToList();

            if (RequiredElementsIds.Count != requiredElements.Count)
                return BadRequest("Atleast one required element not found");


            var baseElement = map.Elements.FirstOrDefault(e =>e.Id == BaseElementId);

            baseElement.Relations.Clear();

            baseElement.Relations.AddRange(requiredElements.Select((a ,ai) => new CourseMapRequiredElementRelation()
            {
                BaseElementId = baseElement.Id,
                RequiredElementId = a.Id,
                Threshold = Thresholds[ai]
            }));

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditElementRelation([FromBody] CourseMapElementViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            //Check Element Exists
            var Element = await _applicationDbContext.CourseMapElement
                .Include(e => e.Map)
                 .FirstOrDefaultAsync(e => e.Id == VM.Id);

            if (Element is null)
                return NotFound();

            if (!VM.RequiredElementId.HasValue)
                return BadRequest("Please Provide Required Element Id");

            //Check Required Element Exists
            var RElement = await _applicationDbContext.CourseMapElement
                 .FirstOrDefaultAsync(e => e.Id == VM.RequiredElementId.Value);

            if (RElement is null)
                return NotFound();

            if (Element.Id == RElement.Id)
                return BadRequest("Can't Assign Element to Itself");

            if (VM.Threshold <= 0)
                return BadRequest("Threshold Should be Positive");

            if (VM.Threshold > 100)
                return BadRequest("Threshold Can't be more than 100%");

            Element.RequiredElementId = RElement.Id;
            Element.Threshold = VM.Threshold;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Element.Map));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveElementRelation([FromBody] CourseMapElementViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            //Check Element Exists
            var Element = await _applicationDbContext.CourseMapElement
                 .FirstOrDefaultAsync(e => e.Id == VM.Id);

            if (Element is null)
                return NotFound();

            if (!VM.RequiredElementId.HasValue)
                return BadRequest("Please Provide Required Element Id");

            Element.RequiredElementId = null;
            Element.Threshold = 0;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapElement, CourseMapElementViewModel>(Element));
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditElementBadge(int ElementId, int Progress, IFormFile Picture)
        {
            //Check Element Exists
            var Element = await _applicationDbContext.CourseMapElement
                .Include(e => e.Badges)
                .Include(e => e.Map)
                 .FirstOrDefaultAsync(e => e.Id == ElementId);

            if (Element is null)
                return NotFound("Element Not Found");

            if (Picture is null)
                return BadRequest("Please Provide PDF File");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };

            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            if (Progress < 0)
                return BadRequest("Threshold Should be Zero or Positive");

            if (Progress > 100)
                return BadRequest("Threshold Can't be more than 100%");

            if (Element.Badges.Any(b => b.Progress == Progress))
                return BadRequest("a Badge with Same Progress Target exists for this Element");

            // Generate a Path for The Picture
            var path = Path.Combine(
                 "wwwroot/Maps",
                 "Pictures");

            var URL = await SaveFile(path, Picture);

            Element.Badges.Add(new CourseMapElementBadge()
            {
                URL = URL,
                Progress = Progress
            });
            

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapView2Model>(Element.Map));

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditElementBadge(int BadgeId, IFormFile Picture)
        {
            //Check Element Exists
            var Badge = await _applicationDbContext.CourseMapElementBadge
              .FirstOrDefaultAsync(b => b.Id == BadgeId);

            if (Badge is null)
                return NotFound("Badge Not Found");

            if (Picture is null)
                return BadRequest("Please Provide PDF File");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };

            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }

            // Generate a Path for The Picture
            var path = Path.Combine(
                 "wwwroot/Maps",
                 "Pictures");

            var URL = await SaveFile(path, Picture);
            Badge.URL = URL;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapElementBadge, CourseMapElementBadgeViewModel> (Badge));

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditElementBadgeLocation([FromBody] CourseMapElementViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            //Check Element Exists
            var Element = await _applicationDbContext.CourseMapElement
                 .FirstOrDefaultAsync(e => e.Id == VM.Id);

            if (Element is null)
                return NotFound();

            Element.Badge_X = VM.Badge_X;
            Element.Badge_Y = VM.Badge_Y;
            Element.Badge_Width = VM.Badge_Width;
            Element.Badge_Length = VM.Badge_Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapElement, CourseMapElementViewModel>(Element));

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditElementLocation([FromBody] CourseMapElementViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            //Check Element Exists
            var Element = await _applicationDbContext.CourseMapElement
                 .FirstOrDefaultAsync(e => e.Id == VM.Id);

            if (Element is null)
                return NotFound();

            Element.X = VM.X;
            Element.Y = VM.Y;
            Element.Width = VM.Width;
            Element.Length = VM.Length;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapElement, CourseMapElementViewModel>(Element));

        }


        [HttpPost("[action]")]
        public async Task<IActionResult> EditMapImage(int MapId, float Ratio, IFormFile Picture)
        {
            //Check Element Exists
            var Map = await _applicationDbContext.CourseMap
                 .FirstOrDefaultAsync(m=> m.Id == MapId);

            if (Map is null)
                return NotFound("Map Not Found");

            if (Picture is null)
                return BadRequest("Please Provide PDF File");

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };

            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return BadRequest("Picture Extenstion Not Valid");
            }



            // Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/CourseaMap");

            var URL = await SaveFile(path, Picture);

            Map.LargeMapURL = URL; 
            Map.LargeMapLength = (int)(Ratio * Map.LargeMapWidth);

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMap, CourseMapViewModel>(Map));

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveElementBadge([FromBody] CourseMapElementBadgeViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Badge = await _applicationDbContext.CourseMapElementBadge
                .Include(b => b.CourseMapElement)
                .FirstOrDefaultAsync(b => b.Id == VM.Id);

            if (Badge is null) 
                return NotFound("Badge Not Found");

            var Element = Badge.CourseMapElement;

            _applicationDbContext.CourseMapElementBadge.Remove(Badge);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapElement, CourseMapElementViewModel>(Element));

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditElementBadgePercentage([FromBody] CourseMapElementBadgeViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Badge = await _applicationDbContext.CourseMapElementBadge
                .Include(e => e.CourseMapElement)
                .ThenInclude(e => e.Badges)
                .FirstOrDefaultAsync(b => b.Id == VM.Id);

            if (Badge is null)
                return NotFound("Badge Not Found");

            if (VM.Progress < 0)
                return BadRequest("Threshold Should be Zero or Positive");

            if (VM.Progress > 100)
                return BadRequest("Threshold Can't be more than 100%");

            if (Badge.CourseMapElement.Badges.Any(b => b.Progress == VM.Progress && b.Id != Badge.Id))
                return BadRequest("a Badge with Same Progress Target exists for this Element");

            Badge.Progress = VM.Progress;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapElement, CourseMapElementViewModel>(Badge.CourseMapElement));

        }


        [HttpPost("[action]")]
        public async Task<IActionResult> SetElementAsFinal(int ElementId)
        {
            //Get Map
            var Map = await _applicationDbContext.CourseMap
               .Include(s => s.Elements)
               .FirstOrDefaultAsync(s => s.Elements.Any(e => e.Id == ElementId));

            if (Map is null)
                return NotFound("Element Not Found");

            foreach(var E in Map.Elements)
            {
                E.IsFinal = false;
            }

            var Element = Map.Elements.FirstOrDefault(e => e.Id == ElementId);

            Element.IsFinal = true;

            await _applicationDbContext.SaveChangesAsync();

            return Ok(_mapper.Map<CourseMapElement, CourseMapElementViewModel>(Element));
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> GetSolutionKey([FromBody] POSTKEY VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Data");

            var Map = await _applicationDbContext.CourseMap
                .Include(m => m.Course)
                .FirstOrDefaultAsync(m => m.Id == VM.MapId);

            if (Map is null)
                return NotFound(); 

            var PlayerId = EncryptString(SECRET2, VM.PlayerId);

            var euTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time");
            DateTime euTime = TimeZoneInfo.ConvertTime(DateTime.Now, TimeZoneInfo.Local, euTimeZone);

            var Value = EncryptString(SECRET,
                euTime.Hour + ":" + euTime.Minute + " " + euTime.ToString("dd.MM.yyyy") + "|"
                + Map.Id + "|" + Map.Title
                + "|" + VM.Key + "|" + PlayerId);

            var NewKey = new CourseMapKey()
            {
                MapId = Map.Id,
                Key = VM.Key,
                DataPoolId = Map.Course.DataPoolId
            };

            _applicationDbContext.CourseMapKeys.Add(NewKey);
            await _applicationDbContext.SaveChangesAsync();

            return Ok(new
            {
                Encrypted = Value,
                //Decrypted = DecryptString(SECRET, Value)
            });
        }

        [HttpGet("[action]/{Key}")]
        public async Task<IActionResult> GetTasksPlayedByKey(string Key)
        {
            var Tasks = await _applicationDbContext.QuestionStatistic
                .Include(s => s.Question)
                .Where(s => s.Key == Key)
                .ToListAsync();

            return Ok(Tasks.OrderBy(t => t.DateCreated).Select(t => new
            {
                DateTime = t.DateCreated.Value.ToLocalTime().ToString("hh:mm dd.MM.yyyy"),
                Id = t.Question.Id,
                Code = t.Question.Code,
                Correct = t.Correct
            }));


        }


        [HttpGet("[action]/{Formula}")]
        public async Task<IActionResult> DecryptKey(string Formula)
        {
            
            return Ok(new
            {
                Decrypted = DecryptString(SECRET, Formula)
            });
        }
        
        [HttpPost("[action]")]
        public async Task<IActionResult> CopyMap([FromBody] CopyMapViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            //Get Question
            var Map = await _applicationDbContext.CourseMap
                .Include(m => m.Course)
                .Include(c => c.Elements)
                .ThenInclude(e => e.QuestionSeries)
                .ThenInclude(qs => qs.Elements)
                .Include(c => c.Elements)
                .ThenInclude(e => e.RequiredElement)
                .Include(c => c.Elements)
                .ThenInclude(e => e.Badges)
                .Include(m => m.BadgeSystems)
                .ThenInclude(s => s.Entities)
                .Include(m => m.Arrows)
                .FirstOrDefaultAsync(q => q.Id == VM.MapId);

            if (Map is null)
                return NotFound("Map Not Found");

            if (string.IsNullOrEmpty(VM.Title))
                return NotFound("Title cannot be empty");

            var Owner = await GetUser(_httpContextAccessor, _applicationDbContext);

            if (Owner is null)
                return BadRequest("Owner not identified");

            var Course = await _applicationDbContext.Courses
                .Include(c => c.Owners)
                .Include(c => c.CourseMaps)
                .FirstOrDefaultAsync(m => m.Id == VM.CourseId);

            if (Course is null)
                return BadRequest("Course not found");

            /*if (!Course.Owners.Any(o => o.OwnerId == Owner.Id))
                return BadRequest("You do not own selected course");*/

            var CodeExists = Course.CourseMaps
                .Any(m => m.Title == VM.Title);

            if (CodeExists)
                return BadRequest("Title already exists within selected course");

            var WWROOT_PATH = _environment.WebRootPath;

            var Copy = new CourseMap() {
                Title = VM.Title,
                CourseId = Course.Id,
                LargeMapURL = Map.LargeMapURL,
                LargeMapWidth = Map.LargeMapWidth,
                LargeMapLength = Map.LargeMapLength,
                ShowBorder = Map.ShowBorder,
                Disabled = Map.Disabled,

                Elements = Map.Elements.Select((e) => new CourseMapElement()
                {
                    Title = e.Title,
                    Background_ImageId = e.Background_ImageId,

                    Badge_X = e.Badge_X,
                    Badge_Y = e.Badge_Y,
                    Badge_Width = e.Badge_Width,
                    Badge_Length = e.Badge_Length,

                    X = e.X,
                    Y = e.Y,
                    Width = e.Width,
                    Length = e.Length,

                    VideoURL = e.VideoURL,
                    VideoSize = e.VideoSize,

                    ExternalVideoLink = e.ExternalVideoLink,

                    PDFURL = e.PDFURL,
                    PDFSize = e.PDFSize,

                    QuestionSeriesId = e.QuestionSeriesId,

                    Badges = e.Badges.Select((b) => new CourseMapElementBadge {
                    
                    Progress = b.Progress,
                    URL = b.URL,
                    }).ToList()
                }).ToList(),

                Arrows = Map.Arrows.Select((a) => new CourseMapArrow()
                {
                    X1 = a.X1,
                    X2 = a.X2,
                    Y1 = a.Y1,
                    Y2 = a.Y2,

                    Color = a.Color,
                    Dashed = a.Dashed
                }).ToList()
            };


            
            foreach (var bs in Map.BadgeSystems)
            {
                var nbs = new CourseMapBadgeSystem()
                {
                    Title = bs.Title
                };

                foreach(var e in bs.Entities)
                {
                    var new_e = new CourseMapBadgeSystemEntity()
                    {
                        Progress = e.Progress
                    };

                    var file_copy = WWROOT_PATH + '/'+ e.URL;

                    var new_file_name = Path.Combine("CourseaMap", Path.GetRandomFileName() + ".jpg");

                    System.IO.File.Copy(file_copy, WWROOT_PATH + "/"+ new_file_name);

                    new_e.URL = new_file_name;

                    nbs.Entities.Add(new_e);

                    foreach(var el in Copy.Elements.Where(ell => ell.Badges.Any(b => b.URL == e.URL))){
                        foreach(var bdg in el.Badges.Where(bgdd => bgdd.URL == e.URL))
                        {
                            bdg.URL = new_e.URL;
                        }
                    }

                    Copy.BadgeSystems.Add(nbs);

                }
            }

            _applicationDbContext.CourseMap.Add(Copy);
            await _applicationDbContext.SaveChangesAsync();
            return  Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEditElementBackgroundImage(int PartId, IFormFile Picture)
        {
            CourseMapElement Part = await _applicationDbContext.CourseMapElement
                .FirstOrDefaultAsync(e => e.Id == PartId);

            if(Part is null)
            {
                return NotFound("Element not found");
            }

            //Verify Extension
            var validExtenstions = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtensionIsValid = validExtenstions.Any(ve => Picture.FileName.EndsWith(ve));

            if (!fileExtensionIsValid)
            {
                return Ok("Picture Extenstion Not Valid");
            }

            //Generate a Path for The Picture
            var path = Path.Combine(
                "wwwroot/CourseaMap",
                "BackgroundImage");

            var URL = await SaveFile(path, Picture);
            Part.BackgroundImage = URL;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddArrows([FromBody]  AddArrowsViewModel VM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var Map = await _applicationDbContext.CourseMap
                .Include(m => m.Arrows)
                .Include(m => m.BadgeSystems)
                .FirstOrDefaultAsync(m => m.Id == VM.MapId);

            if (Map is null)
                return NotFound("Map Not Found");
            
            Map.Arrows.AddRange(VM.Arrows.Select(ar => new CourseMapArrow() { 
                X1 = ar.X1,
                X2 = ar.X2,
                Y1 = ar.Y1,
                Y2 = ar.Y2,
                Color = ar.Color,
                Dashed = ar.Dashed
            }));

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddPDFStatistic(int ElementId, string Player, bool OnMobile)
        {

            var element = await _applicationDbContext.CourseMapElement
                .FirstOrDefaultAsync(q => q.Id == ElementId);

            if (element is null)
                return NotFound("not found");

            element.PDFStatistics.Add(new CourseMapPDFStatistics()
            {
                Player = Player,
                OnMobile = OnMobile
            });

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddLinkStatistic(int ElementId, string Player)
        {
            var element = await _applicationDbContext.CourseMapElement
                .FirstOrDefaultAsync(q => q.Id == ElementId);

            if (element is null)
                return NotFound("not found");

            if (string.IsNullOrEmpty(element.ExternalVideoLink))
                return BadRequest("Element has no link");

            element.LinkStatistics.Add(new CourseMapLinkStatistics()
            {
                Player = Player,
                DataPoolId = element.DataPoolId,

                CurrentLink = element.ExternalVideoLink
            });

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }


    }
}
