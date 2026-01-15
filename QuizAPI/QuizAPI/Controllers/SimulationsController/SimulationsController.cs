using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static QuizAPI.Utilities.Utilities;

namespace QuizAPI.Controllers.SimulationsController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class SimulationsController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;
        IHttpContextAccessor _httpContextAccessor;

        public SimulationsController(
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

        
    }
}
