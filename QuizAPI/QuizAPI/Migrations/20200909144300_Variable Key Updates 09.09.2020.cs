using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class VariableKeyUpdates09092020 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroupChoiceImage_Variable~",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage");

            migrationBuilder.DropTable(
                name: "VariableKeyVariableCharValidValues");

            migrationBuilder.DropTable(
                name: "VariableKeyVariableCharValidValuesGroup");

            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                newName: "KeyId");

            migrationBuilder.RenameIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroupChoiceImage_GroupId",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                newName: "IX_VariableKeyVariableCharValidValuesGroupChoiceImage_KeyId");

            migrationBuilder.CreateTable(
                name: "KeyboardVariableKeyImageRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    ImageId = table.Column<int>(nullable: false),
                    KeyboardId = table.Column<int>(nullable: false),
                    ReplacementCharacter = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeyboardVariableKeyImageRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KeyboardVariableKeyImageRelation_VariableKeyVariableCharVal~",
                        column: x => x.ImageId,
                        principalTable: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KeyboardVariableKeyImageRelation_Keyboards_KeyboardId",
                        column: x => x.KeyboardId,
                        principalTable: "Keyboards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardVariableKeyImageRelation_ImageId",
                table: "KeyboardVariableKeyImageRelation",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardVariableKeyImageRelation_KeyboardId",
                table: "KeyboardVariableKeyImageRelation",
                column: "KeyboardId");

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroupChoiceImage_Variable~",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                column: "KeyId",
                principalTable: "VariableKeys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroupChoiceImage_Variable~",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage");

            migrationBuilder.DropTable(
                name: "KeyboardVariableKeyImageRelation");

            migrationBuilder.RenameColumn(
                name: "KeyId",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                newName: "GroupId");

            migrationBuilder.RenameIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroupChoiceImage_KeyId",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                newName: "IX_VariableKeyVariableCharValidValuesGroupChoiceImage_GroupId");

            migrationBuilder.CreateTable(
                name: "VariableKeyVariableCharValidValuesGroup",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Code = table.Column<string>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    KeyboardVariableKeyId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariableKeyVariableCharValidValuesGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VariableKeyVariableCharValidValuesGroup_VariableKeys_Keyboa~",
                        column: x => x.KeyboardVariableKeyId,
                        principalTable: "VariableKeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VariableKeyVariableCharValidValues",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    GroupId = table.Column<int>(nullable: false),
                    IsLatex = table.Column<bool>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariableKeyVariableCharValidValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VariableKeyVariableCharValidValues_VariableKeyVariableCharV~",
                        column: x => x.GroupId,
                        principalTable: "VariableKeyVariableCharValidValuesGroup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValues_GroupId",
                table: "VariableKeyVariableCharValidValues",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroup_KeyboardVariableKey~",
                table: "VariableKeyVariableCharValidValuesGroup",
                column: "KeyboardVariableKeyId");

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroupChoiceImage_Variable~",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                column: "GroupId",
                principalTable: "VariableKeyVariableCharValidValuesGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
