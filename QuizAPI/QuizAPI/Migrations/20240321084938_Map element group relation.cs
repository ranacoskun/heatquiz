using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Mapelementgrouprelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CourseMapRequiredElementRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    BaseElementId = table.Column<int>(nullable: false),
                    RequiredElementId1 = table.Column<int>(nullable: true),
                    RequiredElementId = table.Column<int>(nullable: false),
                    Threshold = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseMapRequiredElementRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseMapRequiredElementRelation_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourseMapRequiredElementRelation_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourseMapRequiredElementRelation_CourseMapElement_RequiredE~",
                        column: x => x.RequiredElementId,
                        principalTable: "CourseMapElement",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseMapRequiredElementRelation_CourseMapElement_Required~1",
                        column: x => x.RequiredElementId1,
                        principalTable: "CourseMapElement",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapRequiredElementRelation_DataPoolId",
                table: "CourseMapRequiredElementRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapRequiredElementRelation_InformationId",
                table: "CourseMapRequiredElementRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapRequiredElementRelation_RequiredElementId",
                table: "CourseMapRequiredElementRelation",
                column: "RequiredElementId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapRequiredElementRelation_RequiredElementId1",
                table: "CourseMapRequiredElementRelation",
                column: "RequiredElementId1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseMapRequiredElementRelation");
        }
    }
}
