using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class PVDiagram4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CX",
                table: "PVDiagramQuestionPoint",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CY",
                table: "PVDiagramQuestionPoint",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CX",
                table: "PVDiagramQuestionPoint");

            migrationBuilder.DropColumn(
                name: "CY",
                table: "PVDiagramQuestionPoint");
        }
    }
}
