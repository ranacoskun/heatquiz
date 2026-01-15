using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Editedbyquestionbase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EditedById",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBase_EditedById",
                table: "QuestionBase",
                column: "EditedById");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionBase_User_EditedById",
                table: "QuestionBase",
                column: "EditedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionBase_User_EditedById",
                table: "QuestionBase");

            migrationBuilder.DropIndex(
                name: "IX_QuestionBase_EditedById",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "EditedById",
                table: "QuestionBase");
        }
    }
}
