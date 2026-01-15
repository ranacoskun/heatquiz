using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class InterpertedImageGroupAddedBy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "InterpretedImageGroups",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_InterpretedImageGroups_AddedById",
                table: "InterpretedImageGroups",
                column: "AddedById");

            migrationBuilder.AddForeignKey(
                name: "FK_InterpretedImageGroups_User_AddedById",
                table: "InterpretedImageGroups",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InterpretedImageGroups_User_AddedById",
                table: "InterpretedImageGroups");

            migrationBuilder.DropIndex(
                name: "IX_InterpretedImageGroups_AddedById",
                table: "InterpretedImageGroups");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "InterpretedImageGroups");
        }
    }
}
