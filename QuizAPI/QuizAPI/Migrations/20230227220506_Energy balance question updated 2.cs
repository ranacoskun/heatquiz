using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Energybalancequestionupdated2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KeyboardId",
                table: "EnergyBalanceQuestion_BC",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_BC_KeyboardId",
                table: "EnergyBalanceQuestion_BC",
                column: "KeyboardId");

            migrationBuilder.AddForeignKey(
                name: "FK_EnergyBalanceQuestion_BC_Keyboards_KeyboardId",
                table: "EnergyBalanceQuestion_BC",
                column: "KeyboardId",
                principalTable: "Keyboards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EnergyBalanceQuestion_BC_Keyboards_KeyboardId",
                table: "EnergyBalanceQuestion_BC");

            migrationBuilder.DropIndex(
                name: "IX_EnergyBalanceQuestion_BC_KeyboardId",
                table: "EnergyBalanceQuestion_BC");

            migrationBuilder.DropColumn(
                name: "KeyboardId",
                table: "EnergyBalanceQuestion_BC");
        }
    }
}
