using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Energybalancequestionupdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "QuestionText",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EnergyBalanceQuestion_BC",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    Code = table.Column<string>(nullable: true),
                    Latex = table.Column<string>(nullable: true),
                    LatexText = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnergyBalanceQuestion_BC", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_BC_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_BC_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_BC_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EnergyBalanceQuestion_ControlVolume",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    X = table.Column<int>(nullable: false),
                    Y = table.Column<int>(nullable: false),
                    Width = table.Column<int>(nullable: false),
                    Height = table.Column<int>(nullable: false),
                    Correct = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnergyBalanceQuestion_ControlVolume", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_ControlVolume_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_ControlVolume_Information_Information~",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_ControlVolume_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EnergyBalanceQuestion_EBTerm",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    Code = table.Column<string>(nullable: true),
                    Latex = table.Column<string>(nullable: true),
                    LatexText = table.Column<string>(nullable: true),
                    West = table.Column<bool>(nullable: false),
                    North = table.Column<bool>(nullable: false),
                    East = table.Column<bool>(nullable: false),
                    South = table.Column<bool>(nullable: false),
                    Center = table.Column<bool>(nullable: false),
                    IsDummy = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnergyBalanceQuestion_EBTerm", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_EBTerm_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_EBTerm_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_EBTerm_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EnergyBalanceQuestion_EBTerm_Question",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    LatexCode = table.Column<string>(nullable: true),
                    KeyboardId = table.Column<int>(nullable: false),
                    EnergyBalanceQuestion_EBTermId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnergyBalanceQuestion_EBTerm_Question", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_EBTerm_Question_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_EBTerm_Question_EnergyBalanceQuestion~",
                        column: x => x.EnergyBalanceQuestion_EBTermId,
                        principalTable: "EnergyBalanceQuestion_EBTerm",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_EBTerm_Question_Information_Informati~",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_EBTerm_Question_Keyboards_KeyboardId",
                        column: x => x.KeyboardId,
                        principalTable: "Keyboards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EnergyBalanceQuestion_GeneralAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: true),
                    EnergyBalanceQuestion_BCId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnergyBalanceQuestion_GeneralAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_GeneralAnswers_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_GeneralAnswers_EnergyBalanceQuestion_~",
                        column: x => x.EnergyBalanceQuestion_BCId,
                        principalTable: "EnergyBalanceQuestion_BC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_GeneralAnswers_Information_Informatio~",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_GeneralAnswers_EnergyBalanceQuestion~1",
                        column: x => x.QuestionId,
                        principalTable: "EnergyBalanceQuestion_EBTerm_Question",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EnergyBalanceQuestion_GeneralAnswerElement",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    NumericKeyId = table.Column<int>(nullable: true),
                    ImageId = table.Column<int>(nullable: true),
                    Value = table.Column<string>(nullable: true),
                    AnswerId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnergyBalanceQuestion_GeneralAnswerElement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_GeneralAnswerElement_EnergyBalanceQue~",
                        column: x => x.AnswerId,
                        principalTable: "EnergyBalanceQuestion_GeneralAnswers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_GeneralAnswerElement_DataPools_DataPo~",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_GeneralAnswerElement_KeyboardVariable~",
                        column: x => x.ImageId,
                        principalTable: "KeyboardVariableKeyImageRelation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_GeneralAnswerElement_Information_Info~",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EnergyBalanceQuestion_GeneralAnswerElement_KeyboardNumericK~",
                        column: x => x.NumericKeyId,
                        principalTable: "KeyboardNumericKeyRelation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_BC_DataPoolId",
                table: "EnergyBalanceQuestion_BC",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_BC_InformationId",
                table: "EnergyBalanceQuestion_BC",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_BC_QuestionId",
                table: "EnergyBalanceQuestion_BC",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_ControlVolume_DataPoolId",
                table: "EnergyBalanceQuestion_ControlVolume",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_ControlVolume_InformationId",
                table: "EnergyBalanceQuestion_ControlVolume",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_ControlVolume_QuestionId",
                table: "EnergyBalanceQuestion_ControlVolume",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_EBTerm_DataPoolId",
                table: "EnergyBalanceQuestion_EBTerm",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_EBTerm_InformationId",
                table: "EnergyBalanceQuestion_EBTerm",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_EBTerm_QuestionId",
                table: "EnergyBalanceQuestion_EBTerm",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_EBTerm_Question_DataPoolId",
                table: "EnergyBalanceQuestion_EBTerm_Question",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_EBTerm_Question_EnergyBalanceQuestion~",
                table: "EnergyBalanceQuestion_EBTerm_Question",
                column: "EnergyBalanceQuestion_EBTermId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_EBTerm_Question_InformationId",
                table: "EnergyBalanceQuestion_EBTerm_Question",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_EBTerm_Question_KeyboardId",
                table: "EnergyBalanceQuestion_EBTerm_Question",
                column: "KeyboardId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswerElement_AnswerId",
                table: "EnergyBalanceQuestion_GeneralAnswerElement",
                column: "AnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswerElement_DataPoolId",
                table: "EnergyBalanceQuestion_GeneralAnswerElement",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswerElement_ImageId",
                table: "EnergyBalanceQuestion_GeneralAnswerElement",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswerElement_InformationId",
                table: "EnergyBalanceQuestion_GeneralAnswerElement",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswerElement_NumericKeyId",
                table: "EnergyBalanceQuestion_GeneralAnswerElement",
                column: "NumericKeyId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswers_DataPoolId",
                table: "EnergyBalanceQuestion_GeneralAnswers",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswers_EnergyBalanceQuestion_~",
                table: "EnergyBalanceQuestion_GeneralAnswers",
                column: "EnergyBalanceQuestion_BCId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswers_InformationId",
                table: "EnergyBalanceQuestion_GeneralAnswers",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyBalanceQuestion_GeneralAnswers_QuestionId",
                table: "EnergyBalanceQuestion_GeneralAnswers",
                column: "QuestionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EnergyBalanceQuestion_ControlVolume");

            migrationBuilder.DropTable(
                name: "EnergyBalanceQuestion_GeneralAnswerElement");

            migrationBuilder.DropTable(
                name: "EnergyBalanceQuestion_GeneralAnswers");

            migrationBuilder.DropTable(
                name: "EnergyBalanceQuestion_BC");

            migrationBuilder.DropTable(
                name: "EnergyBalanceQuestion_EBTerm_Question");

            migrationBuilder.DropTable(
                name: "EnergyBalanceQuestion_EBTerm");

            migrationBuilder.DropColumn(
                name: "QuestionText",
                table: "QuestionBase");
        }
    }
}
