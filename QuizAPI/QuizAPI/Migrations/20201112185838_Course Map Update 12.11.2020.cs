using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class CourseMapUpdate12112020 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "PDFSize",
                table: "CourseMapElement",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "PDFURL",
                table: "CourseMapElement",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionSeriesId",
                table: "CourseMapElement",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsSeriesMap",
                table: "CourseMap",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "CourseMap",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElement_QuestionSeriesId",
                table: "CourseMapElement",
                column: "QuestionSeriesId");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapElement_QuestionSeries_QuestionSeriesId",
                table: "CourseMapElement",
                column: "QuestionSeriesId",
                principalTable: "QuestionSeries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapElement_QuestionSeries_QuestionSeriesId",
                table: "CourseMapElement");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapElement_QuestionSeriesId",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "PDFSize",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "PDFURL",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "QuestionSeriesId",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "IsSeriesMap",
                table: "CourseMap");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "CourseMap");
        }
    }
}
