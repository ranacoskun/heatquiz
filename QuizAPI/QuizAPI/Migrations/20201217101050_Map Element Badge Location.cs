using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class MapElementBadgeLocation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapElementBadge_CourseMapElement_CourseMapElementId",
                table: "CourseMapElementBadge");

            migrationBuilder.AlterColumn<int>(
                name: "CourseMapElementId",
                table: "CourseMapElementBadge",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Badge_Length",
                table: "CourseMapElement",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Badge_Width",
                table: "CourseMapElement",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Badge_X",
                table: "CourseMapElement",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Badge_Y",
                table: "CourseMapElement",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapElementBadge_CourseMapElement_CourseMapElementId",
                table: "CourseMapElementBadge",
                column: "CourseMapElementId",
                principalTable: "CourseMapElement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapElementBadge_CourseMapElement_CourseMapElementId",
                table: "CourseMapElementBadge");

            migrationBuilder.DropColumn(
                name: "Badge_Length",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "Badge_Width",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "Badge_X",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "Badge_Y",
                table: "CourseMapElement");

            migrationBuilder.AlterColumn<int>(
                name: "CourseMapElementId",
                table: "CourseMapElementBadge",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapElementBadge_CourseMapElement_CourseMapElementId",
                table: "CourseMapElementBadge",
                column: "CourseMapElementId",
                principalTable: "CourseMapElement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
