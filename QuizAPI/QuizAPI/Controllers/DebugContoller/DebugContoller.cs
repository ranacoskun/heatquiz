using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;
using QuizAPI.Models.Topic.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace QuizAPI.Controllers.DebugContoller
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class DebugContoller : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;

        private readonly string encryption_key = "some_key";

        public DebugContoller(
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

        [HttpGet("[action]/{Id}")]
        public async Task<IActionResult> GetQuestionReference(int Id)
        {
            var question = await _applicationDbContext.QuestionBase
                .FirstOrDefaultAsync(q => q.Id == Id);

            if (question is null)
                return Ok("");

            //encrypt data
            var data = new
            {
                Id = Id,
                Type = DEBUG_TYPE.Question
            };

            return (Ok());
        }

        public enum DEBUG_TYPE
        {
            Question = 0,

            Series = 2,

            Map = 4,

        }

    }
}
