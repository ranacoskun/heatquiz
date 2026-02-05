using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using QuizAPI.Data;
using QuizAPI.Models.Telemetry;
using QuizAPI.Models.Telemetry.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Controllers
{
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class TelemetryController : Controller
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public TelemetryController(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Map31Events([FromBody] Map31TelemetryBatchViewModel vm)
        {
            if (!ModelState.IsValid || vm == null)
                return BadRequest("Invalid data");

            if (vm.MapId != 31)
                return BadRequest("Telemetry endpoint is restricted to Map 31");

            if (vm.SessionId == Guid.Empty)
                return BadRequest("SessionId is required");

            // Basic protection against accidental huge payloads
            if (vm.Events != null && vm.Events.Count > 2000)
                return BadRequest("Too many events in a single batch");

            var session = await _applicationDbContext.Map31TelemetrySessions
                .FirstOrDefaultAsync(s => s.Id == vm.SessionId);

            if (session == null)
            {
                session = new Map31TelemetrySession
                {
                    Id = vm.SessionId,
                    Player = vm.Player,
                    MapId = 31,
                    MapElementId = vm.MapElementId,
                    SeriesId = vm.SeriesId,
                    StartedAt = vm.StartedAt ?? DateTime.UtcNow,
                    EndedAt = vm.EndedAt,
                    TotalDurationMs = vm.TotalDurationMs,
                    IsMobile = vm.IsMobile,
                    UserAgent = vm.UserAgent,
                    AppVersion = vm.AppVersion
                };
                _applicationDbContext.Map31TelemetrySessions.Add(session);
            }
            else
            {
                // Light updatable fields (keep it best-effort)
                if (!string.IsNullOrWhiteSpace(vm.Player)) session.Player = vm.Player;
                if (vm.MapElementId.HasValue) session.MapElementId = vm.MapElementId;
                if (vm.SeriesId.HasValue) session.SeriesId = vm.SeriesId;
                if (vm.EndedAt.HasValue) session.EndedAt = vm.EndedAt;
                if (vm.TotalDurationMs.HasValue) session.TotalDurationMs = vm.TotalDurationMs;
                if (vm.IsMobile.HasValue) session.IsMobile = vm.IsMobile;
                if (!string.IsNullOrWhiteSpace(vm.UserAgent)) session.UserAgent = vm.UserAgent;
                if (!string.IsNullOrWhiteSpace(vm.AppVersion)) session.AppVersion = vm.AppVersion;
            }

            if (vm.Events != null && vm.Events.Any())
            {
                foreach (var e in vm.Events.Where(x => x != null))
                {
                    // Minimal required fields for an event
                    if (string.IsNullOrWhiteSpace(e.Page) ||
                        string.IsNullOrWhiteSpace(e.Section) ||
                        string.IsNullOrWhiteSpace(e.EventName))
                    {
                        continue;
                    }

                    _applicationDbContext.Map31TelemetryEvents.Add(new Map31TelemetryEvent
                    {
                        SessionId = session.Id,
                        OccurredAt = e.OccurredAt ?? DateTime.UtcNow,
                        Page = e.Page?.Trim(),
                        Section = e.Section?.Trim(),
                        EventName = e.EventName?.Trim(),
                        TargetType = e.TargetType,
                        TargetId = e.TargetId,
                        Url = e.Url,
                        DurationMs = e.DurationMs,
                        Metadata = e.Metadata != null ? JsonConvert.SerializeObject(e.Metadata) : null
                    });
                }
            }

            await _applicationDbContext.SaveChangesAsync();
            return Ok(new { ok = true });
        }
    }
}

