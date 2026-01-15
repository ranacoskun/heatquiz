using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class diagramsquesiton : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiagramPointRelation");

            migrationBuilder.DropTable(
                name: "DiagramPoints");

            migrationBuilder.DropColumn(
                name: "AskForXAxisMinMax",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "AskForXAxisTitle",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "AskForXAxisUnit",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "AskForYAxisMinMax",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "AskForYAxisTitle",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "AskForYAxisUnit",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "X_Axis_Max",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "X_Axis_Min",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "X_Axis_Title",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "X_Axis_Unit",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "Y_Axis_Max",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "Y_Axis_Min",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "Y_Axis_Title",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "Y_Axis_Unit",
                table: "QuestionBase");

            migrationBuilder.CreateTable(
                name: "DiagramQuestionPlot",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true),
                    DiagramQuestionId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiagramQuestionPlot", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiagramQuestionPlot_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DiagramQuestionPlot_QuestionBase_DiagramQuestionId",
                        column: x => x.DiagramQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DiagramQuestionPlot_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DiagramQuestionSection",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    PlotId = table.Column<int>(nullable: false),
                    x = table.Column<float>(nullable: false),
                    y1 = table.Column<int>(nullable: false),
                    y2 = table.Column<int>(nullable: false),
                    c1x = table.Column<float>(nullable: false),
                    c1y = table.Column<int>(nullable: false),
                    c2x = table.Column<float>(nullable: false),
                    c2y = table.Column<int>(nullable: false),
                    IsStartPositionLabelSelected = table.Column<bool>(nullable: false),
                    marginY2Neg = table.Column<int>(nullable: false),
                    marginY2Pos = table.Column<int>(nullable: false),
                    IsEndPositionLabelSelected = table.Column<bool>(nullable: false),
                    marginY1Neg = table.Column<int>(nullable: false),
                    marginY1Pos = table.Column<int>(nullable: false),
                    IsPositionRelationLabelSelected = table.Column<bool>(nullable: false),
                    IsGradientStartLabelSelected = table.Column<bool>(nullable: false),
                    IsGradientEndLabelSelected = table.Column<bool>(nullable: false),
                    IsRatioOfGradientsLabelSelected = table.Column<bool>(nullable: false),
                    IsLinearLabelSelected = table.Column<bool>(nullable: false),
                    IsMaximumSelected = table.Column<bool>(nullable: false),
                    IsMinimumSelected = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiagramQuestionSection", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiagramQuestionSection_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DiagramQuestionSection_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DiagramQuestionSection_DiagramQuestionPlot_PlotId",
                        column: x => x.PlotId,
                        principalTable: "DiagramQuestionPlot",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DiagramQuestionSectionRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    InformationId = table.Column<int>(nullable: true),
                    DataPoolId = table.Column<int>(nullable: true),
                    FirstId = table.Column<int>(nullable: false),
                    OtherId = table.Column<int>(nullable: false),
                    RelationType = table.Column<int>(nullable: false),
                    RelationValue = table.Column<string>(nullable: true),
                    DiagramQuestionId = table.Column<int>(nullable: true),
                    DiagramQuestion_PlotId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiagramQuestionSectionRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiagramQuestionSectionRelation_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DiagramQuestionSectionRelation_QuestionBase_DiagramQuestion~",
                        column: x => x.DiagramQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DiagramQuestionSectionRelation_DiagramQuestionPlot_DiagramQ~",
                        column: x => x.DiagramQuestion_PlotId,
                        principalTable: "DiagramQuestionPlot",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DiagramQuestionSectionRelation_DiagramQuestionSection_First~",
                        column: x => x.FirstId,
                        principalTable: "DiagramQuestionSection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiagramQuestionSectionRelation_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DiagramQuestionSectionRelation_DiagramQuestionSection_Other~",
                        column: x => x.OtherId,
                        principalTable: "DiagramQuestionSection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionPlot_DataPoolId",
                table: "DiagramQuestionPlot",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionPlot_DiagramQuestionId",
                table: "DiagramQuestionPlot",
                column: "DiagramQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionPlot_InformationId",
                table: "DiagramQuestionPlot",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionSection_DataPoolId",
                table: "DiagramQuestionSection",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionSection_InformationId",
                table: "DiagramQuestionSection",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionSection_PlotId",
                table: "DiagramQuestionSection",
                column: "PlotId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionSectionRelation_DataPoolId",
                table: "DiagramQuestionSectionRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionSectionRelation_DiagramQuestionId",
                table: "DiagramQuestionSectionRelation",
                column: "DiagramQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionSectionRelation_DiagramQuestion_PlotId",
                table: "DiagramQuestionSectionRelation",
                column: "DiagramQuestion_PlotId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionSectionRelation_FirstId",
                table: "DiagramQuestionSectionRelation",
                column: "FirstId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionSectionRelation_InformationId",
                table: "DiagramQuestionSectionRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramQuestionSectionRelation_OtherId",
                table: "DiagramQuestionSectionRelation",
                column: "OtherId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiagramQuestionSectionRelation");

            migrationBuilder.DropTable(
                name: "DiagramQuestionSection");

            migrationBuilder.DropTable(
                name: "DiagramQuestionPlot");

            migrationBuilder.AddColumn<bool>(
                name: "AskForXAxisMinMax",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AskForXAxisTitle",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AskForXAxisUnit",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AskForYAxisMinMax",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AskForYAxisTitle",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AskForYAxisUnit",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "X_Axis_Max",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "X_Axis_Min",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "X_Axis_Title",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "X_Axis_Unit",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Y_Axis_Max",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Y_Axis_Min",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Y_Axis_Title",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Y_Axis_Unit",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DiagramPoints",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DataPoolId = table.Column<int>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    DiagramsQuestionId = table.Column<int>(nullable: false),
                    InformationId = table.Column<int>(nullable: true),
                    Title = table.Column<string>(nullable: true),
                    X = table.Column<int>(nullable: false),
                    Y = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiagramPoints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiagramPoints_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DiagramPoints_QuestionBase_DiagramsQuestionId",
                        column: x => x.DiagramsQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiagramPoints_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DiagramPointRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DataPoolId = table.Column<int>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    DiagramsQuestionId = table.Column<int>(nullable: false),
                    FirstDiagramPointId = table.Column<int>(nullable: false),
                    InformationId = table.Column<int>(nullable: true),
                    RELATIONSHIP_TYPE = table.Column<int>(nullable: false),
                    SecondDiagramPointId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiagramPointRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiagramPointRelation_DataPools_DataPoolId",
                        column: x => x.DataPoolId,
                        principalTable: "DataPools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DiagramPointRelation_QuestionBase_DiagramsQuestionId",
                        column: x => x.DiagramsQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiagramPointRelation_DiagramPoints_FirstDiagramPointId",
                        column: x => x.FirstDiagramPointId,
                        principalTable: "DiagramPoints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiagramPointRelation_Information_InformationId",
                        column: x => x.InformationId,
                        principalTable: "Information",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DiagramPointRelation_DiagramPoints_SecondDiagramPointId",
                        column: x => x.SecondDiagramPointId,
                        principalTable: "DiagramPoints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPointRelation_DataPoolId",
                table: "DiagramPointRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPointRelation_DiagramsQuestionId",
                table: "DiagramPointRelation",
                column: "DiagramsQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPointRelation_FirstDiagramPointId",
                table: "DiagramPointRelation",
                column: "FirstDiagramPointId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPointRelation_InformationId",
                table: "DiagramPointRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPointRelation_SecondDiagramPointId",
                table: "DiagramPointRelation",
                column: "SecondDiagramPointId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPoints_DataPoolId",
                table: "DiagramPoints",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPoints_DiagramsQuestionId",
                table: "DiagramPoints",
                column: "DiagramsQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPoints_InformationId",
                table: "DiagramPoints",
                column: "InformationId");
        }
    }
}
