using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Backgroundimageupdate05072021 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Background_ImageId",
                table: "EB_ClickablePart",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Background_ImageId",
                table: "CourseMapElement",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Background_ImageId",
                table: "ClickImage",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Background_ImageId",
                table: "ClickEquation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Background_ImageId",
                table: "ClickChart",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EB_ClickablePart_Background_ImageId",
                table: "EB_ClickablePart",
                column: "Background_ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElement_Background_ImageId",
                table: "CourseMapElement",
                column: "Background_ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickImage_Background_ImageId",
                table: "ClickImage",
                column: "Background_ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickEquation_Background_ImageId",
                table: "ClickEquation",
                column: "Background_ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickChart_Background_ImageId",
                table: "ClickChart",
                column: "Background_ImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClickChart_BackgroundImage_Background_ImageId",
                table: "ClickChart",
                column: "Background_ImageId",
                principalTable: "BackgroundImage",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClickEquation_BackgroundImage_Background_ImageId",
                table: "ClickEquation",
                column: "Background_ImageId",
                principalTable: "BackgroundImage",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClickImage_BackgroundImage_Background_ImageId",
                table: "ClickImage",
                column: "Background_ImageId",
                principalTable: "BackgroundImage",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapElement_BackgroundImage_Background_ImageId",
                table: "CourseMapElement",
                column: "Background_ImageId",
                principalTable: "BackgroundImage",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_ClickablePart_BackgroundImage_Background_ImageId",
                table: "EB_ClickablePart",
                column: "Background_ImageId",
                principalTable: "BackgroundImage",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClickChart_BackgroundImage_Background_ImageId",
                table: "ClickChart");

            migrationBuilder.DropForeignKey(
                name: "FK_ClickEquation_BackgroundImage_Background_ImageId",
                table: "ClickEquation");

            migrationBuilder.DropForeignKey(
                name: "FK_ClickImage_BackgroundImage_Background_ImageId",
                table: "ClickImage");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapElement_BackgroundImage_Background_ImageId",
                table: "CourseMapElement");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_ClickablePart_BackgroundImage_Background_ImageId",
                table: "EB_ClickablePart");

            migrationBuilder.DropIndex(
                name: "IX_EB_ClickablePart_Background_ImageId",
                table: "EB_ClickablePart");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapElement_Background_ImageId",
                table: "CourseMapElement");

            migrationBuilder.DropIndex(
                name: "IX_ClickImage_Background_ImageId",
                table: "ClickImage");

            migrationBuilder.DropIndex(
                name: "IX_ClickEquation_Background_ImageId",
                table: "ClickEquation");

            migrationBuilder.DropIndex(
                name: "IX_ClickChart_Background_ImageId",
                table: "ClickChart");

            migrationBuilder.DropColumn(
                name: "Background_ImageId",
                table: "EB_ClickablePart");

            migrationBuilder.DropColumn(
                name: "Background_ImageId",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "Background_ImageId",
                table: "ClickImage");

            migrationBuilder.DropColumn(
                name: "Background_ImageId",
                table: "ClickEquation");

            migrationBuilder.DropColumn(
                name: "Background_ImageId",
                table: "ClickChart");
        }
    }
}
