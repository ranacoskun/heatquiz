using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Map31Telemetry : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Map31TelemetrySession",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Player = table.Column<string>(nullable: true),
                    MapId = table.Column<int>(nullable: false),
                    MapElementId = table.Column<int>(nullable: true),
                    SeriesId = table.Column<int>(nullable: true),
                    StartedAt = table.Column<DateTime>(nullable: false),
                    EndedAt = table.Column<DateTime>(nullable: true),
                    TotalDurationMs = table.Column<int>(nullable: true),
                    IsMobile = table.Column<bool>(nullable: true),
                    UserAgent = table.Column<string>(nullable: true),
                    AppVersion = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Map31TelemetrySession", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Map31TelemetryEvent",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    SessionId = table.Column<Guid>(nullable: false),
                    OccurredAt = table.Column<DateTime>(nullable: false),
                    Page = table.Column<string>(nullable: true),
                    Section = table.Column<string>(nullable: true),
                    EventName = table.Column<string>(nullable: true),
                    TargetType = table.Column<string>(nullable: true),
                    TargetId = table.Column<string>(nullable: true),
                    Url = table.Column<string>(nullable: true),
                    DurationMs = table.Column<int>(nullable: true),
                    Metadata = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Map31TelemetryEvent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Map31TelemetryEvent_Map31TelemetrySession_SessionId",
                        column: x => x.SessionId,
                        principalTable: "Map31TelemetrySession",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Map31TelemetryEvent_SessionId",
                table: "Map31TelemetryEvent",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Map31TelemetryEvent_OccurredAt",
                table: "Map31TelemetryEvent",
                column: "OccurredAt");

            migrationBuilder.CreateIndex(
                name: "IX_Map31TelemetryEvent_Page_Section_EventName",
                table: "Map31TelemetryEvent",
                columns: new[] { "Page", "Section", "EventName" });

            migrationBuilder.CreateIndex(
                name: "IX_Map31TelemetrySession_Player_StartedAt",
                table: "Map31TelemetrySession",
                columns: new[] { "Player", "StartedAt" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Map31TelemetryEvent");

            migrationBuilder.DropTable(
                name: "Map31TelemetrySession");
        }
    }
}
