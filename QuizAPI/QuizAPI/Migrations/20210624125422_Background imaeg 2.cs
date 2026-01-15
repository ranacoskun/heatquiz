using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Backgroundimaeg2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "BackgroundImage",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BackgroundImage_AddedById",
                table: "BackgroundImage",
                column: "AddedById");

            migrationBuilder.AddForeignKey(
                name: "FK_BackgroundImage_User_AddedById",
                table: "BackgroundImage",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BackgroundImage_User_AddedById",
                table: "BackgroundImage");

            migrationBuilder.DropIndex(
                name: "IX_BackgroundImage_AddedById",
                table: "BackgroundImage");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "BackgroundImage");
        }
    }
}
