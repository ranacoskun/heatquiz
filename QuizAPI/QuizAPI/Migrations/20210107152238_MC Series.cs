using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class MCSeries : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MultipleChoiceQuestionId",
                table: "QuestionSeriesElement",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesElement_MultipleChoiceQuestionId",
                table: "QuestionSeriesElement",
                column: "MultipleChoiceQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionSeriesElement_QuestionBase_MultipleChoiceQuestionId",
                table: "QuestionSeriesElement",
                column: "MultipleChoiceQuestionId",
                principalTable: "QuestionBase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionSeriesElement_QuestionBase_MultipleChoiceQuestionId",
                table: "QuestionSeriesElement");

            migrationBuilder.DropIndex(
                name: "IX_QuestionSeriesElement_MultipleChoiceQuestionId",
                table: "QuestionSeriesElement");

            migrationBuilder.DropColumn(
                name: "MultipleChoiceQuestionId",
                table: "QuestionSeriesElement");
        }
    }
}
