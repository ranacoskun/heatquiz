using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class clickablequestioncomments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "ClickImage",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "ClickChart",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "ClickImage");

            migrationBuilder.DropColumn(
                name: "Comment",
                table: "ClickChart");
        }
    }
}
