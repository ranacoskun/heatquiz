using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class ChangeVarKeys : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KeyboardVariableKeyId",
                table: "VariableKeyVariableCharValidValuesGroup",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroup_KeyboardVariableKey~",
                table: "VariableKeyVariableCharValidValuesGroup",
                column: "KeyboardVariableKeyId");

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroup_VariableKeys_Keyboa~",
                table: "VariableKeyVariableCharValidValuesGroup",
                column: "KeyboardVariableKeyId",
                principalTable: "VariableKeys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroup_VariableKeys_Keyboa~",
                table: "VariableKeyVariableCharValidValuesGroup");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroup_KeyboardVariableKey~",
                table: "VariableKeyVariableCharValidValuesGroup");

            migrationBuilder.DropColumn(
                name: "KeyboardVariableKeyId",
                table: "VariableKeyVariableCharValidValuesGroup");
        }
    }
}
