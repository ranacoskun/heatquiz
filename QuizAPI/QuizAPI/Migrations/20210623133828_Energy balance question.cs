using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Energybalancequestion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EBLatex",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EB_ClickablePart",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    X = table.Column<int>(nullable: false),
                    Y = table.Column<int>(nullable: false),
                    RelativeToImageX = table.Column<int>(nullable: false),
                    RelativeToImageY = table.Column<int>(nullable: false),
                    Width = table.Column<int>(nullable: false),
                    Height = table.Column<int>(nullable: false),
                    AnswerWeight = table.Column<int>(nullable: false),
                    BackgroundImage = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EB_ClickablePart", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EB_ClickablePart_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EB_ClickablePart_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EB_Answer",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    PartId = table.Column<int>(nullable: false),
                    Type = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EB_Answer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EB_Answer_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EB_Answer_EB_ClickablePart_PartId",
                        column: x => x.PartId,
                        principalTable: "EB_ClickablePart",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EB_AnswerElement",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    NumericKeyId = table.Column<int>(nullable: true),
                    ImageId = table.Column<int>(nullable: true),
                    Value = table.Column<string>(nullable: true),
                    AnswerId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EB_AnswerElement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EB_AnswerElement_EB_Answer_AnswerId",
                        column: x => x.AnswerId,
                        principalTable: "EB_Answer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EB_AnswerElement_KeyboardVariableKeyImageRelation_ImageId",
                        column: x => x.ImageId,
                        principalTable: "KeyboardVariableKeyImageRelation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EB_AnswerElement_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EB_AnswerElement_KeyboardNumericKeyRelation_NumericKeyId",
                        column: x => x.NumericKeyId,
                        principalTable: "KeyboardNumericKeyRelation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EB_Answer_InformationId",
                table: "EB_Answer",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Answer_PartId",
                table: "EB_Answer",
                column: "PartId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_AnswerElement_AnswerId",
                table: "EB_AnswerElement",
                column: "AnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_AnswerElement_ImageId",
                table: "EB_AnswerElement",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_AnswerElement_InformationId",
                table: "EB_AnswerElement",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_AnswerElement_NumericKeyId",
                table: "EB_AnswerElement",
                column: "NumericKeyId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_ClickablePart_InformationId",
                table: "EB_ClickablePart",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_ClickablePart_QuestionId",
                table: "EB_ClickablePart",
                column: "QuestionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EB_AnswerElement");

            migrationBuilder.DropTable(
                name: "EB_Answer");

            migrationBuilder.DropTable(
                name: "EB_ClickablePart");

            migrationBuilder.DropColumn(
                name: "EBLatex",
                table: "QuestionBase");
        }
    }
}
