using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class KeysList : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KeysListId",
                table: "VariableKeys",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "KeysListId",
                table: "NumericKeys",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "KeysLists",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    IsDefault = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeysLists", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeys_KeysListId",
                table: "VariableKeys",
                column: "KeysListId");

            migrationBuilder.CreateIndex(
                name: "IX_NumericKeys_KeysListId",
                table: "NumericKeys",
                column: "KeysListId");

            migrationBuilder.AddForeignKey(
                name: "FK_NumericKeys_KeysLists_KeysListId",
                table: "NumericKeys",
                column: "KeysListId",
                principalTable: "KeysLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeys_KeysLists_KeysListId",
                table: "VariableKeys",
                column: "KeysListId",
                principalTable: "KeysLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NumericKeys_KeysLists_KeysListId",
                table: "NumericKeys");

            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeys_KeysLists_KeysListId",
                table: "VariableKeys");

            migrationBuilder.DropTable(
                name: "KeysLists");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeys_KeysListId",
                table: "VariableKeys");

            migrationBuilder.DropIndex(
                name: "IX_NumericKeys_KeysListId",
                table: "NumericKeys");

            migrationBuilder.DropColumn(
                name: "KeysListId",
                table: "VariableKeys");

            migrationBuilder.DropColumn(
                name: "KeysListId",
                table: "NumericKeys");
        }
    }
}
