using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class qmappdfonmobil : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "OnMobile",
                table: "QuestionSeriesStatistic",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "OnMobile",
                table: "CourseMapPDFStatistics",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OnMobile",
                table: "QuestionSeriesStatistic");

            migrationBuilder.DropColumn(
                name: "OnMobile",
                table: "CourseMapPDFStatistics");
        }
    }
}
