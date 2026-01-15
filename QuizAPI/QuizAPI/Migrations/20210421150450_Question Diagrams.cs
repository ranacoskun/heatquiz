using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class QuestionDiagrams : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AskForXAxisMinMax",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AskForXAxisTitle",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AskForXAxisUnit",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AskForYAxisMinMax",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AskForYAxisTitle",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AskForYAxisUnit",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "X_Axis_Max",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "X_Axis_Min",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "X_Axis_Title",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "X_Axis_Unit",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Y_Axis_Max",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Y_Axis_Min",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Y_Axis_Title",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Y_Axis_Unit",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DiagramPoints",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    DiagramsQuestionId = table.Column<int>(nullable: false),
                    X = table.Column<int>(nullable: false),
                    Y = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiagramPoints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiagramPoints_QuestionBase_DiagramsQuestionId",
                        column: x => x.DiagramsQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DiagramPointRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    DiagramsQuestionId = table.Column<int>(nullable: false),
                    FirstDiagramPointId = table.Column<int>(nullable: false),
                    SecondDiagramPointId = table.Column<int>(nullable: false),
                    RELATIONSHIP_TYPE = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiagramPointRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiagramPointRelation_QuestionBase_DiagramsQuestionId",
                        column: x => x.DiagramsQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiagramPointRelation_DiagramPoints_FirstDiagramPointId",
                        column: x => x.FirstDiagramPointId,
                        principalTable: "DiagramPoints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiagramPointRelation_DiagramPoints_SecondDiagramPointId",
                        column: x => x.SecondDiagramPointId,
                        principalTable: "DiagramPoints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPointRelation_DiagramsQuestionId",
                table: "DiagramPointRelation",
                column: "DiagramsQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPointRelation_FirstDiagramPointId",
                table: "DiagramPointRelation",
                column: "FirstDiagramPointId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPointRelation_SecondDiagramPointId",
                table: "DiagramPointRelation",
                column: "SecondDiagramPointId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPoints_DiagramsQuestionId",
                table: "DiagramPoints",
                column: "DiagramsQuestionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiagramPointRelation");

            migrationBuilder.DropTable(
                name: "DiagramPoints");

            migrationBuilder.DropColumn(
                name: "AskForXAxisMinMax",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "AskForXAxisTitle",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "AskForXAxisUnit",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "AskForYAxisMinMax",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "AskForYAxisTitle",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "AskForYAxisUnit",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "X_Axis_Max",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "X_Axis_Min",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "X_Axis_Title",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "X_Axis_Unit",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "Y_Axis_Max",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "Y_Axis_Min",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "Y_Axis_Title",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "Y_Axis_Unit",
                table: "QuestionBase");
        }
    }
}
