using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class mapbonuspointregime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CourseBonusPointRegime",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    CourseId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseBonusPointRegime", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseBonusPointRegime_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseBonusPointRegime_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourseBonusPointRegime_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CourseBonusPointRegimeRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    RegimeId = table.Column<int>(nullable: false),
                    MapId = table.Column<int>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    Percentage = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseBonusPointRegimeRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseBonusPointRegimeRelation_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourseBonusPointRegimeRelation_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourseBonusPointRegimeRelation_CourseMap_MapId",
                        column: x => x.MapId,
                        principalTable: "CourseMap",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseBonusPointRegimeRelation_CourseBonusPointRegime_Regim~",
                        column: x => x.RegimeId,
                        principalTable: "CourseBonusPointRegime",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseBonusPointRegime_CourseId",
                table: "CourseBonusPointRegime",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseBonusPointRegime_DataPoolId",
                table: "CourseBonusPointRegime",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseBonusPointRegime_InformationId",
                table: "CourseBonusPointRegime",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseBonusPointRegimeRelation_DataPoolId",
                table: "CourseBonusPointRegimeRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseBonusPointRegimeRelation_InformationId",
                table: "CourseBonusPointRegimeRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseBonusPointRegimeRelation_MapId",
                table: "CourseBonusPointRegimeRelation",
                column: "MapId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseBonusPointRegimeRelation_RegimeId",
                table: "CourseBonusPointRegimeRelation",
                column: "RegimeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseBonusPointRegimeRelation");

            migrationBuilder.DropTable(
                name: "CourseBonusPointRegime");
        }
    }
}
