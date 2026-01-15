using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class questionnaireupdateschoicesnewinputtypes2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "QuestionnaireQuestionChoice",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "End",
                table: "QuestionnaireQuestionChoice",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionnaireQuestionId",
                table: "QuestionnaireQuestionChoice",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Start",
                table: "QuestionnaireQuestionChoice",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Step",
                table: "QuestionnaireQuestionChoice",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxCharacterCount",
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

        protected override void Down(MigrationBuilder migrationBuilder)
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
                name: "End",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.DropColumn(
                name: "QuestionnaireQuestionId",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.DropColumn(
                name: "Start",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.DropColumn(
                name: "Step",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.DropColumn(
                name: "MaxCharacterCount",
                table: "QuestionnaireQuestionChoice");

            migrationBuilder.DropColumn(
                name: "QuestionnaireQuestionChoiceTextInput_QuestionnaireQuestionId",
                table: "QuestionnaireQuestionChoice");
        }
    }
}
