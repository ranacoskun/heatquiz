using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class PVDiagram : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsClosedLoop",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsPermutableScoreEvaluation",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsPointsOnly",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LineColor",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LineWidth",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PVDiagramQuestion_QuestionText",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PVDiagramQuestionPoint",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    Name = table.Column<int>(nullable: false),
                    X = table.Column<int>(nullable: false),
                    Y = table.Column<int>(nullable: false),
                    MarginX = table.Column<int>(nullable: false),
                    MarginY = table.Column<int>(nullable: false),
                    InnerColor = table.Column<string>(nullable: true),
                    OuterColor = table.Column<string>(nullable: true),
                    IsPoistionConsiderable = table.Column<bool>(nullable: false),
                    IsShapeConsiderable = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PVDiagramQuestionPoint", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PVDiagramQuestionPoint_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PVDiagramQuestionPoint_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PVDiagramQuestionPoint_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PVDiagramQuestionRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    FirstPointId = table.Column<int>(nullable: false),
                    SecondPointId = table.Column<int>(nullable: false),
                    Value = table.Column<string>(nullable: true),
                    Type = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PVDiagramQuestionRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PVDiagramQuestionRelation_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PVDiagramQuestionRelation_PVDiagramQuestionPoint_FirstPoint~",
                        column: x => x.FirstPointId,
                        principalTable: "PVDiagramQuestionPoint",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PVDiagramQuestionRelation_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PVDiagramQuestionRelation_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PVDiagramQuestionRelation_PVDiagramQuestionPoint_SecondPoin~",
                        column: x => x.SecondPointId,
                        principalTable: "PVDiagramQuestionPoint",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PVDiagramQuestionPoint_DataPoolId",
                table: "PVDiagramQuestionPoint",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_PVDiagramQuestionPoint_InformationId",
                table: "PVDiagramQuestionPoint",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_PVDiagramQuestionPoint_QuestionId",
                table: "PVDiagramQuestionPoint",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_PVDiagramQuestionRelation_DataPoolId",
                table: "PVDiagramQuestionRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_PVDiagramQuestionRelation_FirstPointId",
                table: "PVDiagramQuestionRelation",
                column: "FirstPointId");

            migrationBuilder.CreateIndex(
                name: "IX_PVDiagramQuestionRelation_InformationId",
                table: "PVDiagramQuestionRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_PVDiagramQuestionRelation_QuestionId",
                table: "PVDiagramQuestionRelation",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_PVDiagramQuestionRelation_SecondPointId",
                table: "PVDiagramQuestionRelation",
                column: "SecondPointId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PVDiagramQuestionRelation");

            migrationBuilder.DropTable(
                name: "PVDiagramQuestionPoint");

            migrationBuilder.DropColumn(
                name: "IsClosedLoop",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "IsPermutableScoreEvaluation",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "IsPointsOnly",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "LineColor",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "LineWidth",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "PVDiagramQuestion_QuestionText",
                table: "QuestionBase");
        }
    }
}
