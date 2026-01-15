using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class Information : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "VariableKeyVariableChar",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "VariableKeys",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "VariableKeyOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "TutorialVideo",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "TutorialTag",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "TutorialStep",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "TutorialsGroup",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "TutorialPDF",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "Tutorial",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "Topics",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "TopicOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "Subtopics",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "RightGradientValues",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "RationOfGradientsValues",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionTemplateBases",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionSubgroups",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionStatistic",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionSeriesOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionSeriesElement",
                nullable: true);

            /*migrationBuilder.AddColumn<int>(
                name: "QuestionId",
                table: "QuestionSeriesElement",
                nullable: true);*/

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionSeries",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionGroups",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionChallengeTemplates",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionChallengeSingleResult",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionChallengeQuestion",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "QuestionAttribure",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "NumericKeys",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "NumericKeyOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "MultipleChoiceQuestionChoice",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "LevelsOfDifficulty",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "LeftGradientValues",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "KeysLists",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "KeyboardVariableKeyRelation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "KeyboardVariableKeyImageRelation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "Keyboards",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "KeyboardQuestionSubgroupRelation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "KeyboardQuestionAnswerElement",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "KeyboardQuestionAnswer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "KeyboardOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "KeyboardNumericKeyRelation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "JumpValues",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "InterpretedTreeOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "InterpretedImages",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "InterpretedImageGroups",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "ImageAnswers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "ImageAnswerGroups",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "DiagramPoints",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "DiagramPointRelation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "Courses",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "CourseOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "CourseMapKeys",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "CourseMapElementBadge",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "CourseMapElement",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "CourseMapBadgeSystemEntity",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "CourseMapBadgeSystem",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "CourseMap",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "ClickTreeOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "ClickImage",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "ClickEquation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "ClickChart",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "ClickableQuestionSubgroupRelation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "ChallengeSessions",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "ChallengePlayer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InformationId",
                table: "ApplicationUsers",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Information",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    Latex = table.Column<string>(nullable: true),
                    PDFURL = table.Column<string>(nullable: true),
                    PDFSize = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Information", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroupChoiceImage_Informat~",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableChar_InformationId",
                table: "VariableKeyVariableChar",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeys_InformationId",
                table: "VariableKeys",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyOwner_InformationId",
                table: "VariableKeyOwner",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialVideo_InformationId",
                table: "TutorialVideo",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialTag_InformationId",
                table: "TutorialTag",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialStep_InformationId",
                table: "TutorialStep",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialsGroup_InformationId",
                table: "TutorialsGroup",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialPDF_InformationId",
                table: "TutorialPDF",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_Tutorial_InformationId",
                table: "Tutorial",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_Topics_InformationId",
                table: "Topics",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_TopicOwner_InformationId",
                table: "TopicOwner",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_Subtopics_InformationId",
                table: "Subtopics",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_RightGradientValues_InformationId",
                table: "RightGradientValues",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_RationOfGradientsValues_InformationId",
                table: "RationOfGradientsValues",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionTemplateBases_InformationId",
                table: "QuestionTemplateBases",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSubgroups_InformationId",
                table: "QuestionSubgroups",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionStatistic_InformationId",
                table: "QuestionStatistic",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesOwner_InformationId",
                table: "QuestionSeriesOwner",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesElement_InformationId",
                table: "QuestionSeriesElement",
                column: "InformationId");

            /*migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesElement_QuestionId",
                table: "QuestionSeriesElement",
                column: "QuestionId");*/

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeries_InformationId",
                table: "QuestionSeries",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionOwner_InformationId",
                table: "QuestionOwner",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionGroups_InformationId",
                table: "QuestionGroups",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionChallengeTemplates_InformationId",
                table: "QuestionChallengeTemplates",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionChallengeSingleResult_InformationId",
                table: "QuestionChallengeSingleResult",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionChallengeQuestion_InformationId",
                table: "QuestionChallengeQuestion",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBase_InformationId",
                table: "QuestionBase",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionAttribure_InformationId",
                table: "QuestionAttribure",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_NumericKeys_InformationId",
                table: "NumericKeys",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_NumericKeyOwner_InformationId",
                table: "NumericKeyOwner",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_MultipleChoiceQuestionChoice_InformationId",
                table: "MultipleChoiceQuestionChoice",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_LevelsOfDifficulty_InformationId",
                table: "LevelsOfDifficulty",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_LeftGradientValues_InformationId",
                table: "LeftGradientValues",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_KeysLists_InformationId",
                table: "KeysLists",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardVariableKeyRelation_InformationId",
                table: "KeyboardVariableKeyRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardVariableKeyImageRelation_InformationId",
                table: "KeyboardVariableKeyImageRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_Keyboards_InformationId",
                table: "Keyboards",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionSubgroupRelation_InformationId",
                table: "KeyboardQuestionSubgroupRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswerElement_InformationId",
                table: "KeyboardQuestionAnswerElement",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswer_InformationId",
                table: "KeyboardQuestionAnswer",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardOwner_InformationId",
                table: "KeyboardOwner",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardNumericKeyRelation_InformationId",
                table: "KeyboardNumericKeyRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_JumpValues_InformationId",
                table: "JumpValues",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_InterpretedTreeOwner_InformationId",
                table: "InterpretedTreeOwner",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_InterpretedImages_InformationId",
                table: "InterpretedImages",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_InterpretedImageGroups_InformationId",
                table: "InterpretedImageGroups",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_ImageAnswers_InformationId",
                table: "ImageAnswers",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_ImageAnswerGroups_InformationId",
                table: "ImageAnswerGroups",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPoints_InformationId",
                table: "DiagramPoints",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPointRelation_InformationId",
                table: "DiagramPointRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_InformationId",
                table: "Courses",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseOwner_InformationId",
                table: "CourseOwner",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapKeys_InformationId",
                table: "CourseMapKeys",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElementBadge_InformationId",
                table: "CourseMapElementBadge",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElement_InformationId",
                table: "CourseMapElement",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapBadgeSystemEntity_InformationId",
                table: "CourseMapBadgeSystemEntity",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapBadgeSystem_InformationId",
                table: "CourseMapBadgeSystem",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMap_InformationId",
                table: "CourseMap",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickTreeOwner_InformationId",
                table: "ClickTreeOwner",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickImage_InformationId",
                table: "ClickImage",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickEquation_InformationId",
                table: "ClickEquation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickChart_InformationId",
                table: "ClickChart",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickableQuestionSubgroupRelation_InformationId",
                table: "ClickableQuestionSubgroupRelation",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_ChallengeSessions_InformationId",
                table: "ChallengeSessions",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_ChallengePlayer_InformationId",
                table: "ChallengePlayer",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUsers_InformationId",
                table: "ApplicationUsers",
                column: "InformationId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUsers_Information_InformationId",
                table: "ApplicationUsers",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChallengePlayer_Information_InformationId",
                table: "ChallengePlayer",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChallengeSessions_Information_InformationId",
                table: "ChallengeSessions",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClickableQuestionSubgroupRelation_Information_InformationId",
                table: "ClickableQuestionSubgroupRelation",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClickChart_Information_InformationId",
                table: "ClickChart",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClickEquation_Information_InformationId",
                table: "ClickEquation",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClickImage_Information_InformationId",
                table: "ClickImage",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClickTreeOwner_Information_InformationId",
                table: "ClickTreeOwner",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMap_Information_InformationId",
                table: "CourseMap",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapBadgeSystem_Information_InformationId",
                table: "CourseMapBadgeSystem",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapBadgeSystemEntity_Information_InformationId",
                table: "CourseMapBadgeSystemEntity",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapElement_Information_InformationId",
                table: "CourseMapElement",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapElementBadge_Information_InformationId",
                table: "CourseMapElementBadge",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapKeys_Information_InformationId",
                table: "CourseMapKeys",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseOwner_Information_InformationId",
                table: "CourseOwner",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Information_InformationId",
                table: "Courses",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DiagramPointRelation_Information_InformationId",
                table: "DiagramPointRelation",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DiagramPoints_Information_InformationId",
                table: "DiagramPoints",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ImageAnswerGroups_Information_InformationId",
                table: "ImageAnswerGroups",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ImageAnswers_Information_InformationId",
                table: "ImageAnswers",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_InterpretedImageGroups_Information_InformationId",
                table: "InterpretedImageGroups",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_InterpretedImages_Information_InformationId",
                table: "InterpretedImages",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_InterpretedTreeOwner_Information_InformationId",
                table: "InterpretedTreeOwner",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_JumpValues_Information_InformationId",
                table: "JumpValues",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardNumericKeyRelation_Information_InformationId",
                table: "KeyboardNumericKeyRelation",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardOwner_Information_InformationId",
                table: "KeyboardOwner",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionAnswer_Information_InformationId",
                table: "KeyboardQuestionAnswer",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_Information_InformationId",
                table: "KeyboardQuestionAnswerElement",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionSubgroupRelation_Information_InformationId",
                table: "KeyboardQuestionSubgroupRelation",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Keyboards_Information_InformationId",
                table: "Keyboards",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardVariableKeyImageRelation_Information_InformationId",
                table: "KeyboardVariableKeyImageRelation",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardVariableKeyRelation_Information_InformationId",
                table: "KeyboardVariableKeyRelation",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeysLists_Information_InformationId",
                table: "KeysLists",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LeftGradientValues_Information_InformationId",
                table: "LeftGradientValues",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LevelsOfDifficulty_Information_InformationId",
                table: "LevelsOfDifficulty",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MultipleChoiceQuestionChoice_Information_InformationId",
                table: "MultipleChoiceQuestionChoice",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_NumericKeyOwner_Information_InformationId",
                table: "NumericKeyOwner",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_NumericKeys_Information_InformationId",
                table: "NumericKeys",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionAttribure_Information_InformationId",
                table: "QuestionAttribure",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionBase_Information_InformationId",
                table: "QuestionBase",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionChallengeQuestion_Information_InformationId",
                table: "QuestionChallengeQuestion",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionChallengeSingleResult_Information_InformationId",
                table: "QuestionChallengeSingleResult",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionChallengeTemplates_Information_InformationId",
                table: "QuestionChallengeTemplates",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionGroups_Information_InformationId",
                table: "QuestionGroups",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionOwner_Information_InformationId",
                table: "QuestionOwner",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionSeries_Information_InformationId",
                table: "QuestionSeries",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionSeriesElement_Information_InformationId",
                table: "QuestionSeriesElement",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            /*migrationBuilder.AddForeignKey(
                name: "FK_QuestionSeriesElement_QuestionBase_QuestionId",
                table: "QuestionSeriesElement",
                column: "QuestionId",
                principalTable: "QuestionBase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);*/

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionSeriesOwner_Information_InformationId",
                table: "QuestionSeriesOwner",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionStatistic_Information_InformationId",
                table: "QuestionStatistic",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionSubgroups_Information_InformationId",
                table: "QuestionSubgroups",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionTemplateBases_Information_InformationId",
                table: "QuestionTemplateBases",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RationOfGradientsValues_Information_InformationId",
                table: "RationOfGradientsValues",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RightGradientValues_Information_InformationId",
                table: "RightGradientValues",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Subtopics_Information_InformationId",
                table: "Subtopics",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TopicOwner_Information_InformationId",
                table: "TopicOwner",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Topics_Information_InformationId",
                table: "Topics",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tutorial_Information_InformationId",
                table: "Tutorial",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TutorialPDF_Information_InformationId",
                table: "TutorialPDF",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TutorialsGroup_Information_InformationId",
                table: "TutorialsGroup",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TutorialStep_Information_InformationId",
                table: "TutorialStep",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TutorialTag_Information_InformationId",
                table: "TutorialTag",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TutorialVideo_Information_InformationId",
                table: "TutorialVideo",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyOwner_Information_InformationId",
                table: "VariableKeyOwner",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeys_Information_InformationId",
                table: "VariableKeys",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableChar_Information_InformationId",
                table: "VariableKeyVariableChar",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroupChoiceImage_Informat~",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                column: "InformationId",
                principalTable: "Information",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUsers_Information_InformationId",
                table: "ApplicationUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_ChallengePlayer_Information_InformationId",
                table: "ChallengePlayer");

            migrationBuilder.DropForeignKey(
                name: "FK_ChallengeSessions_Information_InformationId",
                table: "ChallengeSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_ClickableQuestionSubgroupRelation_Information_InformationId",
                table: "ClickableQuestionSubgroupRelation");

            migrationBuilder.DropForeignKey(
                name: "FK_ClickChart_Information_InformationId",
                table: "ClickChart");

            migrationBuilder.DropForeignKey(
                name: "FK_ClickEquation_Information_InformationId",
                table: "ClickEquation");

            migrationBuilder.DropForeignKey(
                name: "FK_ClickImage_Information_InformationId",
                table: "ClickImage");

            migrationBuilder.DropForeignKey(
                name: "FK_ClickTreeOwner_Information_InformationId",
                table: "ClickTreeOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMap_Information_InformationId",
                table: "CourseMap");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapBadgeSystem_Information_InformationId",
                table: "CourseMapBadgeSystem");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapBadgeSystemEntity_Information_InformationId",
                table: "CourseMapBadgeSystemEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapElement_Information_InformationId",
                table: "CourseMapElement");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapElementBadge_Information_InformationId",
                table: "CourseMapElementBadge");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapKeys_Information_InformationId",
                table: "CourseMapKeys");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseOwner_Information_InformationId",
                table: "CourseOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Information_InformationId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_DiagramPointRelation_Information_InformationId",
                table: "DiagramPointRelation");

            migrationBuilder.DropForeignKey(
                name: "FK_DiagramPoints_Information_InformationId",
                table: "DiagramPoints");

            migrationBuilder.DropForeignKey(
                name: "FK_ImageAnswerGroups_Information_InformationId",
                table: "ImageAnswerGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_ImageAnswers_Information_InformationId",
                table: "ImageAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_InterpretedImageGroups_Information_InformationId",
                table: "InterpretedImageGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_InterpretedImages_Information_InformationId",
                table: "InterpretedImages");

            migrationBuilder.DropForeignKey(
                name: "FK_InterpretedTreeOwner_Information_InformationId",
                table: "InterpretedTreeOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_JumpValues_Information_InformationId",
                table: "JumpValues");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardNumericKeyRelation_Information_InformationId",
                table: "KeyboardNumericKeyRelation");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardOwner_Information_InformationId",
                table: "KeyboardOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionAnswer_Information_InformationId",
                table: "KeyboardQuestionAnswer");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_Information_InformationId",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionSubgroupRelation_Information_InformationId",
                table: "KeyboardQuestionSubgroupRelation");

            migrationBuilder.DropForeignKey(
                name: "FK_Keyboards_Information_InformationId",
                table: "Keyboards");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardVariableKeyImageRelation_Information_InformationId",
                table: "KeyboardVariableKeyImageRelation");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardVariableKeyRelation_Information_InformationId",
                table: "KeyboardVariableKeyRelation");

            migrationBuilder.DropForeignKey(
                name: "FK_KeysLists_Information_InformationId",
                table: "KeysLists");

            migrationBuilder.DropForeignKey(
                name: "FK_LeftGradientValues_Information_InformationId",
                table: "LeftGradientValues");

            migrationBuilder.DropForeignKey(
                name: "FK_LevelsOfDifficulty_Information_InformationId",
                table: "LevelsOfDifficulty");

            migrationBuilder.DropForeignKey(
                name: "FK_MultipleChoiceQuestionChoice_Information_InformationId",
                table: "MultipleChoiceQuestionChoice");

            migrationBuilder.DropForeignKey(
                name: "FK_NumericKeyOwner_Information_InformationId",
                table: "NumericKeyOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_NumericKeys_Information_InformationId",
                table: "NumericKeys");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionAttribure_Information_InformationId",
                table: "QuestionAttribure");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionBase_Information_InformationId",
                table: "QuestionBase");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionChallengeQuestion_Information_InformationId",
                table: "QuestionChallengeQuestion");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionChallengeSingleResult_Information_InformationId",
                table: "QuestionChallengeSingleResult");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionChallengeTemplates_Information_InformationId",
                table: "QuestionChallengeTemplates");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionGroups_Information_InformationId",
                table: "QuestionGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionOwner_Information_InformationId",
                table: "QuestionOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionSeries_Information_InformationId",
                table: "QuestionSeries");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionSeriesElement_Information_InformationId",
                table: "QuestionSeriesElement");

            /*migrationBuilder.DropForeignKey(
                name: "FK_QuestionSeriesElement_QuestionBase_QuestionId",
                table: "QuestionSeriesElement");*/

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionSeriesOwner_Information_InformationId",
                table: "QuestionSeriesOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionStatistic_Information_InformationId",
                table: "QuestionStatistic");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionSubgroups_Information_InformationId",
                table: "QuestionSubgroups");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionTemplateBases_Information_InformationId",
                table: "QuestionTemplateBases");

            migrationBuilder.DropForeignKey(
                name: "FK_RationOfGradientsValues_Information_InformationId",
                table: "RationOfGradientsValues");

            migrationBuilder.DropForeignKey(
                name: "FK_RightGradientValues_Information_InformationId",
                table: "RightGradientValues");

            migrationBuilder.DropForeignKey(
                name: "FK_Subtopics_Information_InformationId",
                table: "Subtopics");

            migrationBuilder.DropForeignKey(
                name: "FK_TopicOwner_Information_InformationId",
                table: "TopicOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_Topics_Information_InformationId",
                table: "Topics");

            migrationBuilder.DropForeignKey(
                name: "FK_Tutorial_Information_InformationId",
                table: "Tutorial");

            migrationBuilder.DropForeignKey(
                name: "FK_TutorialPDF_Information_InformationId",
                table: "TutorialPDF");

            migrationBuilder.DropForeignKey(
                name: "FK_TutorialsGroup_Information_InformationId",
                table: "TutorialsGroup");

            migrationBuilder.DropForeignKey(
                name: "FK_TutorialStep_Information_InformationId",
                table: "TutorialStep");

            migrationBuilder.DropForeignKey(
                name: "FK_TutorialTag_Information_InformationId",
                table: "TutorialTag");

            migrationBuilder.DropForeignKey(
                name: "FK_TutorialVideo_Information_InformationId",
                table: "TutorialVideo");

            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyOwner_Information_InformationId",
                table: "VariableKeyOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeys_Information_InformationId",
                table: "VariableKeys");

            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableChar_Information_InformationId",
                table: "VariableKeyVariableChar");

            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroupChoiceImage_Informat~",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage");

            migrationBuilder.DropTable(
                name: "Information");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroupChoiceImage_Informat~",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeyVariableChar_InformationId",
                table: "VariableKeyVariableChar");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeys_InformationId",
                table: "VariableKeys");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeyOwner_InformationId",
                table: "VariableKeyOwner");

            migrationBuilder.DropIndex(
                name: "IX_TutorialVideo_InformationId",
                table: "TutorialVideo");

            migrationBuilder.DropIndex(
                name: "IX_TutorialTag_InformationId",
                table: "TutorialTag");

            migrationBuilder.DropIndex(
                name: "IX_TutorialStep_InformationId",
                table: "TutorialStep");

            migrationBuilder.DropIndex(
                name: "IX_TutorialsGroup_InformationId",
                table: "TutorialsGroup");

            migrationBuilder.DropIndex(
                name: "IX_TutorialPDF_InformationId",
                table: "TutorialPDF");

            migrationBuilder.DropIndex(
                name: "IX_Tutorial_InformationId",
                table: "Tutorial");

            migrationBuilder.DropIndex(
                name: "IX_Topics_InformationId",
                table: "Topics");

            migrationBuilder.DropIndex(
                name: "IX_TopicOwner_InformationId",
                table: "TopicOwner");

            migrationBuilder.DropIndex(
                name: "IX_Subtopics_InformationId",
                table: "Subtopics");

            migrationBuilder.DropIndex(
                name: "IX_RightGradientValues_InformationId",
                table: "RightGradientValues");

            migrationBuilder.DropIndex(
                name: "IX_RationOfGradientsValues_InformationId",
                table: "RationOfGradientsValues");

            migrationBuilder.DropIndex(
                name: "IX_QuestionTemplateBases_InformationId",
                table: "QuestionTemplateBases");

            migrationBuilder.DropIndex(
                name: "IX_QuestionSubgroups_InformationId",
                table: "QuestionSubgroups");

            migrationBuilder.DropIndex(
                name: "IX_QuestionStatistic_InformationId",
                table: "QuestionStatistic");

            migrationBuilder.DropIndex(
                name: "IX_QuestionSeriesOwner_InformationId",
                table: "QuestionSeriesOwner");

            migrationBuilder.DropIndex(
                name: "IX_QuestionSeriesElement_InformationId",
                table: "QuestionSeriesElement");

           /* migrationBuilder.DropIndex(
                name: "IX_QuestionSeriesElement_QuestionId",
                table: "QuestionSeriesElement");*/

            migrationBuilder.DropIndex(
                name: "IX_QuestionSeries_InformationId",
                table: "QuestionSeries");

            migrationBuilder.DropIndex(
                name: "IX_QuestionOwner_InformationId",
                table: "QuestionOwner");

            migrationBuilder.DropIndex(
                name: "IX_QuestionGroups_InformationId",
                table: "QuestionGroups");

            migrationBuilder.DropIndex(
                name: "IX_QuestionChallengeTemplates_InformationId",
                table: "QuestionChallengeTemplates");

            migrationBuilder.DropIndex(
                name: "IX_QuestionChallengeSingleResult_InformationId",
                table: "QuestionChallengeSingleResult");

            migrationBuilder.DropIndex(
                name: "IX_QuestionChallengeQuestion_InformationId",
                table: "QuestionChallengeQuestion");

            migrationBuilder.DropIndex(
                name: "IX_QuestionBase_InformationId",
                table: "QuestionBase");

            migrationBuilder.DropIndex(
                name: "IX_QuestionAttribure_InformationId",
                table: "QuestionAttribure");

            migrationBuilder.DropIndex(
                name: "IX_NumericKeys_InformationId",
                table: "NumericKeys");

            migrationBuilder.DropIndex(
                name: "IX_NumericKeyOwner_InformationId",
                table: "NumericKeyOwner");

            migrationBuilder.DropIndex(
                name: "IX_MultipleChoiceQuestionChoice_InformationId",
                table: "MultipleChoiceQuestionChoice");

            migrationBuilder.DropIndex(
                name: "IX_LevelsOfDifficulty_InformationId",
                table: "LevelsOfDifficulty");

            migrationBuilder.DropIndex(
                name: "IX_LeftGradientValues_InformationId",
                table: "LeftGradientValues");

            migrationBuilder.DropIndex(
                name: "IX_KeysLists_InformationId",
                table: "KeysLists");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardVariableKeyRelation_InformationId",
                table: "KeyboardVariableKeyRelation");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardVariableKeyImageRelation_InformationId",
                table: "KeyboardVariableKeyImageRelation");

            migrationBuilder.DropIndex(
                name: "IX_Keyboards_InformationId",
                table: "Keyboards");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardQuestionSubgroupRelation_InformationId",
                table: "KeyboardQuestionSubgroupRelation");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardQuestionAnswerElement_InformationId",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardQuestionAnswer_InformationId",
                table: "KeyboardQuestionAnswer");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardOwner_InformationId",
                table: "KeyboardOwner");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardNumericKeyRelation_InformationId",
                table: "KeyboardNumericKeyRelation");

            migrationBuilder.DropIndex(
                name: "IX_JumpValues_InformationId",
                table: "JumpValues");

            migrationBuilder.DropIndex(
                name: "IX_InterpretedTreeOwner_InformationId",
                table: "InterpretedTreeOwner");

            migrationBuilder.DropIndex(
                name: "IX_InterpretedImages_InformationId",
                table: "InterpretedImages");

            migrationBuilder.DropIndex(
                name: "IX_InterpretedImageGroups_InformationId",
                table: "InterpretedImageGroups");

            migrationBuilder.DropIndex(
                name: "IX_ImageAnswers_InformationId",
                table: "ImageAnswers");

            migrationBuilder.DropIndex(
                name: "IX_ImageAnswerGroups_InformationId",
                table: "ImageAnswerGroups");

            migrationBuilder.DropIndex(
                name: "IX_DiagramPoints_InformationId",
                table: "DiagramPoints");

            migrationBuilder.DropIndex(
                name: "IX_DiagramPointRelation_InformationId",
                table: "DiagramPointRelation");

            migrationBuilder.DropIndex(
                name: "IX_Courses_InformationId",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_CourseOwner_InformationId",
                table: "CourseOwner");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapKeys_InformationId",
                table: "CourseMapKeys");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapElementBadge_InformationId",
                table: "CourseMapElementBadge");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapElement_InformationId",
                table: "CourseMapElement");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapBadgeSystemEntity_InformationId",
                table: "CourseMapBadgeSystemEntity");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapBadgeSystem_InformationId",
                table: "CourseMapBadgeSystem");

            migrationBuilder.DropIndex(
                name: "IX_CourseMap_InformationId",
                table: "CourseMap");

            migrationBuilder.DropIndex(
                name: "IX_ClickTreeOwner_InformationId",
                table: "ClickTreeOwner");

            migrationBuilder.DropIndex(
                name: "IX_ClickImage_InformationId",
                table: "ClickImage");

            migrationBuilder.DropIndex(
                name: "IX_ClickEquation_InformationId",
                table: "ClickEquation");

            migrationBuilder.DropIndex(
                name: "IX_ClickChart_InformationId",
                table: "ClickChart");

            migrationBuilder.DropIndex(
                name: "IX_ClickableQuestionSubgroupRelation_InformationId",
                table: "ClickableQuestionSubgroupRelation");

            migrationBuilder.DropIndex(
                name: "IX_ChallengeSessions_InformationId",
                table: "ChallengeSessions");

            migrationBuilder.DropIndex(
                name: "IX_ChallengePlayer_InformationId",
                table: "ChallengePlayer");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationUsers_InformationId",
                table: "ApplicationUsers");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "VariableKeyVariableChar");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "VariableKeys");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "VariableKeyOwner");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "TutorialVideo");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "TutorialTag");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "TutorialStep");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "TutorialsGroup");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "TutorialPDF");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "Tutorial");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "Topics");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "TopicOwner");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "Subtopics");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "RightGradientValues");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "RationOfGradientsValues");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionTemplateBases");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionSubgroups");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionStatistic");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionSeriesOwner");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionSeriesElement");

            /*migrationBuilder.DropColumn(
                name: "QuestionId",
                table: "QuestionSeriesElement");*/

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionSeries");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionOwner");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionGroups");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionChallengeTemplates");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionChallengeSingleResult");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionChallengeQuestion");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "QuestionAttribure");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "NumericKeys");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "NumericKeyOwner");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "MultipleChoiceQuestionChoice");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "LevelsOfDifficulty");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "LeftGradientValues");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "KeysLists");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "KeyboardVariableKeyRelation");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "KeyboardVariableKeyImageRelation");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "Keyboards");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "KeyboardQuestionSubgroupRelation");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "KeyboardQuestionAnswer");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "KeyboardOwner");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "KeyboardNumericKeyRelation");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "JumpValues");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "InterpretedTreeOwner");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "InterpretedImages");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "InterpretedImageGroups");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "ImageAnswers");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "ImageAnswerGroups");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "DiagramPoints");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "DiagramPointRelation");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "CourseOwner");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "CourseMapKeys");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "CourseMapElementBadge");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "CourseMapBadgeSystemEntity");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "CourseMapBadgeSystem");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "CourseMap");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "ClickTreeOwner");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "ClickImage");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "ClickEquation");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "ClickChart");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "ClickableQuestionSubgroupRelation");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "ChallengeSessions");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "ChallengePlayer");

            migrationBuilder.DropColumn(
                name: "InformationId",
                table: "ApplicationUsers");
        }
    }
}
