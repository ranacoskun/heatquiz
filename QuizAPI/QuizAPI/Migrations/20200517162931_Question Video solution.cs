using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class QuestionVideosolution : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "VIDEOSize",
                table: "QuestionBase",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "VIDEOURL",
                table: "QuestionBase",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VIDEOSize",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "VIDEOURL",
                table: "QuestionBase");
        }
    }
}
