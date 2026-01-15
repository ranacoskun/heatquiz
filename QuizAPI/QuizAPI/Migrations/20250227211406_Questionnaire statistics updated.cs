using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Questionnairestatisticsupdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionnaireQuestion_Questionnaires_QuestionnaireId",
                table: "QuestionnaireQuestion");

            migrationBuilder.AddColumn<string>(
                name: "Explanation",
                table: "Questionnaires",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "QuestionnaireId",
                table: "QuestionnaireQuestion",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "QuestionnaireStatisticInstanceBase",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    QuestionnaireId = table.Column<int>(nullable: false),
                    Player = table.Column<string>(nullable: true),
                    Key = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionnaireStatisticInstanceBase", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionnaireStatisticInstanceBase_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireStatisticInstanceBase_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireStatisticInstanceBase_Questionnaires_Questionn~",
                        column: x => x.QuestionnaireId,
                        principalTable: "Questionnaires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionnaireStatisticInstance",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    BaseId = table.Column<int>(nullable: false),
                    QuestionId = table.Column<int>(nullable: false),
                    RemovedChoicesCount = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionnaireStatisticInstance", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionnaireStatisticInstance_QuestionnaireStatisticInstan~",
                        column: x => x.BaseId,
                        principalTable: "QuestionnaireStatisticInstanceBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionnaireStatisticInstance_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireStatisticInstance_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireStatisticInstance_QuestionnaireQuestion_Questi~",
                        column: x => x.QuestionId,
                        principalTable: "QuestionnaireQuestion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionnaireQuestionChoiceStatistic",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    InstanceId = table.Column<int>(nullable: true),
                    InstanceeId = table.Column<int>(nullable: false),
                    ChoiceId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionnaireQuestionChoiceStatistic", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionChoiceStatistic_QuestionnaireQuestionC~",
                        column: x => x.ChoiceId,
                        principalTable: "QuestionnaireQuestionChoice",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionChoiceStatistic_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionChoiceStatistic_Information_Informatio~",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionChoiceStatistic_QuestionnaireStatistic~",
                        column: x => x.InstanceId,
                        principalTable: "QuestionnaireStatisticInstance",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionChoiceStatistic_ChoiceId",
                table: "QuestionnaireQuestionChoiceStatistic",
                column: "ChoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionChoiceStatistic_DataPoolId",
                table: "QuestionnaireQuestionChoiceStatistic",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionChoiceStatistic_InformationId",
                table: "QuestionnaireQuestionChoiceStatistic",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionChoiceStatistic_InstanceId",
                table: "QuestionnaireQuestionChoiceStatistic",
                column: "InstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireStatisticInstance_BaseId",
                table: "QuestionnaireStatisticInstance",
                column: "BaseId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireStatisticInstance_DataPoolId",
                table: "QuestionnaireStatisticInstance",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireStatisticInstance_InformationId",
                table: "QuestionnaireStatisticInstance",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireStatisticInstance_QuestionId",
                table: "QuestionnaireStatisticInstance",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireStatisticInstanceBase_DataPoolId",
                table: "QuestionnaireStatisticInstanceBase",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireStatisticInstanceBase_InformationId",
                table: "QuestionnaireStatisticInstanceBase",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireStatisticInstanceBase_QuestionnaireId",
                table: "QuestionnaireStatisticInstanceBase",
                column: "QuestionnaireId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionnaireQuestion_Questionnaires_QuestionnaireId",
                table: "QuestionnaireQuestion",
                column: "QuestionnaireId",
                principalTable: "Questionnaires",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionnaireQuestion_Questionnaires_QuestionnaireId",
                table: "QuestionnaireQuestion");

            migrationBuilder.DropTable(
                name: "QuestionnaireQuestionChoiceStatistic");

            migrationBuilder.DropTable(
                name: "QuestionnaireStatisticInstance");

            migrationBuilder.DropTable(
                name: "QuestionnaireStatisticInstanceBase");

            migrationBuilder.DropColumn(
                name: "Explanation",
                table: "Questionnaires");

            migrationBuilder.AlterColumn<int>(
                name: "QuestionnaireId",
                table: "QuestionnaireQuestion",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionnaireQuestion_Questionnaires_QuestionnaireId",
                table: "QuestionnaireQuestion",
                column: "QuestionnaireId",
                principalTable: "Questionnaires",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
