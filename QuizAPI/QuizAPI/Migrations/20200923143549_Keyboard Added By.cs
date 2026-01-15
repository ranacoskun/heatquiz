using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class KeyboardAddedBy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "Keyboards",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Keyboards_AddedById",
                table: "Keyboards",
                column: "AddedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Keyboards_User_AddedById",
                table: "Keyboards",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Keyboards_User_AddedById",
                table: "Keyboards");

            migrationBuilder.DropIndex(
                name: "IX_Keyboards_AddedById",
                table: "Keyboards");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "Keyboards");
        }
    }
}
