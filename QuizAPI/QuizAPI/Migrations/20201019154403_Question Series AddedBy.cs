using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class QuestionSeriesAddedBy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "QuestionSeries",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeries_AddedById",
                table: "QuestionSeries",
                column: "AddedById");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionSeries_User_AddedById",
                table: "QuestionSeries",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionSeries_User_AddedById",
                table: "QuestionSeries");

            migrationBuilder.DropIndex(
                name: "IX_QuestionSeries_AddedById",
                table: "QuestionSeries");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "QuestionSeries");
        }
    }
}
