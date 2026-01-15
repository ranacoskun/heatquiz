using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class simplifyseriesrelation2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "QuestionId",
                table: "QuestionSeriesElement",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesElement_QuestionId",
                table: "QuestionSeriesElement",
                column: "QuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionSeriesElement_QuestionBase_QuestionId",
                table: "QuestionSeriesElement",
                column: "QuestionId",
                principalTable: "QuestionBase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionSeriesElement_QuestionBase_QuestionId",
                table: "QuestionSeriesElement");

            migrationBuilder.DropIndex(
                name: "IX_QuestionSeriesElement_QuestionId",
                table: "QuestionSeriesElement");

            migrationBuilder.DropColumn(
                name: "QuestionId",
                table: "QuestionSeriesElement");
        }
    }
}
