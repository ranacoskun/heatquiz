using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Ownership3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KeyboardOwner",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    KeyboardId = table.Column<int>(nullable: false),
                    OwnerId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeyboardOwner", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KeyboardOwner_Keyboards_KeyboardId",
                        column: x => x.KeyboardId,
                        principalTable: "Keyboards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KeyboardOwner_User_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "NumericKeyOwner",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    KeyId = table.Column<int>(nullable: false),
                    OwnerId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NumericKeyOwner", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NumericKeyOwner_NumericKeys_KeyId",
                        column: x => x.KeyId,
                        principalTable: "NumericKeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NumericKeyOwner_User_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VariableKeyOwner",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    KeyId = table.Column<int>(nullable: false),
                    OwnerId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariableKeyOwner", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VariableKeyOwner_VariableKeys_KeyId",
                        column: x => x.KeyId,
                        principalTable: "VariableKeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VariableKeyOwner_User_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardOwner_KeyboardId",
                table: "KeyboardOwner",
                column: "KeyboardId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardOwner_OwnerId",
                table: "KeyboardOwner",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_NumericKeyOwner_KeyId",
                table: "NumericKeyOwner",
                column: "KeyId");

            migrationBuilder.CreateIndex(
                name: "IX_NumericKeyOwner_OwnerId",
                table: "NumericKeyOwner",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyOwner_KeyId",
                table: "VariableKeyOwner",
                column: "KeyId");

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyOwner_OwnerId",
                table: "VariableKeyOwner",
                column: "OwnerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KeyboardOwner");

            migrationBuilder.DropTable(
                name: "NumericKeyOwner");

            migrationBuilder.DropTable(
                name: "VariableKeyOwner");
        }
    }
}
