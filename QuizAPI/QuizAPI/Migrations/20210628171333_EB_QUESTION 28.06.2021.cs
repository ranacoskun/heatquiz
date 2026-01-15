using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class EB_QUESTION28062021 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KeyboardId",
                table: "EB_Question",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "KeyboardId",
                table: "EB_ClickablePart",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_EB_Question_KeyboardId",
                table: "EB_Question",
                column: "KeyboardId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_ClickablePart_KeyboardId",
                table: "EB_ClickablePart",
                column: "KeyboardId");

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EB_ClickablePart_Keyboards_KeyboardId",
                table: "EB_ClickablePart");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_Question_Keyboards_KeyboardId",
                table: "EB_Question");

            migrationBuilder.DropIndex(
                name: "IX_EB_Question_KeyboardId",
                table: "EB_Question");

            migrationBuilder.DropIndex(
                name: "IX_EB_ClickablePart_KeyboardId",
                table: "EB_ClickablePart");

            migrationBuilder.DropColumn(
                name: "KeyboardId",
                table: "EB_Question");

            migrationBuilder.DropColumn(
                name: "KeyboardId",
                table: "EB_ClickablePart");
        }
    }
}
