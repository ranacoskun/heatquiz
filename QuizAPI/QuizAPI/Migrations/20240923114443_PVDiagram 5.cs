using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class PVDiagram5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PVDiagramQuestionPoint_QuestionBase_QuestionId",
                table: "PVDiagramQuestionPoint");

            migrationBuilder.DropForeignKey(
                name: "FK_PVDiagramQuestionRelation_QuestionBase_QuestionId",
                table: "PVDiagramQuestionRelation");

            migrationBuilder.DropColumn(
                name: "IsClosedLoop",
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

            migrationBuilder.RenameColumn(
                name: "QuestionId",
                table: "PVDiagramQuestionRelation",
                newName: "GroupId");

            migrationBuilder.RenameIndex(
                name: "IX_PVDiagramQuestionRelation_QuestionId",
                table: "PVDiagramQuestionRelation",
                newName: "IX_PVDiagramQuestionRelation_GroupId");

            migrationBuilder.RenameColumn(
                name: "QuestionId",
                table: "PVDiagramQuestionPoint",
                newName: "GroupId");

            migrationBuilder.RenameIndex(
                name: "IX_PVDiagramQuestionPoint_QuestionId",
                table: "PVDiagramQuestionPoint",
                newName: "IX_PVDiagramQuestionPoint_GroupId");

            migrationBuilder.CreateTable(
                name: "PVDiagramQuestion_Group",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    Code = table.Column<string>(nullable: true),
                    LineColor = table.Column<string>(nullable: true),
                    LineWidth = table.Column<int>(nullable: false),
                    IsPointsOnly = table.Column<bool>(nullable: false),
                    IsClosedLoop = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PVDiagramQuestion_Group", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PVDiagramQuestion_Group_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PVDiagramQuestion_Group_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PVDiagramQuestion_Group_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PVDiagramQuestion_Group_DataPoolId",
                table: "PVDiagramQuestion_Group",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_PVDiagramQuestion_Group_InformationId",
                table: "PVDiagramQuestion_Group",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_PVDiagramQuestion_Group_QuestionId",
                table: "PVDiagramQuestion_Group",
                column: "QuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_PVDiagramQuestionPoint_PVDiagramQuestion_Group_GroupId",
                table: "PVDiagramQuestionPoint",
                column: "GroupId",
                principalTable: "PVDiagramQuestion_Group",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PVDiagramQuestionRelation_PVDiagramQuestion_Group_GroupId",
                table: "PVDiagramQuestionRelation",
                column: "GroupId",
                principalTable: "PVDiagramQuestion_Group",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PVDiagramQuestionPoint_PVDiagramQuestion_Group_GroupId",
                table: "PVDiagramQuestionPoint");

            migrationBuilder.DropForeignKey(
                name: "FK_PVDiagramQuestionRelation_PVDiagramQuestion_Group_GroupId",
                table: "PVDiagramQuestionRelation");

            migrationBuilder.DropTable(
                name: "PVDiagramQuestion_Group");

            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "PVDiagramQuestionRelation",
                newName: "QuestionId");

            migrationBuilder.RenameIndex(
                name: "IX_PVDiagramQuestionRelation_GroupId",
                table: "PVDiagramQuestionRelation",
                newName: "IX_PVDiagramQuestionRelation_QuestionId");

            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "PVDiagramQuestionPoint",
                newName: "QuestionId");

            migrationBuilder.RenameIndex(
                name: "IX_PVDiagramQuestionPoint_GroupId",
                table: "PVDiagramQuestionPoint",
                newName: "IX_PVDiagramQuestionPoint_QuestionId");

            migrationBuilder.AddColumn<bool>(
                name: "IsClosedLoop",
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

            migrationBuilder.AddForeignKey(
                name: "FK_PVDiagramQuestionPoint_QuestionBase_QuestionId",
                table: "PVDiagramQuestionPoint",
                column: "QuestionId",
                principalTable: "QuestionBase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PVDiagramQuestionRelation_QuestionBase_QuestionId",
                table: "PVDiagramQuestionRelation",
                column: "QuestionId",
                principalTable: "QuestionBase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
