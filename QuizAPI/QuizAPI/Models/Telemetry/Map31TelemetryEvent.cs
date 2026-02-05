using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizAPI.Models.Telemetry
{
    [Table("Map31TelemetryEvent")]
    public class Map31TelemetryEvent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public Guid SessionId { get; set; }
        public Map31TelemetrySession Session { get; set; }

        public DateTime OccurredAt { get; set; }

        public string Page { get; set; }
        public string Section { get; set; }
        public string EventName { get; set; }

        public string TargetType { get; set; }
        public string TargetId { get; set; }

        public string Url { get; set; }
        public int? DurationMs { get; set; }

        /// <summary>
        /// JSON payload stored as Postgres jsonb. Kept as string for EF Core 2.x compatibility.
        /// </summary>
        public string Metadata { get; set; }
    }
}

