using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class EBupdates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EnergyBalanceQuestionUpdated_BoundryConditionKeyboardId",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InitialConditionKeyboardId",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EnergyBalanceQuestionUpdatedId",
                table: "EnergyBalanceQuestion_GeneralAnswers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EnergyBalanceQuestionUpdatedId1",
                table: "EnergyBalanceQuestion_GeneralAnswers",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBase_EnergyBalanceQuestionUpdated_BoundryConditionK~",
                table: "QuestionBase",
                column: "EnergyBalanceQuestionUpdated_BoundryConditionKeyboardId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBase_InitialConditionKeyboardId",
                table: "QuestionBase",
                column: "InitialConditionKeyboardId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswers_EnergyBalanceQuestionU~",
                table: "EnergyBalanceQuestion_GeneralAnswers",
                column: "EnergyBalanceQuestionUpdatedId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswers_EnergyBalanceQuestion~1",
                table: "EnergyBalanceQuestion_GeneralAnswers",
                column: "EnergyBalanceQuestionUpdatedId1");

            migrationBuilder.AddForeignKey(
                name: "FK_EnergyBalanceQuestion_GeneralAnswers_QuestionBase_EnergyBal~",
                table: "EnergyBalanceQuestion_GeneralAnswers",
                column: "EnergyBalanceQuestionUpdatedId",
                principalTable: "QuestionBase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EnergyBalanceQuestion_GeneralAnswers_QuestionBase_EnergyBa~1",
                table: "EnergyBalanceQuestion_GeneralAnswers",
                column: "EnergyBalanceQuestionUpdatedId1",
                principalTable: "QuestionBase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionBase_Keyboards_EnergyBalanceQuestionUpdated_Boundry~",
                table: "QuestionBase",
                column: "EnergyBalanceQuestionUpdated_BoundryConditionKeyboardId",
                principalTable: "Keyboards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionBase_Keyboards_InitialConditionKeyboardId",
                table: "QuestionBase",
                column: "InitialConditionKeyboardId",
                principalTable: "Keyboards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EnergyBalanceQuestion_GeneralAnswers_QuestionBase_EnergyBal~",
                table: "EnergyBalanceQuestion_GeneralAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_EnergyBalanceQuestion_GeneralAnswers_QuestionBase_EnergyBa~1",
                table: "EnergyBalanceQuestion_GeneralAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionBase_Keyboards_EnergyBalanceQuestionUpdated_Boundry~",
                table: "QuestionBase");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionBase_Keyboards_InitialConditionKeyboardId",
                table: "QuestionBase");

            migrationBuilder.DropIndex(
                name: "IX_QuestionBase_EnergyBalanceQuestionUpdated_BoundryConditionK~",
                table: "QuestionBase");

            migrationBuilder.DropIndex(
                name: "IX_QuestionBase_InitialConditionKeyboardId",
                table: "QuestionBase");

            migrationBuilder.DropIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswers_EnergyBalanceQuestionU~",
                table: "EnergyBalanceQuestion_GeneralAnswers");

            migrationBuilder.DropIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswers_EnergyBalanceQuestion~1",
                table: "EnergyBalanceQuestion_GeneralAnswers");

            migrationBuilder.DropColumn(
                name: "EnergyBalanceQuestionUpdated_BoundryConditionKeyboardId",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "InitialConditionKeyboardId",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "EnergyBalanceQuestionUpdatedId",
                table: "EnergyBalanceQuestion_GeneralAnswers");

            migrationBuilder.DropColumn(
                name: "EnergyBalanceQuestionUpdatedId1",
                table: "EnergyBalanceQuestion_GeneralAnswers");
        }
    }
}
