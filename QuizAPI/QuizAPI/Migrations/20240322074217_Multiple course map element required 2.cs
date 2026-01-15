using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Multiplecoursemapelementrequired2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapRequiredElementRelation_CourseMapElement_Required~1",
                table: "CourseMapRequiredElementRelation");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapRequiredElementRelation_RequiredElementId1",
                table: "CourseMapRequiredElementRelation");

            migrationBuilder.DropColumn(
                name: "RequiredElementId1",
                table: "CourseMapRequiredElementRelation");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapRequiredElementRelation_BaseElementId",
                table: "CourseMapRequiredElementRelation",
                column: "BaseElementId");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapRequiredElementRelation_CourseMapElement_BaseEleme~",
                table: "CourseMapRequiredElementRelation",
                column: "BaseElementId",
                principalTable: "CourseMapElement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapRequiredElementRelation_CourseMapElement_BaseEleme~",
                table: "CourseMapRequiredElementRelation");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapRequiredElementRelation_BaseElementId",
                table: "CourseMapRequiredElementRelation");

            migrationBuilder.AddColumn<int>(
                name: "RequiredElementId1",
                table: "CourseMapRequiredElementRelation",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapRequiredElementRelation_RequiredElementId1",
                table: "CourseMapRequiredElementRelation",
                column: "RequiredElementId1");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapRequiredElementRelation_CourseMapElement_Required~1",
                table: "CourseMapRequiredElementRelation",
                column: "RequiredElementId1",
                principalTable: "CourseMapElement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
