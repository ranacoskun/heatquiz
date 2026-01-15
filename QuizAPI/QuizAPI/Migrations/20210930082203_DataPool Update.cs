using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class DataPoolUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DataPools_Information_InformationId",
                table: "DataPools");

            migrationBuilder.DropIndex(
                name: "IX_DataPools_InformationId",
                table: "DataPools");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "DataPools");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "DataPools",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DataPools_InformationId",
                table: "DataPools",
                column: "InformationId");

            migrationBuilder.AddForeignKey(
                name: "FK_DataPools_Information_InformationId",
                table: "DataPools",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
