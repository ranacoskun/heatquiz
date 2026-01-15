using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class KQuestionCourseMapUpdate2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdditionalInfo",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsEnergyBalance",
                table: "QuestionBase",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionalInfo",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "IsEnergyBalance",
                table: "QuestionBase");
        }
    }
}
