using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class diagramsquesiton2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiagramQuestionSectionRelation_QuestionBase_DiagramQuestion~",
                table: "DiagramQuestionSectionRelation");

            migrationBuilder.DropIndex(
                name: "IX_DiagramQuestionSectionRelation_DiagramQuestionId",
                table: "DiagramQuestionSectionRelation");

            migrationBuilder.DropColumn(
                name: "DiagramQuestionId",
                table: "DiagramQuestionSectionRelation");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DiagramQuestionId",
                table: "DiagramQuestionSectionRelation",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionSectionRelation_DiagramQuestionId",
                table: "DiagramQuestionSectionRelation",
                column: "DiagramQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_DiagramQuestionSectionRelation_QuestionBase_DiagramQuestion~",
                table: "DiagramQuestionSectionRelation",
                column: "DiagramQuestionId",
                principalTable: "QuestionBase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
