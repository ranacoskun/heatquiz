using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class questionnaireimagefinaltext : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FinalText",
                table: "Questionnaires",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ImageSize",
                table: "Questionnaires",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "ImageURL",
                table: "Questionnaires",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinalText",
                table: "Questionnaires");

            migrationBuilder.DropColumn(
                name: "ImageSize",
                table: "Questionnaires");

            migrationBuilder.DropColumn(
                name: "ImageURL",
                table: "Questionnaires");
        }
    }
}
