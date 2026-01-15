using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class MCQuestions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MultipleChoiceQuestion_AdditionalInfo",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MultipleChoiceQuestion_AnswerForLatex",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "MultipleChoiceQuestion_ImageSize",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MultipleChoiceQuestion_ImageURL",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "MultipleChoiceQuestion_IsEnergyBalance",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MultipleChoiceQuestion_Latex",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MultipleChoiceQuestion_LatexHeight",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MultipleChoiceQuestion_LatexWidth",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CourseMapBadgeSystem",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    MapId = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseMapBadgeSystem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseMapBadgeSystem_CourseMap_MapId",
                        column: x => x.MapId,
                        principalTable: "CourseMap",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MultipleChoiceQuestionChoice",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    Text = table.Column<string>(nullable: true),
                    Latex = table.Column<string>(nullable: true),
                    LatexURL = table.Column<string>(nullable: true),
                    ImageURL = table.Column<string>(nullable: true),
                    Correct = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MultipleChoiceQuestionChoice", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MultipleChoiceQuestionChoice_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CourseMapBadgeSystemEntity",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    SystemId = table.Column<int>(nullable: false),
                    URL = table.Column<string>(nullable: true),
                    Progress = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseMapBadgeSystemEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseMapBadgeSystemEntity_CourseMapBadgeSystem_SystemId",
                        column: x => x.SystemId,
                        principalTable: "CourseMapBadgeSystem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapBadgeSystem_MapId",
                table: "CourseMapBadgeSystem",
                column: "MapId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapBadgeSystemEntity_SystemId",
                table: "CourseMapBadgeSystemEntity",
                column: "SystemId");

            migrationBuilder.CreateIndex(
                name: "IX_MultipleChoiceQuestionChoice_QuestionId",
                table: "MultipleChoiceQuestionChoice",
                column: "QuestionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseMapBadgeSystemEntity");

            migrationBuilder.DropTable(
                name: "MultipleChoiceQuestionChoice");

            migrationBuilder.DropTable(
                name: "CourseMapBadgeSystem");

            migrationBuilder.DropColumn(
                name: "MultipleChoiceQuestion_AdditionalInfo",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "MultipleChoiceQuestion_AnswerForLatex",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "MultipleChoiceQuestion_ImageSize",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "MultipleChoiceQuestion_ImageURL",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "MultipleChoiceQuestion_IsEnergyBalance",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "MultipleChoiceQuestion_Latex",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "MultipleChoiceQuestion_LatexHeight",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "MultipleChoiceQuestion_LatexWidth",
                table: "QuestionBase");
        }
    }
}
