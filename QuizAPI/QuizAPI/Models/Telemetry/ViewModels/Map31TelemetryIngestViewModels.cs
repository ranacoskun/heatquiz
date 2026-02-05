using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace QuizAPI.Models.Telemetry.ViewModels
{
    public class Map31TelemetryBatchViewModel
    {
        public Guid SessionId { get; set; }

        public string Player { get; set; }

        public int MapId { get; set; } = 31;

        public int? MapElementId { get; set; }
        public int? SeriesId { get; set; }

        public bool? IsMobile { get; set; }
        public string UserAgent { get; set; }
        public string AppVersion { get; set; }

        public DateTime? StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }
        public int? TotalDurationMs { get; set; }

        public List<Map31TelemetryEventIngestViewModel> Events { get; set; } = new List<Map31TelemetryEventIngestViewModel>();
    }

    public class Map31TelemetryEventIngestViewModel
    {
        public DateTime? OccurredAt { get; set; }

        public string Page { get; set; }
        public string Section { get; set; }
        public string EventName { get; set; }

        public string TargetType { get; set; }
        public string TargetId { get; set; }

        public string Url { get; set; }
        public int? DurationMs { get; set; }

        public JObject Metadata { get; set; }
    }
}

