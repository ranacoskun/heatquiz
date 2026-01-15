using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class EB_Qupdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EB_Q_L_D_Relation_EB_Question_EB_QuestionId",
                table: "EB_Q_L_D_Relation");

            migrationBuilder.AlterColumn<int>(
                name: "EB_QuestionId",
                table: "EB_Q_L_D_Relation",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Q_L_D_Relation_EB_Question_EB_QuestionId",
                table: "EB_Q_L_D_Relation",
                column: "EB_QuestionId",
                principalTable: "EB_Question",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EB_Q_L_D_Relation_EB_Question_EB_QuestionId",
                table: "EB_Q_L_D_Relation");

            migrationBuilder.AlterColumn<int>(
                name: "EB_QuestionId",
                table: "EB_Q_L_D_Relation",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Q_L_D_Relation_EB_Question_EB_QuestionId",
                table: "EB_Q_L_D_Relation",
                column: "EB_QuestionId",
                principalTable: "EB_Question",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
