using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models.Course;
using QuizAPI.Models.Course.ViewModels;
using QuizAPI.Models.Ownership;
using QuizAPI.Models.Ownership.ClickTrees;
using QuizAPI.Models.Ownership.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.OwnershipController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class OwnershipController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;

        public OwnershipController(
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
        public async Task<IActionResult> EditOwnership([FromBody] EditOwnershipViewModel OVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Model Not Valid");

            var Users = await _applicationDbContext.Users
                .Where(u => OVM.Owners.Any(o => o == u.Name))
                .ToListAsync();

            if (Users.Count != OVM.Owners.Distinct().Count())
                return BadRequest("Some Users Not Found");

            dynamic Entity = null;

            switch (OVM.Type)
            {
                case EntityType.CLICK_IMAGE:
                    {
                        Entity = await _applicationDbContext.ImageAnswerGroups
                            .Include(c => c.Owners)
                            .FirstOrDefaultAsync(c => c.Id == OVM.Id);

                        if (Entity is null)
                            return NotFound();

                        Entity.Owners.Clear();
                        Entity.Owners.AddRange(Users.Select(u => new ClickTreeOwner()
                        {
                            Owner = u
                        }));

                        break;
                    }

                case EntityType.INTERPRETED_IMAGE:
                    {
                        Entity = await _applicationDbContext.InterpretedImageGroups
                            .Include(c => c.Owners)
                            .FirstOrDefaultAsync(c => c.Id == OVM.Id);

                        if (Entity is null)
                            return NotFound();

                        Entity.Owners.Clear();
                        Entity.Owners.AddRange(Users.Select(u => new InterpretedTreeOwner()
                        {
                            Owner = u
                        }));
                        break;
                    }

                case EntityType.COURSE:
                    {
                        Entity = await _applicationDbContext.Courses
                            .Include(c => c.Owners)
                            .FirstOrDefaultAsync(c => c.Id == OVM.Id);

                        if (Entity is null)
                            return NotFound();

                        Entity.Owners.Clear();
                        Entity.Owners.AddRange(Users.Select(u => new CourseOwner()
                        {
                            Owner = u
                        }));

                        break;
                    }

                case EntityType.KEYBOARD:
                    {
                        Entity = await _applicationDbContext.Keyboards
                            .Include(c => c.Owners)
                            .FirstOrDefaultAsync(c => c.Id == OVM.Id);

                        if (Entity is null)
                            return NotFound();

                        Entity.Owners.Clear();
                        Entity.Owners.AddRange(Users.Select(u => new KeyboardOwner()
                        {
                            Owner = u
                        }));

                        break;
                    }

                case EntityType.TOPIC:
                    {
                        Entity = await _applicationDbContext.Topics
                            .Include(c => c.Owners)
                            .FirstOrDefaultAsync(c => c.Id == OVM.Id);

                        if (Entity is null)
                            return NotFound();

                        Entity.Owners.Clear();
                        Entity.Owners.AddRange(Users.Select(u => new TopicOwner()
                        {
                            Owner = u
                        }));

                        break;

                    }

                case EntityType.QUESTION:
                    {
                        Entity = await _applicationDbContext.QuestionBase
                            .Include(c => c.Owners)
                            .FirstOrDefaultAsync(c => c.Id == OVM.Id);

                        if (Entity is null)
                            return NotFound();

                        Entity.Owners.Clear();
                        Entity.Owners.AddRange(Users.Select(u => new QuestionOwner()
                        {
                            Owner = u
                        }));

                        break;

                    }
            }

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

    }
}
