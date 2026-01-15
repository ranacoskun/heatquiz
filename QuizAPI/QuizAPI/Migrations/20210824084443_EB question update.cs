using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class EBquestionupdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EastX",
                table: "EB_ClickablePart",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EastY",
                table: "EB_ClickablePart",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NorthX",
                table: "EB_ClickablePart",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NorthY",
                table: "EB_ClickablePart",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SouthX",
                table: "EB_ClickablePart",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SouthY",
                table: "EB_ClickablePart",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "WestX",
                table: "EB_ClickablePart",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "WestY",
                table: "EB_ClickablePart",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EastX",
                table: "EB_ClickablePart");

            migrationBuilder.DropColumn(
                name: "EastY",
                table: "EB_ClickablePart");

            migrationBuilder.DropColumn(
                name: "NorthX",
                table: "EB_ClickablePart");

            migrationBuilder.DropColumn(
                name: "NorthY",
                table: "EB_ClickablePart");

            migrationBuilder.DropColumn(
                name: "SouthX",
                table: "EB_ClickablePart");

            migrationBuilder.DropColumn(
                name: "SouthY",
                table: "EB_ClickablePart");

            migrationBuilder.DropColumn(
                name: "WestX",
                table: "EB_ClickablePart");

            migrationBuilder.DropColumn(
                name: "WestY",
                table: "EB_ClickablePart");
        }
    }
}
