using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class ValidValuesGroups : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "VariableKeyVariableCharValidValuesGroupId",
                table: "VariableKeyVariableCharValidValues",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VariableKeyVariableCharValidValuesGroup",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    VariableKeyVariableCharId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariableKeyVariableCharValidValuesGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VariableKeyVariableCharValidValuesGroup_VariableKeyVariable~",
                        column: x => x.VariableKeyVariableCharId,
                        principalTable: "VariableKeyVariableChar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValues_VariableKeyVariableCharV~",
                table: "VariableKeyVariableCharValidValues",
                column: "VariableKeyVariableCharValidValuesGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroup_VariableKeyVariable~",
                table: "VariableKeyVariableCharValidValuesGroup",
                column: "VariableKeyVariableCharId");

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableCharValidValues_VariableKeyVariableCharV~",
                table: "VariableKeyVariableCharValidValues",
                column: "VariableKeyVariableCharValidValuesGroupId",
                principalTable: "VariableKeyVariableCharValidValuesGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableCharValidValues_VariableKeyVariableCharV~",
                table: "VariableKeyVariableCharValidValues");

            migrationBuilder.DropTable(
                name: "VariableKeyVariableCharValidValuesGroup");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeyVariableCharValidValues_VariableKeyVariableCharV~",
                table: "VariableKeyVariableCharValidValues");

            migrationBuilder.DropColumn(
                name: "VariableKeyVariableCharValidValuesGroupId",
                table: "VariableKeyVariableCharValidValues");
        }
    }
}
