using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class addedbyuserplayerkey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "SeriesButtonImages",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AddedById",
                table: "QuestionImages",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UserLinkedPlayerKeys",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    PlayerKey = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLinkedPlayerKeys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserLinkedPlayerKeys_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SeriesButtonImages_AddedById",
                table: "SeriesButtonImages",
                column: "AddedById");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionImages_AddedById",
                table: "QuestionImages",
                column: "AddedById");

            migrationBuilder.CreateIndex(
                name: "IX_UserLinkedPlayerKeys_UserId",
                table: "UserLinkedPlayerKeys",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionImages_User_AddedById",
                table: "QuestionImages",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SeriesButtonImages_User_AddedById",
                table: "SeriesButtonImages",
                column: "AddedById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionImages_User_AddedById",
                table: "QuestionImages");

            migrationBuilder.DropForeignKey(
                name: "FK_SeriesButtonImages_User_AddedById",
                table: "SeriesButtonImages");

            migrationBuilder.DropTable(
                name: "UserLinkedPlayerKeys");

            migrationBuilder.DropIndex(
                name: "IX_SeriesButtonImages_AddedById",
                table: "SeriesButtonImages");

            migrationBuilder.DropIndex(
                name: "IX_QuestionImages_AddedById",
                table: "QuestionImages");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "SeriesButtonImages");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "QuestionImages");
        }
    }
}
