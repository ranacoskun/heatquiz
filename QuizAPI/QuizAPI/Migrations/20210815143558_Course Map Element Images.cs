using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class CourseMapElementImages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CourseMapElementImagesId",
                table: "CourseMapElement",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CourseMapElementImages",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    Play = table.Column<string>(nullable: true),
                    PDF = table.Column<string>(nullable: true),
                    Video = table.Column<string>(nullable: true),
                    Link = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseMapElementImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseMapElementImages_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElement_CourseMapElementImagesId",
                table: "CourseMapElement",
                column: "CourseMapElementImagesId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElementImages_InformationId",
                table: "CourseMapElementImages",
                column: "InformationId");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapElement_CourseMapElementImages_CourseMapElementIma~",
                table: "CourseMapElement",
                column: "CourseMapElementImagesId",
                principalTable: "CourseMapElementImages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapElement_CourseMapElementImages_CourseMapElementIma~",
                table: "CourseMapElement");

            migrationBuilder.DropTable(
                name: "CourseMapElementImages");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapElement_CourseMapElementImagesId",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "CourseMapElementImagesId",
                table: "CourseMapElement");
        }
    }
}
