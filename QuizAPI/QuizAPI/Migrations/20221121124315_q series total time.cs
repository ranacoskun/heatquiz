using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class qseriestotaltime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QuestionSeriesStatistic",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    SeriesId = table.Column<int>(nullable: false),
                    Player = table.Column<string>(nullable: true),
                    TotalTime = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionSeriesStatistic", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionSeriesStatistic_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionSeriesStatistic_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionSeriesStatistic_QuestionSeries_SeriesId",
                        column: x => x.SeriesId,
                        principalTable: "QuestionSeries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesStatistic_DataPoolId",
                table: "QuestionSeriesStatistic",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesStatistic_InformationId",
                table: "QuestionSeriesStatistic",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesStatistic_SeriesId",
                table: "QuestionSeriesStatistic",
                column: "SeriesId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuestionSeriesStatistic");
        }
    }
}
