using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class KeyboardQuestionUpdate10092020 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TextAnswer",
                table: "KeyboardQuestionAnswer");

            migrationBuilder.CreateTable(
                name: "KeyboardQuestionAnswerElement",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    ImageId = table.Column<int>(nullable: true),
                    Value = table.Column<string>(nullable: true),
                    AnswerId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeyboardQuestionAnswerElement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KeyboardQuestionAnswerElement_KeyboardQuestionAnswer_Answer~",
                        column: x => x.AnswerId,
                        principalTable: "KeyboardQuestionAnswer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KeyboardQuestionAnswerElement_VariableKeyVariableCharValidV~",
                        column: x => x.ImageId,
                        principalTable: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswerElement_AnswerId",
                table: "KeyboardQuestionAnswerElement",
                column: "AnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswerElement_ImageId",
                table: "KeyboardQuestionAnswerElement",
                column: "ImageId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KeyboardQuestionAnswerElement");

            migrationBuilder.AddColumn<string>(
                name: "TextAnswer",
                table: "KeyboardQuestionAnswer",
                nullable: true);
        }
    }
}
