using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Updateebquestion080920212 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BoundryConditionKeyboardId",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EB_BoundryConditionId",
                table: "EB_Answer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EB_BoundryCondition",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    EnergyBalanceQuestionId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EB_BoundryCondition", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EB_BoundryCondition_QuestionBase_EnergyBalanceQuestionId",
                        column: x => x.EnergyBalanceQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EB_BoundryCondition_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBase_BoundryConditionKeyboardId",
                table: "QuestionBase",
                column: "BoundryConditionKeyboardId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Answer_EB_BoundryConditionId",
                table: "EB_Answer",
                column: "EB_BoundryConditionId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_BoundryCondition_EnergyBalanceQuestionId",
                table: "EB_BoundryCondition",
                column: "EnergyBalanceQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_BoundryCondition_InformationId",
                table: "EB_BoundryCondition",
                column: "InformationId");

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Answer_EB_BoundryCondition_EB_BoundryConditionId",
                table: "EB_Answer",
                column: "EB_BoundryConditionId",
                principalTable: "EB_BoundryCondition",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionBase_Keyboards_BoundryConditionKeyboardId",
                table: "QuestionBase",
                column: "BoundryConditionKeyboardId",
                principalTable: "Keyboards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EB_Answer_EB_BoundryCondition_EB_BoundryConditionId",
                table: "EB_Answer");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionBase_Keyboards_BoundryConditionKeyboardId",
                table: "QuestionBase");

            migrationBuilder.DropTable(
                name: "EB_BoundryCondition");

            migrationBuilder.DropIndex(
                name: "IX_QuestionBase_BoundryConditionKeyboardId",
                table: "QuestionBase");

            migrationBuilder.DropIndex(
                name: "IX_EB_Answer_EB_BoundryConditionId",
                table: "EB_Answer");

            migrationBuilder.DropColumn(
                name: "BoundryConditionKeyboardId",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "EB_BoundryConditionId",
                table: "EB_Answer");
        }
    }
}
