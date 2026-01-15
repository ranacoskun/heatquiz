using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Ownership : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroup_VariableKeyVariable~",
                table: "VariableKeyVariableCharValidValuesGroup");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroup_VariableKeyVariable~",
                table: "VariableKeyVariableCharValidValuesGroup");

            migrationBuilder.DropColumn(
                name: "VariableKeyVariableCharId",
                table: "VariableKeyVariableCharValidValuesGroup");

            migrationBuilder.AddColumn<int>(
                name: "CharId",
                table: "VariableKeyVariableCharValidValuesGroup",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ClickTreeOwner",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    OwnerId = table.Column<string>(nullable: true),
                    ImageGroupId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClickTreeOwner", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClickTreeOwner_ImageAnswerGroups_ImageGroupId",
                        column: x => x.ImageGroupId,
                        principalTable: "ImageAnswerGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClickTreeOwner_User_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroup_CharId",
                table: "VariableKeyVariableCharValidValuesGroup",
                column: "CharId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickTreeOwner_ImageGroupId",
                table: "ClickTreeOwner",
                column: "ImageGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickTreeOwner_OwnerId",
                table: "ClickTreeOwner",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroup_VariableKeyVariable~",
                table: "VariableKeyVariableCharValidValuesGroup",
                column: "CharId",
                principalTable: "VariableKeyVariableChar",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroup_VariableKeyVariable~",
                table: "VariableKeyVariableCharValidValuesGroup");

            migrationBuilder.DropTable(
                name: "ClickTreeOwner");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroup_CharId",
                table: "VariableKeyVariableCharValidValuesGroup");

            migrationBuilder.DropColumn(
                name: "CharId",
                table: "VariableKeyVariableCharValidValuesGroup");

            migrationBuilder.AddColumn<int>(
                name: "VariableKeyVariableCharId",
                table: "VariableKeyVariableCharValidValuesGroup",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroup_VariableKeyVariable~",
                table: "VariableKeyVariableCharValidValuesGroup",
                column: "VariableKeyVariableCharId");

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroup_VariableKeyVariable~",
                table: "VariableKeyVariableCharValidValuesGroup",
                column: "VariableKeyVariableCharId",
                principalTable: "VariableKeyVariableChar",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
