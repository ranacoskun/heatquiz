using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class KeyboardRelations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KeyboardQuestionSubgroupRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    SubgroupId = table.Column<int>(nullable: false),
                    QuestionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeyboardQuestionSubgroupRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KeyboardQuestionSubgroupRelation_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KeyboardQuestionSubgroupRelation_QuestionSubgroups_Subgroup~",
                        column: x => x.SubgroupId,
                        principalTable: "QuestionSubgroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionSubgroupRelation_QuestionId",
                table: "KeyboardQuestionSubgroupRelation",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionSubgroupRelation_SubgroupId",
                table: "KeyboardQuestionSubgroupRelation",
                column: "SubgroupId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KeyboardQuestionSubgroupRelation");
        }
    }
}
