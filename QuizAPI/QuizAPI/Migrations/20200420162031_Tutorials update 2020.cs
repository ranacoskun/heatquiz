using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Tutorialsupdate2020 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PDFSize",
                table: "Tutorial");

            migrationBuilder.DropColumn(
                name: "PDFURL",
                table: "Tutorial");

            migrationBuilder.DropColumn(
                name: "VideoSize",
                table: "Tutorial");

            migrationBuilder.DropColumn(
                name: "VideoURL",
                table: "Tutorial");

            migrationBuilder.CreateTable(
                name: "TutorialPDF",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    TutorialId = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    PDFURL = table.Column<string>(nullable: true),
                    PDFSize = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorialPDF", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TutorialPDF_Tutorial_TutorialId",
                        column: x => x.TutorialId,
                        principalTable: "Tutorial",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TutorialVideo",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    TutorialId = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Discription = table.Column<string>(nullable: true),
                    VideoURL = table.Column<string>(nullable: true),
                    VideoSize = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorialVideo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TutorialVideo_Tutorial_TutorialId",
                        column: x => x.TutorialId,
                        principalTable: "Tutorial",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TutorialPDF_TutorialId",
                table: "TutorialPDF",
                column: "TutorialId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialVideo_TutorialId",
                table: "TutorialVideo",
                column: "TutorialId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TutorialPDF");

            migrationBuilder.DropTable(
                name: "TutorialVideo");

            migrationBuilder.AddColumn<long>(
                name: "PDFSize",
                table: "Tutorial",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "PDFURL",
                table: "Tutorial",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "VideoSize",
                table: "Tutorial",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "VideoURL",
                table: "Tutorial",
                nullable: true);
        }
    }
}
