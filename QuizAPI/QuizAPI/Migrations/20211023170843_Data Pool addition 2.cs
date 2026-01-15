using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class DataPooladdition2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "Information",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Information_DataPoolId",
                table: "Information",
                column: "DataPoolId");

            migrationBuilder.AddForeignKey(
                name: "FK_Information_DataPools_DataPoolId",
                table: "Information",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Information_DataPools_DataPoolId",
                table: "Information");

            migrationBuilder.DropIndex(
                name: "IX_Information_DataPoolId",
                table: "Information");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "Information");
        }
    }
}
