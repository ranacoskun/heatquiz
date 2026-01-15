using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Diagramquestionlatest5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "DiagramQuestionPlot",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OriginX",
                table: "DiagramQuestionPlot",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OriginY",
                table: "DiagramQuestionPlot",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Height",
                table: "DiagramQuestionPlot");

            migrationBuilder.DropColumn(
                name: "OriginX",
                table: "DiagramQuestionPlot");

            migrationBuilder.DropColumn(
                name: "OriginY",
                table: "DiagramQuestionPlot");
        }
    }
}
