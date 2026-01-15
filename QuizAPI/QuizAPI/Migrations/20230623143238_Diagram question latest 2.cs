using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Diagramquestionlatest2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiagramQuestionSectionRelation_DiagramQuestionPlot_DiagramQ~",
                table: "DiagramQuestionSectionRelation");

            migrationBuilder.DropIndex(
                name: "IX_DiagramQuestionSectionRelation_DiagramQuestion_PlotId",
                table: "DiagramQuestionSectionRelation");

            migrationBuilder.DropColumn(
                name: "DiagramQuestion_PlotId",
                table: "DiagramQuestionSectionRelation");

            migrationBuilder.AddColumn<int>(
                name: "PlotId",
                table: "DiagramQuestionSectionRelation",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionSectionRelation_PlotId",
                table: "DiagramQuestionSectionRelation",
                column: "PlotId");

            migrationBuilder.AddForeignKey(
                name: "FK_DiagramQuestionSectionRelation_DiagramQuestionPlot_PlotId",
                table: "DiagramQuestionSectionRelation",
                column: "PlotId",
                principalTable: "DiagramQuestionPlot",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiagramQuestionSectionRelation_DiagramQuestionPlot_PlotId",
                table: "DiagramQuestionSectionRelation");

            migrationBuilder.DropIndex(
                name: "IX_DiagramQuestionSectionRelation_PlotId",
                table: "DiagramQuestionSectionRelation");

            migrationBuilder.DropColumn(
                name: "PlotId",
                table: "DiagramQuestionSectionRelation");

            migrationBuilder.AddColumn<int>(
                name: "DiagramQuestion_PlotId",
                table: "DiagramQuestionSectionRelation",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionSectionRelation_DiagramQuestion_PlotId",
                table: "DiagramQuestionSectionRelation",
                column: "DiagramQuestion_PlotId");

            migrationBuilder.AddForeignKey(
                name: "FK_DiagramQuestionSectionRelation_DiagramQuestionPlot_DiagramQ~",
                table: "DiagramQuestionSectionRelation",
                column: "DiagramQuestion_PlotId",
                principalTable: "DiagramQuestionPlot",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
