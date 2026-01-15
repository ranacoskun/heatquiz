using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class EBQuestionupdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EB_QuestionId",
                table: "EB_Answer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EB_Question",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    Latex = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EB_Question", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EB_Question_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EB_Question_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EB_Answer_EB_QuestionId",
                table: "EB_Answer",
                column: "EB_QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Question_InformationId",
                table: "EB_Question",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Question_QuestionId",
                table: "EB_Question",
                column: "QuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Answer_EB_Question_EB_QuestionId",
                table: "EB_Answer",
                column: "EB_QuestionId",
                principalTable: "EB_Question",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EB_Answer_EB_Question_EB_QuestionId",
                table: "EB_Answer");

            migrationBuilder.DropTable(
                name: "EB_Question");

            migrationBuilder.DropIndex(
                name: "IX_EB_Answer_EB_QuestionId",
                table: "EB_Answer");

            migrationBuilder.DropColumn(
                name: "EB_QuestionId",
                table: "EB_Answer");
        }
    }
}
