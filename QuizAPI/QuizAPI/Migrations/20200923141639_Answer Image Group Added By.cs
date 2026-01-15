using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class AnswerImageGroupAddedBy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "ImageAnswerGroups",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ImageAnswerGroups_AddedById",
                table: "ImageAnswerGroups",
                column: "AddedById");

            migrationBuilder.AddForeignKey(
                name: "FK_ImageAnswerGroups_User_AddedById",
                table: "ImageAnswerGroups",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ImageAnswerGroups_User_AddedById",
                table: "ImageAnswerGroups");

            migrationBuilder.DropIndex(
                name: "IX_ImageAnswerGroups_AddedById",
                table: "ImageAnswerGroups");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "ImageAnswerGroups");
        }
    }
}
