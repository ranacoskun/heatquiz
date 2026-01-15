using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class SCquestionChartRelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClickChart_QuestionBase_SimpleClickableQuestionId",
                table: "ClickChart");

            migrationBuilder.DropIndex(
                name: "IX_ClickChart_SimpleClickableQuestionId",
                table: "ClickChart");

            migrationBuilder.DropColumn(
                name: "SimpleClickableQuestionId",
                table: "ClickChart");

            migrationBuilder.AddColumn<int>(
                name: "QuestionId",
                table: "ClickChart",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ClickChart_QuestionId",
                table: "ClickChart",
                column: "QuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClickChart_QuestionBase_QuestionId",
                table: "ClickChart",
                column: "QuestionId",
                principalTable: "QuestionBase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClickChart_QuestionBase_QuestionId",
                table: "ClickChart");

            migrationBuilder.DropIndex(
                name: "IX_ClickChart_QuestionId",
                table: "ClickChart");

            migrationBuilder.DropColumn(
                name: "QuestionId",
                table: "ClickChart");

            migrationBuilder.AddColumn<int>(
                name: "SimpleClickableQuestionId",
                table: "ClickChart",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClickChart_SimpleClickableQuestionId",
                table: "ClickChart",
                column: "SimpleClickableQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClickChart_QuestionBase_SimpleClickableQuestionId",
                table: "ClickChart",
                column: "SimpleClickableQuestionId",
                principalTable: "QuestionBase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
