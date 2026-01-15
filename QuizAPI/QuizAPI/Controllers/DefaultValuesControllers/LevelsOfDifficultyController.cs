using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.DefaultValues.LevelsOfDifficulty;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Controllers.DefaultValuesControllers
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class LevelsOfDifficultyController : Controller
    {
        private readonly IMapper _mapper;
        public const string FILES_PATH = "http://167.86.98.171:6001/Files/";

        private readonly ApplicationDbContext _applicationDbContext;

        public LevelsOfDifficultyController(
            IMapper mapper,
            ApplicationDbContext applicationDbContext
        )
        {
            _mapper = mapper;
            _applicationDbContext = applicationDbContext;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("[action]")]
        public async Task<IActionResult> GetLevelsOfDifficulty()
        {
            var Levels = await _applicationDbContext.LevelsOfDifficulty
                .ToListAsync();

            return Ok(_mapper.Map<List<LevelOfDifficulty>, List<LevelOfDifficultyViewModel>>(Levels));
        }

        [HttpGet("[action]/{DataPoolId}")]
        public async Task<IActionResult> GetLevelsOfDifficulty(int DataPoolId)
        {
            var Levels = await _applicationDbContext.LevelsOfDifficulty
                .ToListAsync();

            return Ok(_mapper.Map<List<LevelOfDifficulty>, List<LevelOfDifficultyViewModel>>(Levels));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetLevelsOfDifficulty_PORTAL_EXTENDED_DETAILS()
        {
            var Levels = await _applicationDbContext.LevelsOfDifficulty
                .Select(LOD => new
                {
                    Id = LOD.Id,
                    Name = LOD.Name,
                    HexColor = LOD.HexColor,
                    NUsedQuestions = LOD.Questions.Count,
                    CodeUsedQuestions = LOD.Questions.Select(q => q.Code)
                })
                .ToListAsync();

            return Ok(Levels);
        }

        [HttpGet("[action]/{LODId}")]
        public async Task<IActionResult> GetLevelOfDifficultyQuestions(int LODId)
        {
            var level = await _applicationDbContext.LevelsOfDifficulty
                .Include(l => l.Questions)
                .ThenInclude(q => q.Subtopic)
                .ThenInclude(s => s.Topic)

                .Include(l => l.Questions)
                .ThenInclude(q => q.DataPool)

                .Include(l => l.Questions)
                .ThenInclude(q => q.AddedBy)

                .FirstOrDefaultAsync(l => l.Id == LODId);

            if (level is null)
                return NotFound("Not found");

            var qs = level.Questions
                .Select(q => new {
                Id = q.Id,
                Code = q.Code,
                Type = q.Type,

                DatapoolName = q.DataPool.NickName,
                DatapoolId = q.DataPool.Id,

                DateCreated = q.DateCreated,

                Base_ImageURL = $"{FILES_PATH}/{q.Base_ImageURL}",

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

            }).OrderBy(q => q.Code).ToList();

            return Ok(qs);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddLevel([FromBody] LevelOfDifficultyViewModel LevelVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Name Not Null
            if (string.IsNullOrEmpty(LevelVM.Name))
                return BadRequest("Name Can't Be Empty");

            //Check HexColor Not Null
            if (string.IsNullOrEmpty(LevelVM.HexColor))
                return BadRequest("Color Can't Be Empty");

            //Check Name Not Taken
            var NameTaken = await _applicationDbContext.LevelsOfDifficulty
                .AnyAsync(l => l.Name == LevelVM.Name);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            //Check Color Not Taken
            var ColorTaken = await _applicationDbContext.LevelsOfDifficulty
                .FirstOrDefaultAsync(l => l.HexColor == LevelVM.HexColor);

            if (ColorTaken != null)
                return BadRequest($"Color {LevelVM.HexColor} Taken By Level {ColorTaken.Name}, Choose Different Color");

            //Create Level
            var Level = new LevelOfDifficulty()
            {
                Name = LevelVM.Name,
                HexColor = LevelVM.HexColor
            };

            _applicationDbContext.LevelsOfDifficulty.Add(Level);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditLevel([FromBody] LevelOfDifficultyViewModel LevelVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Level Exists
            var Level = await _applicationDbContext.LevelsOfDifficulty
                .FirstOrDefaultAsync(l => l.Id == LevelVM.Id);

            if (Level is null)
                return BadRequest("Not Found");

            //Check Name Not Null
            if (string.IsNullOrEmpty(LevelVM.Name))
                return BadRequest("Name Can't Be Empty");

            //Check HexColor Not Null
            if (string.IsNullOrEmpty(LevelVM.HexColor))
                return BadRequest("Color Can't Be Empty");

            //Check Name Not Taken
            var NameTaken = await _applicationDbContext.LevelsOfDifficulty
                .AnyAsync(l => l.Id != LevelVM.Id && l.Name == LevelVM.Name);

            if (NameTaken)
                return BadRequest("Name Taken, Choose Different Name");

            //Check Color Not Taken
            var ColorTaken = await _applicationDbContext.LevelsOfDifficulty
                .FirstOrDefaultAsync(l => l.Id != LevelVM.Id && l.HexColor == LevelVM.HexColor);

            if (ColorTaken != null)
                return BadRequest($"Color {LevelVM.HexColor} Taken By Level {ColorTaken.Name}, Choose Different Color");

            Level.Name = LevelVM.Name;
            Level.HexColor = LevelVM.HexColor;

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteLevel([FromBody] DeleteLevelOfDifficultyViewModel LevelVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            //Check Level Exists
            var Level = await _applicationDbContext.LevelsOfDifficulty
                .Include(l => l.Questions)
                .FirstOrDefaultAsync(l => l.Id == LevelVM.Id);

            if (Level is null)
                return BadRequest("Not Found");

            if (Level.Questions.Count != 0 && LevelVM.TransferLODId == -1)
                return BadRequest("Should Choose Transfer LOD");

            if(LevelVM.TransferLODId != -1)
            {
                var TLevel = await _applicationDbContext.LevelsOfDifficulty
                .FirstOrDefaultAsync(l => l.Id == LevelVM.TransferLODId);

                if (TLevel is null)
                    return BadRequest("Transfer Not Found");

                var Questions = Level.Questions;

                foreach(var q in Questions)
                {
                    q.LevelOfDifficulty = TLevel;
                }

                await _applicationDbContext.SaveChangesAsync();
            }

            _applicationDbContext.LevelsOfDifficulty.Remove(Level);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
