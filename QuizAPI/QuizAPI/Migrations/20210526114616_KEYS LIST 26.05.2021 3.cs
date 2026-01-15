using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class KEYSLIST260520213 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "KeysLists",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_KeysLists_AddedById",
                table: "KeysLists",
                column: "AddedById");

            migrationBuilder.AddForeignKey(
                name: "FK_KeysLists_User_AddedById",
                table: "KeysLists",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            

            migrationBuilder.DropForeignKey(
                name: "FK_KeysLists_User_AddedById",
                table: "KeysLists");

            migrationBuilder.DropIndex(
                name: "IX_KeysLists_AddedById",
                table: "KeysLists");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "KeysLists");
        }
    }
}
