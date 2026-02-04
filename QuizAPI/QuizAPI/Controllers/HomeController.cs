using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace QuizAPI.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            // This backend is deployed as an API on Azure App Service.
            // Returning the legacy SPA prerendering view requires NodeServices, which commonly fails on App Service
            // and causes 502.3 timeouts. Keep root path lightweight and reliable.
            return Ok(new { status = "ok", service = "QuizAPI" });
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
