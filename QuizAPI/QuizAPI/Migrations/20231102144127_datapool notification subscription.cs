using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class datapoolnotificationsubscription : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DatapoolNotificationSubscriptions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    DatapoolId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatapoolNotificationSubscriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DatapoolNotificationSubscriptions_DataPools_DatapoolId",
                        column: x => x.DatapoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DatapoolNotificationSubscriptions_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DatapoolNotificationSubscriptions_DatapoolId",
                table: "DatapoolNotificationSubscriptions",
                column: "DatapoolId");

            migrationBuilder.CreateIndex(
                name: "IX_DatapoolNotificationSubscriptions_UserId",
                table: "DatapoolNotificationSubscriptions",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DatapoolNotificationSubscriptions");
        }
    }
}
