using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class TopicAddedBy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "Topics",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Topics_AddedById",
                table: "Topics",
                column: "AddedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Topics_User_AddedById",
                table: "Topics",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Topics_User_AddedById",
                table: "Topics");

            migrationBuilder.DropIndex(
                name: "IX_Topics_AddedById",
                table: "Topics");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "Topics");
        }
    }
}
