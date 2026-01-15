using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class questionnaireupdates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Questionnaires",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    Code = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questionnaires", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questionnaires_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Questionnaires_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuestionnaireQuestion",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    Title = table.Column<string>(nullable: true),
                    Body = table.Column<string>(nullable: true),
                    IsSingleChoice = table.Column<bool>(nullable: false),
                    ImageURL = table.Column<string>(nullable: true),
                    ImageSize = table.Column<long>(nullable: false),
                    QuestionnaireId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionnaireQuestion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestion_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestion_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestion_Questionnaires_QuestionnaireId",
                        column: x => x.QuestionnaireId,
                        principalTable: "Questionnaires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuestionnaireQuestionChoice",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    LaTex = table.Column<string>(nullable: true),
                    ImageURL = table.Column<string>(nullable: true),
                    ImageSize = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionnaireQuestionChoice", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionChoice_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionChoice_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionChoice_QuestionnaireQuestion_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionnaireQuestion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionnaireQuestionFile",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    URL = table.Column<string>(nullable: true),
                    FileSize = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionnaireQuestionFile", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionFile_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionFile_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionFile_QuestionnaireQuestion_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionnaireQuestion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionnaireQuestionLink",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    URL = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionnaireQuestionLink", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionLink_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionLink_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionnaireQuestionLink_QuestionnaireQuestion_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionnaireQuestion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestion_DataPoolId",
                table: "QuestionnaireQuestion",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestion_InformationId",
                table: "QuestionnaireQuestion",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestion_QuestionnaireId",
                table: "QuestionnaireQuestion",
                column: "QuestionnaireId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionChoice_DataPoolId",
                table: "QuestionnaireQuestionChoice",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionChoice_InformationId",
                table: "QuestionnaireQuestionChoice",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionChoice_QuestionId",
                table: "QuestionnaireQuestionChoice",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionFile_DataPoolId",
                table: "QuestionnaireQuestionFile",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionFile_InformationId",
                table: "QuestionnaireQuestionFile",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionFile_QuestionId",
                table: "QuestionnaireQuestionFile",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionLink_DataPoolId",
                table: "QuestionnaireQuestionLink",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionLink_InformationId",
                table: "QuestionnaireQuestionLink",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnaireQuestionLink_QuestionId",
                table: "QuestionnaireQuestionLink",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Questionnaires_DataPoolId",
                table: "Questionnaires",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_Questionnaires_InformationId",
                table: "Questionnaires",
                column: "InformationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuestionnaireQuestionChoice");

            migrationBuilder.DropTable(
                name: "QuestionnaireQuestionFile");

            migrationBuilder.DropTable(
                name: "QuestionnaireQuestionLink");

            migrationBuilder.DropTable(
                name: "QuestionnaireQuestion");

            migrationBuilder.DropTable(
                name: "Questionnaires");
        }
    }
}
