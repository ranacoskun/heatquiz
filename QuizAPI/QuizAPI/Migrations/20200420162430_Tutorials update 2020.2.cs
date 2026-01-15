using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Tutorialsupdate20202 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TutorialsGroup_Courses_CourseId",
                table: "TutorialsGroup");

            migrationBuilder.AlterColumn<int>(
                name: "CourseId",
                table: "TutorialsGroup",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_TutorialsGroup_Courses_CourseId",
                table: "TutorialsGroup",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TutorialsGroup_Courses_CourseId",
                table: "TutorialsGroup");

            migrationBuilder.AlterColumn<int>(
                name: "CourseId",
                table: "TutorialsGroup",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TutorialsGroup_Courses_CourseId",
                table: "TutorialsGroup",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
