using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class SeriesRandom : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRandom",
                table: "QuestionSeries",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "RandomSize",
                table: "QuestionSeries",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRandom",
                table: "QuestionSeries");

            migrationBuilder.DropColumn(
                name: "RandomSize",
                table: "QuestionSeries");
        }
    }
}
