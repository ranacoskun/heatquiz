using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class MCquestionsrecordwronganswers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalCorrect",
                table: "MultipleChoiceQuestionChoice",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalSelect",
                table: "MultipleChoiceQuestionChoice",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalCorrect",
                table: "MultipleChoiceQuestionChoice");

            migrationBuilder.DropColumn(
                name: "TotalSelect",
                table: "MultipleChoiceQuestionChoice");
        }
    }
}
