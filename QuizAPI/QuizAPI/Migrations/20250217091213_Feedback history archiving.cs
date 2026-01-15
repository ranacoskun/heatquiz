using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Feedbackhistoryarchiving : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "QuestionFeedback",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "FeedbackQuestionEvent",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    EventHolderId = table.Column<string>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    RecordsCount = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeedbackQuestionEvent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeedbackQuestionEvent_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FeedbackQuestionEvent_User_EventHolderId",
                        column: x => x.EventHolderId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FeedbackQuestionEvent_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FeedbackQuestionEvent_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackQuestionEvent_DataPoolId",
                table: "FeedbackQuestionEvent",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackQuestionEvent_EventHolderId",
                table: "FeedbackQuestionEvent",
                column: "EventHolderId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackQuestionEvent_InformationId",
                table: "FeedbackQuestionEvent",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackQuestionEvent_QuestionId",
                table: "FeedbackQuestionEvent",
                column: "QuestionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FeedbackQuestionEvent");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "QuestionFeedback");
        }
    }
}
