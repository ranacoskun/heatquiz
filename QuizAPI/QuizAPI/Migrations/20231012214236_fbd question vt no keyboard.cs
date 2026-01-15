using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class fbdquestionvtnokeyboard : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FreebodyDiagramQuestion_VectorTerm_Keyboards_KeyboardId",
                table: "FreebodyDiagramQuestion_VectorTerm");

            migrationBuilder.AlterColumn<int>(
                name: "KeyboardId",
                table: "FreebodyDiagramQuestion_VectorTerm",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_FreebodyDiagramQuestion_VectorTerm_Keyboards_KeyboardId",
                table: "FreebodyDiagramQuestion_VectorTerm",
                column: "KeyboardId",
                principalTable: "Keyboards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FreebodyDiagramQuestion_VectorTerm_Keyboards_KeyboardId",
                table: "FreebodyDiagramQuestion_VectorTerm");

            migrationBuilder.AlterColumn<int>(
                name: "KeyboardId",
                table: "FreebodyDiagramQuestion_VectorTerm",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FreebodyDiagramQuestion_VectorTerm_Keyboards_KeyboardId",
                table: "FreebodyDiagramQuestion_VectorTerm",
                column: "KeyboardId",
                principalTable: "Keyboards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
