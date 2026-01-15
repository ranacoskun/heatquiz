using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class questionseriespools : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PoolNumber",
                table: "QuestionSeriesElement",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfPools",
                table: "QuestionSeries",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PoolNumber",
                table: "QuestionSeriesElement");

            migrationBuilder.DropColumn(
                name: "NumberOfPools",
                table: "QuestionSeries");
        }
    }
}
