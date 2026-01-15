using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class diagramsplotxy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "x1",
                table: "DiagramQuestionPlot",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "x2",
                table: "DiagramQuestionPlot",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "y1",
                table: "DiagramQuestionPlot",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "y2",
                table: "DiagramQuestionPlot",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "x1",
                table: "DiagramQuestionPlot");

            migrationBuilder.DropColumn(
                name: "x2",
                table: "DiagramQuestionPlot");

            migrationBuilder.DropColumn(
                name: "y1",
                table: "DiagramQuestionPlot");

            migrationBuilder.DropColumn(
                name: "y2",
                table: "DiagramQuestionPlot");
        }
    }
}
