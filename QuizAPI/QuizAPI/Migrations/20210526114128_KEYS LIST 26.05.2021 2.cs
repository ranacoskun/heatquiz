using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class KEYSLIST260520212 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NumericKeys_KeysLists_KeysListId",
                table: "NumericKeys");

            migrationBuilder.AlterColumn<int>(
                name: "KeysListId",
                table: "NumericKeys",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_NumericKeys_KeysLists_KeysListId",
                table: "NumericKeys",
                column: "KeysListId",
                principalTable: "KeysLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NumericKeys_KeysLists_KeysListId",
                table: "NumericKeys");

            migrationBuilder.AlterColumn<int>(
                name: "KeysListId",
                table: "NumericKeys",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_NumericKeys_KeysLists_KeysListId",
                table: "NumericKeys",
                column: "KeysListId",
                principalTable: "KeysLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
