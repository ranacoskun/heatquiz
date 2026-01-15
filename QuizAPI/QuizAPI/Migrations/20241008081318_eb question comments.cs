using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class ebquestioncomments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "EnergyBalanceQuestion_GeneralAnswers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "EnergyBalanceQuestion_EBTerm",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "EnergyBalanceQuestion_ControlVolume",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "ClickEquation",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "EnergyBalanceQuestion_GeneralAnswers");

            migrationBuilder.DropColumn(
                name: "Comment",
                table: "EnergyBalanceQuestion_EBTerm");

            migrationBuilder.DropColumn(
                name: "Comment",
                table: "EnergyBalanceQuestion_ControlVolume");

            migrationBuilder.DropColumn(
                name: "Comment",
                table: "ClickEquation");
        }
    }
}
