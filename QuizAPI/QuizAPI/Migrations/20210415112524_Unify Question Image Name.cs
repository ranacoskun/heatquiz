using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class UnifyQuestionImageName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Base_ImageURL",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Base_ImageURL_Height",
                table: "QuestionBase",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Base_ImageURL_Width",
                table: "QuestionBase",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Base_ImageURL",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "Base_ImageURL_Height",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "Base_ImageURL_Width",
                table: "QuestionBase");
        }
    }
}
