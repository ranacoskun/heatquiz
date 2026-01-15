using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class PVdiagramquestioncomments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "PVDiagramQuestionRelation",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PositionComment",
                table: "PVDiagramQuestionPoint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShapeComment",
                table: "PVDiagramQuestionPoint",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "PVDiagramQuestionRelation");

            migrationBuilder.DropColumn(
                name: "PositionComment",
                table: "PVDiagramQuestionPoint");

            migrationBuilder.DropColumn(
                name: "ShapeComment",
                table: "PVDiagramQuestionPoint");
        }
    }
}
