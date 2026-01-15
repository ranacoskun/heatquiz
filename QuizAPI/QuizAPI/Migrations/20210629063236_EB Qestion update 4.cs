using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class EBQestionupdate4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EB_Answer_EB_Question_EB_QuestionId",
                table: "EB_Answer");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_Answer_EB_ClickablePart_PartId",
                table: "EB_Answer");

            migrationBuilder.RenameColumn(
                name: "EB_QuestionId",
                table: "EB_Answer",
                newName: "QuestioneerId");

            migrationBuilder.RenameIndex(
                name: "IX_EB_Answer_EB_QuestionId",
                table: "EB_Answer",
                newName: "IX_EB_Answer_QuestioneerId");

            migrationBuilder.AlterColumn<int>(
                name: "PartId",
                table: "EB_Answer",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Answer_EB_ClickablePart_PartId",
                table: "EB_Answer",
                column: "PartId",
                principalTable: "EB_ClickablePart",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Answer_EB_Question_QuestioneerId",
                table: "EB_Answer",
                column: "QuestioneerId",
                principalTable: "EB_Question",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EB_Answer_EB_ClickablePart_PartId",
                table: "EB_Answer");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_Answer_EB_Question_QuestioneerId",
                table: "EB_Answer");

            migrationBuilder.RenameColumn(
                name: "QuestioneerId",
                table: "EB_Answer",
                newName: "EB_QuestionId");

            migrationBuilder.RenameIndex(
                name: "IX_EB_Answer_QuestioneerId",
                table: "EB_Answer",
                newName: "IX_EB_Answer_EB_QuestionId");

            migrationBuilder.AlterColumn<int>(
                name: "PartId",
                table: "EB_Answer",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Answer_EB_Question_EB_QuestionId",
                table: "EB_Answer",
                column: "EB_QuestionId",
                principalTable: "EB_Question",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Answer_EB_ClickablePart_PartId",
                table: "EB_Answer",
                column: "PartId",
                principalTable: "EB_ClickablePart",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
