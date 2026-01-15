using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class fbdquestion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FreebodyDiagramQuestion_QuestionText",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FreebodyDiagramQuestion_FBD",
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
                    Height = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FreebodyDiagramQuestion_FBD", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_FBD_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_FBD_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_FBD_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FreebodyDiagramQuestion_VectorTerm",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    BodyObjectId = table.Column<int>(nullable: false),
                    Code = table.Column<string>(nullable: true),
                    Latex = table.Column<string>(nullable: true),
                    LatexText = table.Column<string>(nullable: true),
                    KeyboardId = table.Column<int>(nullable: false),
                    Angle = table.Column<float>(nullable: false),
                    Clockwise = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FreebodyDiagramQuestion_VectorTerm", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_VectorTerm_FreebodyDiagramQuestion_~",
                        column: x => x.BodyObjectId,
                        principalTable: "FreebodyDiagramQuestion_FBD",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_VectorTerm_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_VectorTerm_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_VectorTerm_Keyboards_KeyboardId",
                        column: x => x.KeyboardId,
                        principalTable: "Keyboards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FreebodyDiagramQuestion_GeneralAnswer",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    VectorTermId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FreebodyDiagramQuestion_GeneralAnswer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_GeneralAnswer_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_GeneralAnswer_Information_Informati~",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_GeneralAnswer_FreebodyDiagramQuesti~",
                        column: x => x.VectorTermId,
                        principalTable: "FreebodyDiagramQuestion_VectorTerm",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FreebodyDiagramQuestion_GeneralAnswerElement",
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
                    table.PrimaryKey("PK_FreebodyDiagramQuestion_GeneralAnswerElement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_GeneralAnswerElement_FreebodyDiagra~",
                        column: x => x.AnswerId,
                        principalTable: "FreebodyDiagramQuestion_GeneralAnswer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_GeneralAnswerElement_DataPools_Data~",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_GeneralAnswerElement_KeyboardVariab~",
                        column: x => x.ImageId,
                        principalTable: "KeyboardVariableKeyImageRelation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_GeneralAnswerElement_Information_In~",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FreebodyDiagramQuestion_GeneralAnswerElement_KeyboardNumeri~",
                        column: x => x.NumericKeyId,
                        principalTable: "KeyboardNumericKeyRelation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_FBD_DataPoolId",
                table: "FreebodyDiagramQuestion_FBD",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_FBD_InformationId",
                table: "FreebodyDiagramQuestion_FBD",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_FBD_QuestionId",
                table: "FreebodyDiagramQuestion_FBD",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_GeneralAnswer_DataPoolId",
                table: "FreebodyDiagramQuestion_GeneralAnswer",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_GeneralAnswer_InformationId",
                table: "FreebodyDiagramQuestion_GeneralAnswer",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_GeneralAnswer_VectorTermId",
                table: "FreebodyDiagramQuestion_GeneralAnswer",
                column: "VectorTermId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_GeneralAnswerElement_AnswerId",
                table: "FreebodyDiagramQuestion_GeneralAnswerElement",
                column: "AnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_GeneralAnswerElement_DataPoolId",
                table: "FreebodyDiagramQuestion_GeneralAnswerElement",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_GeneralAnswerElement_ImageId",
                table: "FreebodyDiagramQuestion_GeneralAnswerElement",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_GeneralAnswerElement_InformationId",
                table: "FreebodyDiagramQuestion_GeneralAnswerElement",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_GeneralAnswerElement_NumericKeyId",
                table: "FreebodyDiagramQuestion_GeneralAnswerElement",
                column: "NumericKeyId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_VectorTerm_BodyObjectId",
                table: "FreebodyDiagramQuestion_VectorTerm",
                column: "BodyObjectId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_VectorTerm_DataPoolId",
                table: "FreebodyDiagramQuestion_VectorTerm",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_VectorTerm_InformationId",
                table: "FreebodyDiagramQuestion_VectorTerm",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_FreebodyDiagramQuestion_VectorTerm_KeyboardId",
                table: "FreebodyDiagramQuestion_VectorTerm",
                column: "KeyboardId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FreebodyDiagramQuestion_GeneralAnswerElement");

            migrationBuilder.DropTable(
                name: "FreebodyDiagramQuestion_GeneralAnswer");

            migrationBuilder.DropTable(
                name: "FreebodyDiagramQuestion_VectorTerm");

            migrationBuilder.DropTable(
                name: "FreebodyDiagramQuestion_FBD");

            migrationBuilder.DropColumn(
                name: "FreebodyDiagramQuestion_QuestionText",
                table: "QuestionBase");
        }
    }
}
