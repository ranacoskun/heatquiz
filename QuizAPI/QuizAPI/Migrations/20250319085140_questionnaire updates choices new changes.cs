using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class questionnaireupdateschoicesnewchanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionnaireQuestionChoice_QuestionnaireQuestion_Questionn~",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionnaireQuestionChoice_QuestionnaireQuestion_Question~1",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.DropIndex(
                name: "IX_QuestionnaireQuestionChoice_QuestionnaireQuestionId",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.DropIndex(
                name: "IX_QuestionnaireQuestionChoice_QuestionnaireQuestionChoiceText~",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.DropColumn(
                name: "QuestionnaireQuestionId",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.DropColumn(
                name: "QuestionnaireQuestionChoiceTextInput_QuestionnaireQuestionId",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "QuestionnaireQuestionChoice",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "QuestionnaireQuestionChoice",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "QuestionnaireQuestionId",
                table: "QuestionnaireQuestionChoice",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionnaireQuestionChoiceTextInput_QuestionnaireQuestionId",
                table: "QuestionnaireQuestionChoice",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionChoice_QuestionnaireQuestionId",
                table: "QuestionnaireQuestionChoice",
                column: "QuestionnaireQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionChoice_QuestionnaireQuestionChoiceText~",
                table: "QuestionnaireQuestionChoice",
                column: "QuestionnaireQuestionChoiceTextInput_QuestionnaireQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionnaireQuestionChoice_QuestionnaireQuestion_Questionn~",
                table: "QuestionnaireQuestionChoice",
                column: "QuestionnaireQuestionId",
                principalTable: "QuestionnaireQuestion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionnaireQuestionChoice_QuestionnaireQuestion_Question~1",
                table: "QuestionnaireQuestionChoice",
                column: "QuestionnaireQuestionChoiceTextInput_QuestionnaireQuestionId",
                principalTable: "QuestionnaireQuestion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
