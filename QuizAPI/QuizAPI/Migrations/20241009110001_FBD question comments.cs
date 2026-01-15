using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class FBDquestioncomments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "FreebodyDiagramQuestion_VectorTerm",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "FreebodyDiagramQuestion_FBD",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "FreebodyDiagramQuestion_VectorTerm");

            migrationBuilder.DropColumn(
                name: "Comment",
                table: "FreebodyDiagramQuestion_FBD");
        }
    }
}
