using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class KeyboardQuestionUpdate100920202 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumericKeyId",
                table: "KeyboardQuestionAnswerElement",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswerElement_NumericKeyId",
                table: "KeyboardQuestionAnswerElement",
                column: "NumericKeyId");

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_NumericKeys_NumericKeyId",
                table: "KeyboardQuestionAnswerElement",
                column: "NumericKeyId",
                principalTable: "NumericKeys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_NumericKeys_NumericKeyId",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardQuestionAnswerElement_NumericKeyId",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.DropColumn(
                name: "NumericKeyId",
                table: "KeyboardQuestionAnswerElement");
        }
    }
}
