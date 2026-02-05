using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizAPI.Models.Telemetry
{
    [Table("Map31TelemetrySession")]
    public class Map31TelemetrySession
    {
        [Key]
        public Guid Id { get; set; }

        public string Player { get; set; }

        public int MapId { get; set; } = 31;

        public int? MapElementId { get; set; }

        public int? SeriesId { get; set; }

        public DateTime StartedAt { get; set; }

        public DateTime? EndedAt { get; set; }

        public int? TotalDurationMs { get; set; }

        public bool? IsMobile { get; set; }

        public string UserAgent { get; set; }

        public string AppVersion { get; set; }

        public ICollection<Map31TelemetryEvent> Events { get; set; } = new List<Map31TelemetryEvent>();
    }
}

