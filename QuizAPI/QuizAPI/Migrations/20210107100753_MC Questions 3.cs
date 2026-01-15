using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class MCQuestions3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReferenceWidth",
                table: "MultipleChoiceQuestionChoice");

            migrationBuilder.AddColumn<float>(
                name: "ScaleFactor",
                table: "MultipleChoiceQuestionChoice",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScaleFactor",
                table: "MultipleChoiceQuestionChoice");

            migrationBuilder.AddColumn<int>(
                name: "ReferenceWidth",
                table: "MultipleChoiceQuestionChoice",
                nullable: false,
                defaultValue: 0);
        }
    }
}
