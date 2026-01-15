using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class qimagesseriesclickimages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ButtonImagesId",
                table: "QuestionSeries",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "QuestionImages",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    ImageURL = table.Column<string>(nullable: true),
                    size = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionImages_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionImages_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SeriesButtonImages",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    ExitImageURL = table.Column<string>(nullable: true),
                    ClearImageURL = table.Column<string>(nullable: true),
                    SubmitImageURL = table.Column<string>(nullable: true),
                    ContinueImageURL = table.Column<string>(nullable: true),
                    PDFImageURL = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeriesButtonImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SeriesButtonImages_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SeriesButtonImages_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeries_ButtonImagesId",
                table: "QuestionSeries",
                column: "ButtonImagesId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionImages_DataPoolId",
                table: "QuestionImages",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionImages_InformationId",
                table: "QuestionImages",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_SeriesButtonImages_DataPoolId",
                table: "SeriesButtonImages",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_SeriesButtonImages_InformationId",
                table: "SeriesButtonImages",
                column: "InformationId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionSeries_SeriesButtonImages_ButtonImagesId",
                table: "QuestionSeries",
                column: "ButtonImagesId",
                principalTable: "SeriesButtonImages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionSeries_SeriesButtonImages_ButtonImagesId",
                table: "QuestionSeries");

            migrationBuilder.DropTable(
                name: "QuestionImages");

            migrationBuilder.DropTable(
                name: "SeriesButtonImages");

            migrationBuilder.DropIndex(
                name: "IX_QuestionSeries_ButtonImagesId",
                table: "QuestionSeries");

            migrationBuilder.DropColumn(
                name: "ButtonImagesId",
                table: "QuestionSeries");
        }
    }
}
