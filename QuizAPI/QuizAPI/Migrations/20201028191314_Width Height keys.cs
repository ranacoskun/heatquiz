using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class WidthHeightkeys : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Width",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "NumericKeys",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Width",
                table: "NumericKeys",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Height",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage");

            migrationBuilder.DropColumn(
                name: "Height",
                table: "NumericKeys");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "NumericKeys");
        }
    }
}
