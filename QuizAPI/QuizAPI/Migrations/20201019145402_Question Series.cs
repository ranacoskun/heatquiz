using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class QuestionSeries : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CourseMap",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    CourseId = table.Column<int>(nullable: false),
                    LargeMapURL = table.Column<string>(nullable: true),
                    LargeMapWidth = table.Column<int>(nullable: false),
                    LargeMapLength = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseMap", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseMap_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionSeries",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Code = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionSeries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CourseMapElement",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    MapId = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    VideoURL = table.Column<string>(nullable: true),
                    VideoSize = table.Column<long>(nullable: false),
                    X = table.Column<int>(nullable: false),
                    Y = table.Column<int>(nullable: false),
                    Width = table.Column<int>(nullable: false),
                    Length = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseMapElement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseMapElement_CourseMap_MapId",
                        column: x => x.MapId,
                        principalTable: "CourseMap",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionSeriesElement",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    SeriesId = table.Column<int>(nullable: false),
                    Order = table.Column<int>(nullable: false),
                    ClickableQuestionId = table.Column<int>(nullable: true),
                    KeyboardQuestionId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionSeriesElement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionSeriesElement_QuestionBase_ClickableQuestionId",
                        column: x => x.ClickableQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionSeriesElement_QuestionBase_KeyboardQuestionId",
                        column: x => x.KeyboardQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionSeriesElement_QuestionSeries_SeriesId",
                        column: x => x.SeriesId,
                        principalTable: "QuestionSeries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseMap_CourseId",
                table: "CourseMap",
                column: "CourseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElement_MapId",
                table: "CourseMapElement",
                column: "MapId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesElement_ClickableQuestionId",
                table: "QuestionSeriesElement",
                column: "ClickableQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesElement_KeyboardQuestionId",
                table: "QuestionSeriesElement",
                column: "KeyboardQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesElement_SeriesId",
                table: "QuestionSeriesElement",
                column: "SeriesId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseMapElement");

            migrationBuilder.DropTable(
                name: "QuestionSeriesElement");

            migrationBuilder.DropTable(
                name: "CourseMap");

            migrationBuilder.DropTable(
                name: "QuestionSeries");
        }
    }
}
