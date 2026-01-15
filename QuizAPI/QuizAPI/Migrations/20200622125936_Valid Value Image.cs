using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class ValidValueImage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    GroupId = table.Column<int>(nullable: false),
                    URL = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariableKeyVariableCharValidValuesGroupChoiceImage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VariableKeyVariableCharValidValuesGroupChoiceImage_Variable~",
                        column: x => x.GroupId,
                        principalTable: "VariableKeyVariableCharValidValuesGroup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroupChoiceImage_GroupId",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                column: "GroupId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VariableKeyVariableCharValidValuesGroupChoiceImage");
        }
    }
}
