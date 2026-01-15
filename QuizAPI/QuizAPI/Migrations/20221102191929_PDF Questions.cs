using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class PDFQuestions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QuestionPDFStatistic",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    Player = table.Column<string>(nullable: true),
                    Correct = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionPDFStatistic", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionPDFStatistic_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionPDFStatistic_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionPDFStatistic_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionPDFStatistic_DataPoolId",
                table: "QuestionPDFStatistic",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionPDFStatistic_InformationId",
                table: "QuestionPDFStatistic",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionPDFStatistic_QuestionId",
                table: "QuestionPDFStatistic",
                column: "QuestionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuestionPDFStatistic");
        }
    }
}
