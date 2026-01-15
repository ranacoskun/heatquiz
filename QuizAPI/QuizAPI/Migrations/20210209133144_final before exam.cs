using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class finalbeforeexam : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DisableDevision",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Disabled",
                table: "CourseMap",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "CourseMapKeys",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    MapId = table.Column<int>(nullable: false),
                    Key = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseMapKeys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseMapKeys_CourseMap_MapId",
                        column: x => x.MapId,
                        principalTable: "CourseMap",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapKeys_MapId",
                table: "CourseMapKeys",
                column: "MapId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseMapKeys");

            migrationBuilder.DropColumn(
                name: "DisableDevision",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "Disabled",
                table: "CourseMap");
        }
    }
}
