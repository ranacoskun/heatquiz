using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Questionnaireseriesrelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "QuestionnaireRelationId",
                table: "QuestionSeries",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SeriesId",
                table: "QuestionnaireStatisticInstanceBase",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "QuestionnaireSeriesRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    SeriesId = table.Column<int>(nullable: false),
                    QuestionnaireId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionnaireSeriesRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionnaireSeriesRelation_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireSeriesRelation_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireSeriesRelation_Questionnaires_QuestionnaireId",
                        column: x => x.QuestionnaireId,
                        principalTable: "Questionnaires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionnaireSeriesRelation_QuestionSeries_SeriesId",
                        column: x => x.SeriesId,
                        principalTable: "QuestionSeries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireStatisticInstanceBase_SeriesId",
                table: "QuestionnaireStatisticInstanceBase",
                column: "SeriesId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireSeriesRelation_DataPoolId",
                table: "QuestionnaireSeriesRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireSeriesRelation_InformationId",
                table: "QuestionnaireSeriesRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireSeriesRelation_QuestionnaireId",
                table: "QuestionnaireSeriesRelation",
                column: "QuestionnaireId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireSeriesRelation_SeriesId",
                table: "QuestionnaireSeriesRelation",
                column: "SeriesId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionnaireStatisticInstanceBase_QuestionSeries_SeriesId",
                table: "QuestionnaireStatisticInstanceBase",
                column: "SeriesId",
                principalTable: "QuestionSeries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionnaireStatisticInstanceBase_QuestionSeries_SeriesId",
                table: "QuestionnaireStatisticInstanceBase");

            migrationBuilder.DropTable(
                name: "QuestionnaireSeriesRelation");

            migrationBuilder.DropIndex(
                name: "IX_QuestionnaireStatisticInstanceBase_SeriesId",
                table: "QuestionnaireStatisticInstanceBase");

            migrationBuilder.DropColumn(
                name: "QuestionnaireRelationId",
                table: "QuestionSeries");

            migrationBuilder.DropColumn(
                name: "SeriesId",
                table: "QuestionnaireStatisticInstanceBase");
        }
    }
}
