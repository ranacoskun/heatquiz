using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using QuizAPI.Data;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Controllers.PythonController
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class PythonController : Controller
    {
        private readonly IMapper _mapper;

        private readonly ApplicationDbContext _applicationDbContext;

        private readonly string PYTHON_INTERPRETER_PATH = @"C:\Users\Administrator\AppData\Local\Programs\Python\Python37\python.exe";

        public PythonController(
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

        [HttpPost("[action]")]
        public async Task<IActionResult> ExecutePython([FromBody] ExecutePythonViewModel RequestVM)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Request");

            Console.WriteLine("RequestVM.Code="+ RequestVM.Code);

            try
            {
                //Create Temporary Code File
                var TempPath =  Path.GetTempFileName() + ".py";
                string result = "";

                using (var tw = new StreamWriter(TempPath, true))
                {
                    tw.WriteLine(RequestVM.Code);

                    //Create Python Process
                    var info = new ProcessStartInfo(PYTHON_INTERPRETER_PATH);
                    info.Arguments = "-u " + TempPath;//+ " " + RequestVM.Parameters;

                    info.RedirectStandardInput = false;
                    info.RedirectStandardOutput = true;
                    info.UseShellExecute = false;
                    info.CreateNoWindow = true;
                    
                    using (var proc = new Process())
                    {
                        proc.StartInfo = info;
                        proc.EnableRaisingEvents = true;

                        proc.ErrorDataReceived += Process_OutputDataReceived;
                        proc.OutputDataReceived += Process_OutputDataReceived;

                        proc.Start();
                        proc.WaitForExit();
                        Console.WriteLine("ExitCode=" + proc.ExitCode);
                        if (proc.ExitCode == 0)
                        {
                            result = proc.StandardOutput.ReadToEnd();
                        }
                    }


                }

                System.IO.File.Delete(TempPath);
                return Ok(result);

            }
            catch (Exception e)
            {
                return BadRequest("Error executing code" + e.Message);
            }
           
        }

        static void Process_OutputDataReceived(object sender, DataReceivedEventArgs e)
        {
            Console.WriteLine(e.Data);
        }

    }
}
