using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class UpdateTutorials : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tutorial_TutorialsGroup_GroupId",
                table: "Tutorial");

            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "Tutorial",
                newName: "SubtopicId");

            migrationBuilder.RenameIndex(
                name: "IX_Tutorial_GroupId",
                table: "Tutorial",
                newName: "IX_Tutorial_SubtopicId");

            migrationBuilder.AddColumn<int>(
                name: "TutorialsGroupId",
                table: "Tutorial",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tutorial_TutorialsGroupId",
                table: "Tutorial",
                column: "TutorialsGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tutorial_Subtopics_SubtopicId",
                table: "Tutorial",
                column: "SubtopicId",
                principalTable: "Subtopics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tutorial_TutorialsGroup_TutorialsGroupId",
                table: "Tutorial",
                column: "TutorialsGroupId",
                principalTable: "TutorialsGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tutorial_Subtopics_SubtopicId",
                table: "Tutorial");

            migrationBuilder.DropForeignKey(
                name: "FK_Tutorial_TutorialsGroup_TutorialsGroupId",
                table: "Tutorial");

            migrationBuilder.DropIndex(
                name: "IX_Tutorial_TutorialsGroupId",
                table: "Tutorial");

            migrationBuilder.DropColumn(
                name: "TutorialsGroupId",
                table: "Tutorial");

            migrationBuilder.RenameColumn(
                name: "SubtopicId",
                table: "Tutorial",
                newName: "GroupId");

            migrationBuilder.RenameIndex(
                name: "IX_Tutorial_SubtopicId",
                table: "Tutorial",
                newName: "IX_Tutorial_GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tutorial_TutorialsGroup_GroupId",
                table: "Tutorial",
                column: "GroupId",
                principalTable: "TutorialsGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
