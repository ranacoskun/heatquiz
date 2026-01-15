using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class CourseMapUpdates10122020 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RequiredElementId",
                table: "CourseMapElement",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Threshold",
                table: "CourseMapElement",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "CourseMapElementBadge",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Progress = table.Column<int>(nullable: false),
                    URL = table.Column<string>(nullable: true),
                    CourseMapElementId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseMapElementBadge", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseMapElementBadge_CourseMapElement_CourseMapElementId",
                        column: x => x.CourseMapElementId,
                        principalTable: "CourseMapElement",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElement_RequiredElementId",
                table: "CourseMapElement",
                column: "RequiredElementId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElementBadge_CourseMapElementId",
                table: "CourseMapElementBadge",
                column: "CourseMapElementId");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapElement_CourseMapElement_RequiredElementId",
                table: "CourseMapElement",
                column: "RequiredElementId",
                principalTable: "CourseMapElement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapElement_CourseMapElement_RequiredElementId",
                table: "CourseMapElement");

            migrationBuilder.DropTable(
                name: "CourseMapElementBadge");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapElement_RequiredElementId",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "RequiredElementId",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "Threshold",
                table: "CourseMapElement");
        }
    }
}
