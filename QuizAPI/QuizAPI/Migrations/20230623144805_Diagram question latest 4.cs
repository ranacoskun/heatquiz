using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Diagramquestionlatest4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "linear",
                table: "DiagramQuestionSection",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "positionEnd",
                table: "DiagramQuestionSection",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "positionStart",
                table: "DiagramQuestionSection",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "linear",
                table: "DiagramQuestionSection");

            migrationBuilder.DropColumn(
                name: "positionEnd",
                table: "DiagramQuestionSection");

            migrationBuilder.DropColumn(
                name: "positionStart",
                table: "DiagramQuestionSection");
        }
    }
}
