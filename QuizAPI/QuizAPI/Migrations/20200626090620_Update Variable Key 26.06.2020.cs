using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class UpdateVariableKey26062020 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroup_VariableKeyVariable~",
                table: "VariableKeyVariableCharValidValuesGroup");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroup_CharId",
                table: "VariableKeyVariableCharValidValuesGroup");

            migrationBuilder.DropColumn(
                name: "CharId",
                table: "VariableKeyVariableCharValidValuesGroup");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CharId",
                table: "VariableKeyVariableCharValidValuesGroup",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroup_CharId",
                table: "VariableKeyVariableCharValidValuesGroup",
                column: "CharId");

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroup_VariableKeyVariable~",
                table: "VariableKeyVariableCharValidValuesGroup",
                column: "CharId",
                principalTable: "VariableKeyVariableChar",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
