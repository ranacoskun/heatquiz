using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class CourseMapElementImages2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "CourseMapElementImages",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "CourseMapElementImages",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElementImages_AddedById",
                table: "CourseMapElementImages",
                column: "AddedById");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapElementImages_User_AddedById",
                table: "CourseMapElementImages",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapElementImages_User_AddedById",
                table: "CourseMapElementImages");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapElementImages_AddedById",
                table: "CourseMapElementImages");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "CourseMapElementImages");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "CourseMapElementImages");
        }
    }
}
