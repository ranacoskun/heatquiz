using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class EBQuestionupdate3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EB_ClickablePart_Keyboards_KeyboardId",
                table: "EB_ClickablePart");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_Question_Keyboards_KeyboardId",
                table: "EB_Question");

            migrationBuilder.AlterColumn<int>(
                name: "KeyboardId",
                table: "EB_Question",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "KeyboardId",
                table: "EB_ClickablePart",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_EB_ClickablePart_Keyboards_KeyboardId",
                table: "EB_ClickablePart",
                column: "KeyboardId",
                principalTable: "Keyboards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Question_Keyboards_KeyboardId",
                table: "EB_Question",
                column: "KeyboardId",
                principalTable: "Keyboards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EB_ClickablePart_Keyboards_KeyboardId",
                table: "EB_ClickablePart");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_Question_Keyboards_KeyboardId",
                table: "EB_Question");

            migrationBuilder.AlterColumn<int>(
                name: "KeyboardId",
                table: "EB_Question",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "KeyboardId",
                table: "EB_ClickablePart",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_ClickablePart_Keyboards_KeyboardId",
                table: "EB_ClickablePart",
                column: "KeyboardId",
                principalTable: "Keyboards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Question_Keyboards_KeyboardId",
                table: "EB_Question",
                column: "KeyboardId",
                principalTable: "Keyboards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
