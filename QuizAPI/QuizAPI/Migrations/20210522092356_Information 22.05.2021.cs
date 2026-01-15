using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Information22052021 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "Information",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Information_AddedById",
                table: "Information",
                column: "AddedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Information_User_AddedById",
                table: "Information",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Information_User_AddedById",
                table: "Information");

            migrationBuilder.DropIndex(
                name: "IX_Information_AddedById",
                table: "Information");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "Information");
        }
    }
}
