using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class mapelementaudio : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "AudioSize",
                table: "CourseMapElement",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "AudioURL",
                table: "CourseMapElement",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AudioSize",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "AudioURL",
                table: "CourseMapElement");
        }
    }
}
