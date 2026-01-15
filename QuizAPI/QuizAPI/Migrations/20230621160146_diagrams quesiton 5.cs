using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class diagramsquesiton5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiagramQuestionPlot_QuestionBase_DiagramQuestionId",
                table: "DiagramQuestionPlot");

            migrationBuilder.DropIndex(
                name: "IX_DiagramQuestionPlot_DiagramQuestionId",
                table: "DiagramQuestionPlot");

            migrationBuilder.DropColumn(
                name: "DiagramQuestionId",
                table: "DiagramQuestionPlot");

            migrationBuilder.AddColumn<int>(
                name: "QuestionId",
                table: "DiagramQuestionPlot",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionPlot_QuestionId",
                table: "DiagramQuestionPlot",
                column: "QuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_DiagramQuestionPlot_QuestionBase_QuestionId",
                table: "DiagramQuestionPlot",
                column: "QuestionId",
                principalTable: "QuestionBase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiagramQuestionPlot_QuestionBase_QuestionId",
                table: "DiagramQuestionPlot");

            migrationBuilder.DropIndex(
                name: "IX_DiagramQuestionPlot_QuestionId",
                table: "DiagramQuestionPlot");

            migrationBuilder.DropColumn(
                name: "QuestionId",
                table: "DiagramQuestionPlot");

            migrationBuilder.AddColumn<int>(
                name: "DiagramQuestionId",
                table: "DiagramQuestionPlot",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionPlot_DiagramQuestionId",
                table: "DiagramQuestionPlot",
                column: "DiagramQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_DiagramQuestionPlot_QuestionBase_DiagramQuestionId",
                table: "DiagramQuestionPlot",
                column: "DiagramQuestionId",
                principalTable: "QuestionBase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
