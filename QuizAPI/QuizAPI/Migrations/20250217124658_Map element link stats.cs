using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Mapelementlinkstats : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CourseMapLinkStatistics",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    ElementId = table.Column<int>(nullable: false),
                    Player = table.Column<string>(nullable: true),
                    CurrentLink = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseMapLinkStatistics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseMapLinkStatistics_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourseMapLinkStatistics_CourseMapElement_ElementId",
                        column: x => x.ElementId,
                        principalTable: "CourseMapElement",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseMapLinkStatistics_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapLinkStatistics_DataPoolId",
                table: "CourseMapLinkStatistics",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapLinkStatistics_ElementId",
                table: "CourseMapLinkStatistics",
                column: "ElementId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapLinkStatistics_InformationId",
                table: "CourseMapLinkStatistics",
                column: "InformationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseMapLinkStatistics");
        }
    }
}
