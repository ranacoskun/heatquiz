using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class seriesstatistics : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MapElementName",
                table: "QuestionSeriesStatistic",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MapKey",
                table: "QuestionSeriesStatistic",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MapName",
                table: "QuestionSeriesStatistic",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SuccessRate",
                table: "QuestionSeriesStatistic",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MapElementName",
                table: "QuestionSeriesStatistic");

            migrationBuilder.DropColumn(
                name: "MapKey",
                table: "QuestionSeriesStatistic");

            migrationBuilder.DropColumn(
                name: "MapName",
                table: "QuestionSeriesStatistic");

            migrationBuilder.DropColumn(
                name: "SuccessRate",
                table: "QuestionSeriesStatistic");
        }
    }
}
