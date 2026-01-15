using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Diagramquestionlatest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "gradientEnd",
                table: "DiagramQuestionSection",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "gradientStart",
                table: "DiagramQuestionSection",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "linear",
                table: "DiagramQuestionSection",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "positionEnd",
                table: "DiagramQuestionSection",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "positionRelation",
                table: "DiagramQuestionSection",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "positionStart",
                table: "DiagramQuestionSection",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ratioOfGradients",
                table: "DiagramQuestionSection",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "gradientEnd",
                table: "DiagramQuestionSection");

            migrationBuilder.DropColumn(
                name: "gradientStart",
                table: "DiagramQuestionSection");

            migrationBuilder.DropColumn(
                name: "linear",
                table: "DiagramQuestionSection");

            migrationBuilder.DropColumn(
                name: "positionEnd",
                table: "DiagramQuestionSection");

            migrationBuilder.DropColumn(
                name: "positionRelation",
                table: "DiagramQuestionSection");

            migrationBuilder.DropColumn(
                name: "positionStart",
                table: "DiagramQuestionSection");

            migrationBuilder.DropColumn(
                name: "ratioOfGradients",
                table: "DiagramQuestionSection");
        }
    }
}
