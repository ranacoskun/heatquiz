using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class linkelementtomap : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MapAttachmentId",
                table: "CourseMapElement",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "MapElementLink",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    ElementId = table.Column<int>(nullable: false),
                    MapId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapElementLink", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MapElementLink_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MapElementLink_CourseMapElement_ElementId",
                        column: x => x.ElementId,
                        principalTable: "CourseMapElement",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MapElementLink_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MapElementLink_CourseMap_MapId",
                        column: x => x.MapId,
                        principalTable: "CourseMap",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MapElementLink_DataPoolId",
                table: "MapElementLink",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_MapElementLink_ElementId",
                table: "MapElementLink",
                column: "ElementId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MapElementLink_InformationId",
                table: "MapElementLink",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_MapElementLink_MapId",
                table: "MapElementLink",
                column: "MapId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MapElementLink");

            migrationBuilder.DropColumn(
                name: "MapAttachmentId",
                table: "CourseMapElement");
        }
    }
}
