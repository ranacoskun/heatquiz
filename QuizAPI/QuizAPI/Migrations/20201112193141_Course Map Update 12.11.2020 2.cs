using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class CourseMapUpdate121120202 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CourseMap_CourseId",
                table: "CourseMap");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMap_CourseId",
                table: "CourseMap",
                column: "CourseId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CourseMap_CourseId",
                table: "CourseMap");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMap_CourseId",
                table: "CourseMap",
                column: "CourseId",
                unique: true);
        }
    }
}
