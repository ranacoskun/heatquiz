using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Updatekeys : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TextPresentation",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TextPresentation",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage");
        }
    }
}
