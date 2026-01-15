using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class EBQuestionlatestupdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EB_Label",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EB_Label", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EB_Label_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EB_Label_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EB_Q_L_D_Relation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    EB_QuestionId = table.Column<int>(nullable: false),
                    ClickablePartId = table.Column<int>(nullable: false),
                    LabelId = table.Column<int>(nullable: false),
                    Direction = table.Column<int>(nullable: false),
                    Correct = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EB_Q_L_D_Relation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EB_Q_L_D_Relation_EB_ClickablePart_ClickablePartId",
                        column: x => x.ClickablePartId,
                        principalTable: "EB_ClickablePart",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EB_Q_L_D_Relation_EB_Question_EB_QuestionId",
                        column: x => x.EB_QuestionId,
                        principalTable: "EB_Question",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EB_Q_L_D_Relation_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EB_Q_L_D_Relation_EB_Label_LabelId",
                        column: x => x.LabelId,
                        principalTable: "EB_Label",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EB_Label_InformationId",
                table: "EB_Label",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Label_QuestionId",
                table: "EB_Label",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Q_L_D_Relation_ClickablePartId",
                table: "EB_Q_L_D_Relation",
                column: "ClickablePartId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Q_L_D_Relation_EB_QuestionId",
                table: "EB_Q_L_D_Relation",
                column: "EB_QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Q_L_D_Relation_InformationId",
                table: "EB_Q_L_D_Relation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Q_L_D_Relation_LabelId",
                table: "EB_Q_L_D_Relation",
                column: "LabelId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EB_Q_L_D_Relation");

            migrationBuilder.DropTable(
                name: "EB_Label");
        }
    }
}
