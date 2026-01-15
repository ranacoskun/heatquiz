using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Questionnairemapelementrelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MapElementId",
                table: "QuestionnaireStatisticInstanceBase",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionnaireRelationId",
                table: "CourseMapElement",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "QuestionnaireMapElementRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    MapElementId = table.Column<int>(nullable: false),
                    QuestionnaireId = table.Column<int>(nullable: false),
                    IsRepeatable = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionnaireMapElementRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionnaireMapElementRelation_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireMapElementRelation_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireMapElementRelation_CourseMapElement_MapElement~",
                        column: x => x.MapElementId,
                        principalTable: "CourseMapElement",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionnaireMapElementRelation_Questionnaires_Questionnair~",
                        column: x => x.QuestionnaireId,
                        principalTable: "Questionnaires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireStatisticInstanceBase_MapElementId",
                table: "QuestionnaireStatisticInstanceBase",
                column: "MapElementId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireMapElementRelation_DataPoolId",
                table: "QuestionnaireMapElementRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireMapElementRelation_InformationId",
                table: "QuestionnaireMapElementRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireMapElementRelation_MapElementId",
                table: "QuestionnaireMapElementRelation",
                column: "MapElementId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireMapElementRelation_QuestionnaireId",
                table: "QuestionnaireMapElementRelation",
                column: "QuestionnaireId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionnaireStatisticInstanceBase_CourseMapElement_MapElem~",
                table: "QuestionnaireStatisticInstanceBase",
                column: "MapElementId",
                principalTable: "CourseMapElement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionnaireStatisticInstanceBase_CourseMapElement_MapElem~",
                table: "QuestionnaireStatisticInstanceBase");

            migrationBuilder.DropTable(
                name: "QuestionnaireMapElementRelation");

            migrationBuilder.DropIndex(
                name: "IX_QuestionnaireStatisticInstanceBase_MapElementId",
                table: "QuestionnaireStatisticInstanceBase");

            migrationBuilder.DropColumn(
                name: "MapElementId",
                table: "QuestionnaireStatisticInstanceBase");

            migrationBuilder.DropColumn(
                name: "QuestionnaireRelationId",
                table: "CourseMapElement");
        }
    }
}
