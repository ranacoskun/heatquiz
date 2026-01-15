using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class ClickablePartsUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RelativeToImageX",
                table: "ClickImage",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RelativeToImageY",
                table: "ClickImage",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RelativeToImageX",
                table: "ClickEquation",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RelativeToImageY",
                table: "ClickEquation",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RelativeToImageX",
                table: "ClickChart",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RelativeToImageY",
                table: "ClickChart",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RelativeToImageX",
                table: "ClickImage");

            migrationBuilder.DropColumn(
                name: "RelativeToImageY",
                table: "ClickImage");

            migrationBuilder.DropColumn(
                name: "RelativeToImageX",
                table: "ClickEquation");

            migrationBuilder.DropColumn(
                name: "RelativeToImageY",
                table: "ClickEquation");

            migrationBuilder.DropColumn(
                name: "RelativeToImageX",
                table: "ClickChart");

            migrationBuilder.DropColumn(
                name: "RelativeToImageY",
                table: "ClickChart");
        }
    }
}
