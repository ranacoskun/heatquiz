using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Qcommenttsdpuseraccess : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DataPoolAccesses",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: false),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataPoolAccesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DataPoolAccesses_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DataPoolAccesses_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuestionComments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    CommentSectionId = table.Column<int>(nullable: false),
                    Text = table.Column<string>(nullable: true),
                    IsLatex = table.Column<bool>(nullable: false),
                    AddedById = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionComments_User_AddedById",
                        column: x => x.AddedById,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionComments_QuestionCommentSection_CommentSectionId",
                        column: x => x.CommentSectionId,
                        principalTable: "QuestionCommentSection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionComments_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionComments_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuestionCommentSectionTags",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    SectionId = table.Column<int>(nullable: false),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionCommentSectionTags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionCommentSectionTags_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionCommentSectionTags_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionCommentSectionTags_QuestionCommentSection_SectionId",
                        column: x => x.SectionId,
                        principalTable: "QuestionCommentSection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionCommentSectionTags_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuestionCommentTags",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    CommentId = table.Column<int>(nullable: false),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionCommentTags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionCommentTags_QuestionComments_CommentId",
                        column: x => x.CommentId,
                        principalTable: "QuestionComments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionCommentTags_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionCommentTags_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionCommentTags_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DataPoolAccesses_DataPoolId",
                table: "DataPoolAccesses",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_DataPoolAccesses_UserId",
                table: "DataPoolAccesses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionComments_AddedById",
                table: "QuestionComments",
                column: "AddedById");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionComments_CommentSectionId",
                table: "QuestionComments",
                column: "CommentSectionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionComments_DataPoolId",
                table: "QuestionComments",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionComments_InformationId",
                table: "QuestionComments",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCommentSectionTags_DataPoolId",
                table: "QuestionCommentSectionTags",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCommentSectionTags_InformationId",
                table: "QuestionCommentSectionTags",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCommentSectionTags_SectionId",
                table: "QuestionCommentSectionTags",
                column: "SectionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCommentSectionTags_UserId",
                table: "QuestionCommentSectionTags",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCommentTags_CommentId",
                table: "QuestionCommentTags",
                column: "CommentId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCommentTags_DataPoolId",
                table: "QuestionCommentTags",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCommentTags_InformationId",
                table: "QuestionCommentTags",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCommentTags_UserId",
                table: "QuestionCommentTags",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DataPoolAccesses");

            migrationBuilder.DropTable(
                name: "QuestionCommentSectionTags");

            migrationBuilder.DropTable(
                name: "QuestionCommentTags");

            migrationBuilder.DropTable(
                name: "QuestionComments");
        }
    }
}
