using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Updatekeysquestionrelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_NumericKeys_NumericKeyId",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_KeyboardNumericKeyRelation_Nu~",
                table: "KeyboardQuestionAnswerElement",
                column: "NumericKeyId",
                principalTable: "KeyboardNumericKeyRelation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_KeyboardNumericKeyRelation_Nu~",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_NumericKeys_NumericKeyId",
                table: "KeyboardQuestionAnswerElement",
                column: "NumericKeyId",
                principalTable: "NumericKeys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
