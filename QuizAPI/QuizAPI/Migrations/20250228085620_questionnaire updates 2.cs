using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class questionnaireupdates2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "Questionnaires",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Questionnaires_AddedById",
                table: "Questionnaires",
                column: "AddedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Questionnaires_User_AddedById",
                table: "Questionnaires",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questionnaires_User_AddedById",
                table: "Questionnaires");

            migrationBuilder.DropIndex(
                name: "IX_Questionnaires_AddedById",
                table: "Questionnaires");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "Questionnaires");
        }
    }
}
