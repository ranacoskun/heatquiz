using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class EBQuestionupdate17082021 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ArrowRadius",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDummy",
                table: "EB_Q_L_D_Relation",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ArrowRadius",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "IsDummy",
                table: "EB_Q_L_D_Relation");
        }
    }
}
