using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class KeyboardUpdate5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_VariableKeyVariableCharValidV~",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.AddColumn<int>(
                name: "VariableKeyVariableCharValidValuesGroupChoiceImageId",
                table: "KeyboardQuestionAnswerElement",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswerElement_VariableKeyVariableCharValidV~",
                table: "KeyboardQuestionAnswerElement",
                column: "VariableKeyVariableCharValidValuesGroupChoiceImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_KeyboardVariableKeyImageRelat~",
                table: "KeyboardQuestionAnswerElement",
                column: "ImageId",
                principalTable: "KeyboardVariableKeyImageRelation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_VariableKeyVariableCharValidV~",
                table: "KeyboardQuestionAnswerElement",
                column: "VariableKeyVariableCharValidValuesGroupChoiceImageId",
                principalTable: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_KeyboardVariableKeyImageRelat~",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_VariableKeyVariableCharValidV~",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardQuestionAnswerElement_VariableKeyVariableCharValidV~",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.DropColumn(
                name: "VariableKeyVariableCharValidValuesGroupChoiceImageId",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_VariableKeyVariableCharValidV~",
                table: "KeyboardQuestionAnswerElement",
                column: "ImageId",
                principalTable: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
