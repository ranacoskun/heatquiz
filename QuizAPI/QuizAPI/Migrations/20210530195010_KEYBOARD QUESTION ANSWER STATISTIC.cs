using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class KEYBOARDQUESTIONANSWERSTATISTIC : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "KeysLists",
                nullable: true);*/

            migrationBuilder.CreateTable(
                name: "KeyboardQuestionAnswerStatistic",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    AnswerLatex = table.Column<string>(nullable: true),
                    KeyboardQuestionId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeyboardQuestionAnswerStatistic", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KeyboardQuestionAnswerStatistic_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KeyboardQuestionAnswerStatistic_QuestionBase_KeyboardQuesti~",
                        column: x => x.KeyboardQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KeyboardQuestionAnswerStatistic_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

           /* migrationBuilder.CreateIndex(
                name: "IX_KeysLists_AddedById",
                table: "KeysLists",
                column: "AddedById");
                */
            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswerStatistic_InformationId",
                table: "KeyboardQuestionAnswerStatistic",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswerStatistic_KeyboardQuestionId",
                table: "KeyboardQuestionAnswerStatistic",
                column: "KeyboardQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswerStatistic_QuestionId",
                table: "KeyboardQuestionAnswerStatistic",
                column: "QuestionId");

           /* migrationBuilder.AddForeignKey(
                name: "FK_KeysLists_User_AddedById",
                table: "KeysLists",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);*/
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /*migrationBuilder.DropForeignKey(
                name: "FK_KeysLists_User_AddedById",
                table: "KeysLists");*/

            migrationBuilder.DropTable(
                name: "KeyboardQuestionAnswerStatistic");

            /*migrationBuilder.DropIndex(
                name: "IX_KeysLists_AddedById",
                table: "KeysLists"); */

            /*migrationBuilder.DropColumn(
                name: "AddedById",
                table: "KeysLists");*/
        }
    }
}
