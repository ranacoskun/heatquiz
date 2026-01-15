using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Diagramquestionlatest3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "linear",
                table: "DiagramQuestionSection",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "positionEnd",
                table: "DiagramQuestionSection",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "positionStart",
                table: "DiagramQuestionSection",
                nullable: true);
        }
    }
}
