using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class diagramsquesiton3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Question",
                table: "QuestionBase",
                newName: "EnergyBalanceQuestionUpdated_QuestionText");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EnergyBalanceQuestionUpdated_QuestionText",
                table: "QuestionBase",
                newName: "Question");
        }
    }
}
