using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class MC20213 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Image_Height",
                table: "MultipleChoiceQuestionChoice",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Image_Width",
                table: "MultipleChoiceQuestionChoice",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image_Height",
                table: "MultipleChoiceQuestionChoice");

            migrationBuilder.DropColumn(
                name: "Image_Width",
                table: "MultipleChoiceQuestionChoice");
        }
    }
}
