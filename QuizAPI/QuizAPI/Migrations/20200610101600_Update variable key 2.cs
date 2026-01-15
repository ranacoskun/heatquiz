using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class Updatevariablekey2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableCharValidValues_VariableKeyVariableChar_~",
                table: "VariableKeyVariableCharValidValues");

            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableCharValidValues_VariableKeyVariableCharV~",
                table: "VariableKeyVariableCharValidValues");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeyVariableCharValidValues_VariableKeyVariableCharV~",
                table: "VariableKeyVariableCharValidValues");

            migrationBuilder.DropColumn(
                name: "VariableKeyVariableCharValidValuesGroupId",
                table: "VariableKeyVariableCharValidValues");

            migrationBuilder.RenameColumn(
                name: "CharId",
                table: "VariableKeyVariableCharValidValues",
                newName: "GroupId");

            migrationBuilder.RenameIndex(
                name: "IX_VariableKeyVariableCharValidValues_CharId",
                table: "VariableKeyVariableCharValidValues",
                newName: "IX_VariableKeyVariableCharValidValues_GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableCharValidValues_VariableKeyVariableCharV~",
                table: "VariableKeyVariableCharValidValues",
                column: "GroupId",
                principalTable: "VariableKeyVariableCharValidValuesGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableCharValidValues_VariableKeyVariableCharV~",
                table: "VariableKeyVariableCharValidValues");

            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "VariableKeyVariableCharValidValues",
                newName: "CharId");

            migrationBuilder.RenameIndex(
                name: "IX_VariableKeyVariableCharValidValues_GroupId",
                table: "VariableKeyVariableCharValidValues",
                newName: "IX_VariableKeyVariableCharValidValues_CharId");

            migrationBuilder.AddColumn<int>(
                name: "VariableKeyVariableCharValidValuesGroupId",
                table: "VariableKeyVariableCharValidValues",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValues_VariableKeyVariableCharV~",
                table: "VariableKeyVariableCharValidValues",
                column: "VariableKeyVariableCharValidValuesGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableCharValidValues_VariableKeyVariableChar_~",
                table: "VariableKeyVariableCharValidValues",
                column: "CharId",
                principalTable: "VariableKeyVariableChar",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableCharValidValues_VariableKeyVariableCharV~",
                table: "VariableKeyVariableCharValidValues",
                column: "VariableKeyVariableCharValidValuesGroupId",
                principalTable: "VariableKeyVariableCharValidValuesGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
