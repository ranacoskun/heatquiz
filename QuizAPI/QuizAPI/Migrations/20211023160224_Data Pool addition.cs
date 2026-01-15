using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAPI.Migrations
{
    public partial class DataPooladdition : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "VariableKeyVariableChar",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "VariableKeys",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "VariableKeyOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "TutorialVideo",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "TutorialTag",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "TutorialStep",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "TutorialsGroup",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "TutorialPDF",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "Tutorial",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "Topics",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "TopicOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "Subtopics",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "RightGradientValues",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "RationOfGradientsValues",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionTemplateBases",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionSubgroups",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionStatistic",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionSeriesOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionSeriesElement",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionSeries",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionGroups",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionChallengeTemplates",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionChallengeSingleResult",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionChallengeQuestion",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionBase",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "QuestionAttribure",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "NumericKeys",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "NumericKeyOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "MultipleChoiceQuestionChoice",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "LevelsOfDifficulty",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "LeftGradientValues",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "KeysLists",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "KeyboardVariableKeyRelation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "KeyboardVariableKeyImageRelation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "Keyboards",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "KeyboardQuestionSubgroupRelation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "KeyboardQuestionAnswerStatistic",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "KeyboardQuestionAnswerElement",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "KeyboardQuestionAnswer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "KeyboardOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "KeyboardNumericKeyRelation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "JumpValues",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "InterpretedTreeOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "InterpretedImages",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "InterpretedImageGroups",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "ImageAnswers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "ImageAnswerGroups",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "EB_Question",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "EB_Q_L_D_Relation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "EB_Label",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "EB_ClickablePart",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "EB_BoundryCondition",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "EB_AnswerElement",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "EB_Answer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "DiagramPoints",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "DiagramPointRelation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "Courses",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "CourseOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "CourseMapKeys",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "CourseMapElementImages",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "CourseMapElementBadge",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "CourseMapElement",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "CourseMapBadgeSystemEntity",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "CourseMapBadgeSystem",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "CourseMapArrow",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "CourseMap",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "ClickTreeOwner",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "ClickImage",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "ClickEquation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "ClickChart",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "ClickableQuestionSubgroupRelation",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "ChallengeSessions",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "ChallengePlayer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "BackgroundImage",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DataPoolId",
                table: "ApplicationUsers",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroupChoiceImage_DataPool~",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableChar_DataPoolId",
                table: "VariableKeyVariableChar",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeys_DataPoolId",
                table: "VariableKeys",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyOwner_DataPoolId",
                table: "VariableKeyOwner",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialVideo_DataPoolId",
                table: "TutorialVideo",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialTag_DataPoolId",
                table: "TutorialTag",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialStep_DataPoolId",
                table: "TutorialStep",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialsGroup_DataPoolId",
                table: "TutorialsGroup",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialPDF_DataPoolId",
                table: "TutorialPDF",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_Tutorial_DataPoolId",
                table: "Tutorial",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_Topics_DataPoolId",
                table: "Topics",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_TopicOwner_DataPoolId",
                table: "TopicOwner",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_Subtopics_DataPoolId",
                table: "Subtopics",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_RightGradientValues_DataPoolId",
                table: "RightGradientValues",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_RationOfGradientsValues_DataPoolId",
                table: "RationOfGradientsValues",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionTemplateBases_DataPoolId",
                table: "QuestionTemplateBases",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSubgroups_DataPoolId",
                table: "QuestionSubgroups",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionStatistic_DataPoolId",
                table: "QuestionStatistic",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesOwner_DataPoolId",
                table: "QuestionSeriesOwner",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeriesElement_DataPoolId",
                table: "QuestionSeriesElement",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSeries_DataPoolId",
                table: "QuestionSeries",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionOwner_DataPoolId",
                table: "QuestionOwner",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionGroups_DataPoolId",
                table: "QuestionGroups",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionChallengeTemplates_DataPoolId",
                table: "QuestionChallengeTemplates",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionChallengeSingleResult_DataPoolId",
                table: "QuestionChallengeSingleResult",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionChallengeQuestion_DataPoolId",
                table: "QuestionChallengeQuestion",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBase_DataPoolId",
                table: "QuestionBase",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionAttribure_DataPoolId",
                table: "QuestionAttribure",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_NumericKeys_DataPoolId",
                table: "NumericKeys",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_NumericKeyOwner_DataPoolId",
                table: "NumericKeyOwner",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_MultipleChoiceQuestionChoice_DataPoolId",
                table: "MultipleChoiceQuestionChoice",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_LevelsOfDifficulty_DataPoolId",
                table: "LevelsOfDifficulty",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_LeftGradientValues_DataPoolId",
                table: "LeftGradientValues",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_KeysLists_DataPoolId",
                table: "KeysLists",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardVariableKeyRelation_DataPoolId",
                table: "KeyboardVariableKeyRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardVariableKeyImageRelation_DataPoolId",
                table: "KeyboardVariableKeyImageRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_Keyboards_DataPoolId",
                table: "Keyboards",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionSubgroupRelation_DataPoolId",
                table: "KeyboardQuestionSubgroupRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswerStatistic_DataPoolId",
                table: "KeyboardQuestionAnswerStatistic",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswerElement_DataPoolId",
                table: "KeyboardQuestionAnswerElement",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswer_DataPoolId",
                table: "KeyboardQuestionAnswer",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardOwner_DataPoolId",
                table: "KeyboardOwner",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardNumericKeyRelation_DataPoolId",
                table: "KeyboardNumericKeyRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_JumpValues_DataPoolId",
                table: "JumpValues",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_InterpretedTreeOwner_DataPoolId",
                table: "InterpretedTreeOwner",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_InterpretedImages_DataPoolId",
                table: "InterpretedImages",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_InterpretedImageGroups_DataPoolId",
                table: "InterpretedImageGroups",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_ImageAnswers_DataPoolId",
                table: "ImageAnswers",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_ImageAnswerGroups_DataPoolId",
                table: "ImageAnswerGroups",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Question_DataPoolId",
                table: "EB_Question",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Q_L_D_Relation_DataPoolId",
                table: "EB_Q_L_D_Relation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Label_DataPoolId",
                table: "EB_Label",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_ClickablePart_DataPoolId",
                table: "EB_ClickablePart",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_BoundryCondition_DataPoolId",
                table: "EB_BoundryCondition",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_AnswerElement_DataPoolId",
                table: "EB_AnswerElement",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_EB_Answer_DataPoolId",
                table: "EB_Answer",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPoints_DataPoolId",
                table: "DiagramPoints",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagramPointRelation_DataPoolId",
                table: "DiagramPointRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_DataPoolId",
                table: "Courses",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseOwner_DataPoolId",
                table: "CourseOwner",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapKeys_DataPoolId",
                table: "CourseMapKeys",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElementImages_DataPoolId",
                table: "CourseMapElementImages",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElementBadge_DataPoolId",
                table: "CourseMapElementBadge",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapElement_DataPoolId",
                table: "CourseMapElement",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapBadgeSystemEntity_DataPoolId",
                table: "CourseMapBadgeSystemEntity",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapBadgeSystem_DataPoolId",
                table: "CourseMapBadgeSystem",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMapArrow_DataPoolId",
                table: "CourseMapArrow",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseMap_DataPoolId",
                table: "CourseMap",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickTreeOwner_DataPoolId",
                table: "ClickTreeOwner",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickImage_DataPoolId",
                table: "ClickImage",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickEquation_DataPoolId",
                table: "ClickEquation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickChart_DataPoolId",
                table: "ClickChart",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickableQuestionSubgroupRelation_DataPoolId",
                table: "ClickableQuestionSubgroupRelation",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_ChallengeSessions_DataPoolId",
                table: "ChallengeSessions",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_ChallengePlayer_DataPoolId",
                table: "ChallengePlayer",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_BackgroundImage_DataPoolId",
                table: "BackgroundImage",
                column: "DataPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUsers_DataPoolId",
                table: "ApplicationUsers",
                column: "DataPoolId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUsers_DataPools_DataPoolId",
                table: "ApplicationUsers",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_BackgroundImage_DataPools_DataPoolId",
                table: "BackgroundImage",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChallengePlayer_DataPools_DataPoolId",
                table: "ChallengePlayer",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChallengeSessions_DataPools_DataPoolId",
                table: "ChallengeSessions",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClickableQuestionSubgroupRelation_DataPools_DataPoolId",
                table: "ClickableQuestionSubgroupRelation",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClickChart_DataPools_DataPoolId",
                table: "ClickChart",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClickEquation_DataPools_DataPoolId",
                table: "ClickEquation",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClickImage_DataPools_DataPoolId",
                table: "ClickImage",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClickTreeOwner_DataPools_DataPoolId",
                table: "ClickTreeOwner",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMap_DataPools_DataPoolId",
                table: "CourseMap",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapArrow_DataPools_DataPoolId",
                table: "CourseMapArrow",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapBadgeSystem_DataPools_DataPoolId",
                table: "CourseMapBadgeSystem",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapBadgeSystemEntity_DataPools_DataPoolId",
                table: "CourseMapBadgeSystemEntity",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapElement_DataPools_DataPoolId",
                table: "CourseMapElement",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapElementBadge_DataPools_DataPoolId",
                table: "CourseMapElementBadge",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapElementImages_DataPools_DataPoolId",
                table: "CourseMapElementImages",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMapKeys_DataPools_DataPoolId",
                table: "CourseMapKeys",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseOwner_DataPools_DataPoolId",
                table: "CourseOwner",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_DataPools_DataPoolId",
                table: "Courses",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DiagramPointRelation_DataPools_DataPoolId",
                table: "DiagramPointRelation",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DiagramPoints_DataPools_DataPoolId",
                table: "DiagramPoints",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Answer_DataPools_DataPoolId",
                table: "EB_Answer",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_AnswerElement_DataPools_DataPoolId",
                table: "EB_AnswerElement",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_BoundryCondition_DataPools_DataPoolId",
                table: "EB_BoundryCondition",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_ClickablePart_DataPools_DataPoolId",
                table: "EB_ClickablePart",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Label_DataPools_DataPoolId",
                table: "EB_Label",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Q_L_D_Relation_DataPools_DataPoolId",
                table: "EB_Q_L_D_Relation",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EB_Question_DataPools_DataPoolId",
                table: "EB_Question",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ImageAnswerGroups_DataPools_DataPoolId",
                table: "ImageAnswerGroups",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ImageAnswers_DataPools_DataPoolId",
                table: "ImageAnswers",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_InterpretedImageGroups_DataPools_DataPoolId",
                table: "InterpretedImageGroups",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_InterpretedImages_DataPools_DataPoolId",
                table: "InterpretedImages",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_InterpretedTreeOwner_DataPools_DataPoolId",
                table: "InterpretedTreeOwner",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_JumpValues_DataPools_DataPoolId",
                table: "JumpValues",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardNumericKeyRelation_DataPools_DataPoolId",
                table: "KeyboardNumericKeyRelation",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardOwner_DataPools_DataPoolId",
                table: "KeyboardOwner",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionAnswer_DataPools_DataPoolId",
                table: "KeyboardQuestionAnswer",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_DataPools_DataPoolId",
                table: "KeyboardQuestionAnswerElement",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionAnswerStatistic_DataPools_DataPoolId",
                table: "KeyboardQuestionAnswerStatistic",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardQuestionSubgroupRelation_DataPools_DataPoolId",
                table: "KeyboardQuestionSubgroupRelation",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Keyboards_DataPools_DataPoolId",
                table: "Keyboards",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardVariableKeyImageRelation_DataPools_DataPoolId",
                table: "KeyboardVariableKeyImageRelation",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeyboardVariableKeyRelation_DataPools_DataPoolId",
                table: "KeyboardVariableKeyRelation",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_KeysLists_DataPools_DataPoolId",
                table: "KeysLists",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LeftGradientValues_DataPools_DataPoolId",
                table: "LeftGradientValues",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LevelsOfDifficulty_DataPools_DataPoolId",
                table: "LevelsOfDifficulty",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MultipleChoiceQuestionChoice_DataPools_DataPoolId",
                table: "MultipleChoiceQuestionChoice",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_NumericKeyOwner_DataPools_DataPoolId",
                table: "NumericKeyOwner",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_NumericKeys_DataPools_DataPoolId",
                table: "NumericKeys",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionAttribure_DataPools_DataPoolId",
                table: "QuestionAttribure",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionBase_DataPools_DataPoolId",
                table: "QuestionBase",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionChallengeQuestion_DataPools_DataPoolId",
                table: "QuestionChallengeQuestion",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionChallengeSingleResult_DataPools_DataPoolId",
                table: "QuestionChallengeSingleResult",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionChallengeTemplates_DataPools_DataPoolId",
                table: "QuestionChallengeTemplates",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionGroups_DataPools_DataPoolId",
                table: "QuestionGroups",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionOwner_DataPools_DataPoolId",
                table: "QuestionOwner",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionSeries_DataPools_DataPoolId",
                table: "QuestionSeries",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionSeriesElement_DataPools_DataPoolId",
                table: "QuestionSeriesElement",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionSeriesOwner_DataPools_DataPoolId",
                table: "QuestionSeriesOwner",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionStatistic_DataPools_DataPoolId",
                table: "QuestionStatistic",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionSubgroups_DataPools_DataPoolId",
                table: "QuestionSubgroups",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionTemplateBases_DataPools_DataPoolId",
                table: "QuestionTemplateBases",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RationOfGradientsValues_DataPools_DataPoolId",
                table: "RationOfGradientsValues",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RightGradientValues_DataPools_DataPoolId",
                table: "RightGradientValues",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Subtopics_DataPools_DataPoolId",
                table: "Subtopics",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TopicOwner_DataPools_DataPoolId",
                table: "TopicOwner",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Topics_DataPools_DataPoolId",
                table: "Topics",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tutorial_DataPools_DataPoolId",
                table: "Tutorial",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TutorialPDF_DataPools_DataPoolId",
                table: "TutorialPDF",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TutorialsGroup_DataPools_DataPoolId",
                table: "TutorialsGroup",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TutorialStep_DataPools_DataPoolId",
                table: "TutorialStep",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TutorialTag_DataPools_DataPoolId",
                table: "TutorialTag",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TutorialVideo_DataPools_DataPoolId",
                table: "TutorialVideo",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyOwner_DataPools_DataPoolId",
                table: "VariableKeyOwner",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeys_DataPools_DataPoolId",
                table: "VariableKeys",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableChar_DataPools_DataPoolId",
                table: "VariableKeyVariableChar",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroupChoiceImage_DataPool~",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage",
                column: "DataPoolId",
                principalTable: "DataPools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUsers_DataPools_DataPoolId",
                table: "ApplicationUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_BackgroundImage_DataPools_DataPoolId",
                table: "BackgroundImage");

            migrationBuilder.DropForeignKey(
                name: "FK_ChallengePlayer_DataPools_DataPoolId",
                table: "ChallengePlayer");

            migrationBuilder.DropForeignKey(
                name: "FK_ChallengeSessions_DataPools_DataPoolId",
                table: "ChallengeSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_ClickableQuestionSubgroupRelation_DataPools_DataPoolId",
                table: "ClickableQuestionSubgroupRelation");

            migrationBuilder.DropForeignKey(
                name: "FK_ClickChart_DataPools_DataPoolId",
                table: "ClickChart");

            migrationBuilder.DropForeignKey(
                name: "FK_ClickEquation_DataPools_DataPoolId",
                table: "ClickEquation");

            migrationBuilder.DropForeignKey(
                name: "FK_ClickImage_DataPools_DataPoolId",
                table: "ClickImage");

            migrationBuilder.DropForeignKey(
                name: "FK_ClickTreeOwner_DataPools_DataPoolId",
                table: "ClickTreeOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMap_DataPools_DataPoolId",
                table: "CourseMap");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapArrow_DataPools_DataPoolId",
                table: "CourseMapArrow");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapBadgeSystem_DataPools_DataPoolId",
                table: "CourseMapBadgeSystem");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapBadgeSystemEntity_DataPools_DataPoolId",
                table: "CourseMapBadgeSystemEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapElement_DataPools_DataPoolId",
                table: "CourseMapElement");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapElementBadge_DataPools_DataPoolId",
                table: "CourseMapElementBadge");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapElementImages_DataPools_DataPoolId",
                table: "CourseMapElementImages");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMapKeys_DataPools_DataPoolId",
                table: "CourseMapKeys");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseOwner_DataPools_DataPoolId",
                table: "CourseOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_DataPools_DataPoolId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_DiagramPointRelation_DataPools_DataPoolId",
                table: "DiagramPointRelation");

            migrationBuilder.DropForeignKey(
                name: "FK_DiagramPoints_DataPools_DataPoolId",
                table: "DiagramPoints");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_Answer_DataPools_DataPoolId",
                table: "EB_Answer");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_AnswerElement_DataPools_DataPoolId",
                table: "EB_AnswerElement");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_BoundryCondition_DataPools_DataPoolId",
                table: "EB_BoundryCondition");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_ClickablePart_DataPools_DataPoolId",
                table: "EB_ClickablePart");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_Label_DataPools_DataPoolId",
                table: "EB_Label");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_Q_L_D_Relation_DataPools_DataPoolId",
                table: "EB_Q_L_D_Relation");

            migrationBuilder.DropForeignKey(
                name: "FK_EB_Question_DataPools_DataPoolId",
                table: "EB_Question");

            migrationBuilder.DropForeignKey(
                name: "FK_ImageAnswerGroups_DataPools_DataPoolId",
                table: "ImageAnswerGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_ImageAnswers_DataPools_DataPoolId",
                table: "ImageAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_InterpretedImageGroups_DataPools_DataPoolId",
                table: "InterpretedImageGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_InterpretedImages_DataPools_DataPoolId",
                table: "InterpretedImages");

            migrationBuilder.DropForeignKey(
                name: "FK_InterpretedTreeOwner_DataPools_DataPoolId",
                table: "InterpretedTreeOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_JumpValues_DataPools_DataPoolId",
                table: "JumpValues");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardNumericKeyRelation_DataPools_DataPoolId",
                table: "KeyboardNumericKeyRelation");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardOwner_DataPools_DataPoolId",
                table: "KeyboardOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionAnswer_DataPools_DataPoolId",
                table: "KeyboardQuestionAnswer");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionAnswerElement_DataPools_DataPoolId",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionAnswerStatistic_DataPools_DataPoolId",
                table: "KeyboardQuestionAnswerStatistic");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardQuestionSubgroupRelation_DataPools_DataPoolId",
                table: "KeyboardQuestionSubgroupRelation");

            migrationBuilder.DropForeignKey(
                name: "FK_Keyboards_DataPools_DataPoolId",
                table: "Keyboards");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardVariableKeyImageRelation_DataPools_DataPoolId",
                table: "KeyboardVariableKeyImageRelation");

            migrationBuilder.DropForeignKey(
                name: "FK_KeyboardVariableKeyRelation_DataPools_DataPoolId",
                table: "KeyboardVariableKeyRelation");

            migrationBuilder.DropForeignKey(
                name: "FK_KeysLists_DataPools_DataPoolId",
                table: "KeysLists");

            migrationBuilder.DropForeignKey(
                name: "FK_LeftGradientValues_DataPools_DataPoolId",
                table: "LeftGradientValues");

            migrationBuilder.DropForeignKey(
                name: "FK_LevelsOfDifficulty_DataPools_DataPoolId",
                table: "LevelsOfDifficulty");

            migrationBuilder.DropForeignKey(
                name: "FK_MultipleChoiceQuestionChoice_DataPools_DataPoolId",
                table: "MultipleChoiceQuestionChoice");

            migrationBuilder.DropForeignKey(
                name: "FK_NumericKeyOwner_DataPools_DataPoolId",
                table: "NumericKeyOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_NumericKeys_DataPools_DataPoolId",
                table: "NumericKeys");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionAttribure_DataPools_DataPoolId",
                table: "QuestionAttribure");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionBase_DataPools_DataPoolId",
                table: "QuestionBase");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionChallengeQuestion_DataPools_DataPoolId",
                table: "QuestionChallengeQuestion");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionChallengeSingleResult_DataPools_DataPoolId",
                table: "QuestionChallengeSingleResult");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionChallengeTemplates_DataPools_DataPoolId",
                table: "QuestionChallengeTemplates");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionGroups_DataPools_DataPoolId",
                table: "QuestionGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionOwner_DataPools_DataPoolId",
                table: "QuestionOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionSeries_DataPools_DataPoolId",
                table: "QuestionSeries");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionSeriesElement_DataPools_DataPoolId",
                table: "QuestionSeriesElement");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionSeriesOwner_DataPools_DataPoolId",
                table: "QuestionSeriesOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionStatistic_DataPools_DataPoolId",
                table: "QuestionStatistic");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionSubgroups_DataPools_DataPoolId",
                table: "QuestionSubgroups");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionTemplateBases_DataPools_DataPoolId",
                table: "QuestionTemplateBases");

            migrationBuilder.DropForeignKey(
                name: "FK_RationOfGradientsValues_DataPools_DataPoolId",
                table: "RationOfGradientsValues");

            migrationBuilder.DropForeignKey(
                name: "FK_RightGradientValues_DataPools_DataPoolId",
                table: "RightGradientValues");

            migrationBuilder.DropForeignKey(
                name: "FK_Subtopics_DataPools_DataPoolId",
                table: "Subtopics");

            migrationBuilder.DropForeignKey(
                name: "FK_TopicOwner_DataPools_DataPoolId",
                table: "TopicOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_Topics_DataPools_DataPoolId",
                table: "Topics");

            migrationBuilder.DropForeignKey(
                name: "FK_Tutorial_DataPools_DataPoolId",
                table: "Tutorial");

            migrationBuilder.DropForeignKey(
                name: "FK_TutorialPDF_DataPools_DataPoolId",
                table: "TutorialPDF");

            migrationBuilder.DropForeignKey(
                name: "FK_TutorialsGroup_DataPools_DataPoolId",
                table: "TutorialsGroup");

            migrationBuilder.DropForeignKey(
                name: "FK_TutorialStep_DataPools_DataPoolId",
                table: "TutorialStep");

            migrationBuilder.DropForeignKey(
                name: "FK_TutorialTag_DataPools_DataPoolId",
                table: "TutorialTag");

            migrationBuilder.DropForeignKey(
                name: "FK_TutorialVideo_DataPools_DataPoolId",
                table: "TutorialVideo");

            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyOwner_DataPools_DataPoolId",
                table: "VariableKeyOwner");

            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeys_DataPools_DataPoolId",
                table: "VariableKeys");

            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableChar_DataPools_DataPoolId",
                table: "VariableKeyVariableChar");

            migrationBuilder.DropForeignKey(
                name: "FK_VariableKeyVariableCharValidValuesGroupChoiceImage_DataPool~",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeyVariableCharValidValuesGroupChoiceImage_DataPool~",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeyVariableChar_DataPoolId",
                table: "VariableKeyVariableChar");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeys_DataPoolId",
                table: "VariableKeys");

            migrationBuilder.DropIndex(
                name: "IX_VariableKeyOwner_DataPoolId",
                table: "VariableKeyOwner");

            migrationBuilder.DropIndex(
                name: "IX_TutorialVideo_DataPoolId",
                table: "TutorialVideo");

            migrationBuilder.DropIndex(
                name: "IX_TutorialTag_DataPoolId",
                table: "TutorialTag");

            migrationBuilder.DropIndex(
                name: "IX_TutorialStep_DataPoolId",
                table: "TutorialStep");

            migrationBuilder.DropIndex(
                name: "IX_TutorialsGroup_DataPoolId",
                table: "TutorialsGroup");

            migrationBuilder.DropIndex(
                name: "IX_TutorialPDF_DataPoolId",
                table: "TutorialPDF");

            migrationBuilder.DropIndex(
                name: "IX_Tutorial_DataPoolId",
                table: "Tutorial");

            migrationBuilder.DropIndex(
                name: "IX_Topics_DataPoolId",
                table: "Topics");

            migrationBuilder.DropIndex(
                name: "IX_TopicOwner_DataPoolId",
                table: "TopicOwner");

            migrationBuilder.DropIndex(
                name: "IX_Subtopics_DataPoolId",
                table: "Subtopics");

            migrationBuilder.DropIndex(
                name: "IX_RightGradientValues_DataPoolId",
                table: "RightGradientValues");

            migrationBuilder.DropIndex(
                name: "IX_RationOfGradientsValues_DataPoolId",
                table: "RationOfGradientsValues");

            migrationBuilder.DropIndex(
                name: "IX_QuestionTemplateBases_DataPoolId",
                table: "QuestionTemplateBases");

            migrationBuilder.DropIndex(
                name: "IX_QuestionSubgroups_DataPoolId",
                table: "QuestionSubgroups");

            migrationBuilder.DropIndex(
                name: "IX_QuestionStatistic_DataPoolId",
                table: "QuestionStatistic");

            migrationBuilder.DropIndex(
                name: "IX_QuestionSeriesOwner_DataPoolId",
                table: "QuestionSeriesOwner");

            migrationBuilder.DropIndex(
                name: "IX_QuestionSeriesElement_DataPoolId",
                table: "QuestionSeriesElement");

            migrationBuilder.DropIndex(
                name: "IX_QuestionSeries_DataPoolId",
                table: "QuestionSeries");

            migrationBuilder.DropIndex(
                name: "IX_QuestionOwner_DataPoolId",
                table: "QuestionOwner");

            migrationBuilder.DropIndex(
                name: "IX_QuestionGroups_DataPoolId",
                table: "QuestionGroups");

            migrationBuilder.DropIndex(
                name: "IX_QuestionChallengeTemplates_DataPoolId",
                table: "QuestionChallengeTemplates");

            migrationBuilder.DropIndex(
                name: "IX_QuestionChallengeSingleResult_DataPoolId",
                table: "QuestionChallengeSingleResult");

            migrationBuilder.DropIndex(
                name: "IX_QuestionChallengeQuestion_DataPoolId",
                table: "QuestionChallengeQuestion");

            migrationBuilder.DropIndex(
                name: "IX_QuestionBase_DataPoolId",
                table: "QuestionBase");

            migrationBuilder.DropIndex(
                name: "IX_QuestionAttribure_DataPoolId",
                table: "QuestionAttribure");

            migrationBuilder.DropIndex(
                name: "IX_NumericKeys_DataPoolId",
                table: "NumericKeys");

            migrationBuilder.DropIndex(
                name: "IX_NumericKeyOwner_DataPoolId",
                table: "NumericKeyOwner");

            migrationBuilder.DropIndex(
                name: "IX_MultipleChoiceQuestionChoice_DataPoolId",
                table: "MultipleChoiceQuestionChoice");

            migrationBuilder.DropIndex(
                name: "IX_LevelsOfDifficulty_DataPoolId",
                table: "LevelsOfDifficulty");

            migrationBuilder.DropIndex(
                name: "IX_LeftGradientValues_DataPoolId",
                table: "LeftGradientValues");

            migrationBuilder.DropIndex(
                name: "IX_KeysLists_DataPoolId",
                table: "KeysLists");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardVariableKeyRelation_DataPoolId",
                table: "KeyboardVariableKeyRelation");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardVariableKeyImageRelation_DataPoolId",
                table: "KeyboardVariableKeyImageRelation");

            migrationBuilder.DropIndex(
                name: "IX_Keyboards_DataPoolId",
                table: "Keyboards");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardQuestionSubgroupRelation_DataPoolId",
                table: "KeyboardQuestionSubgroupRelation");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardQuestionAnswerStatistic_DataPoolId",
                table: "KeyboardQuestionAnswerStatistic");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardQuestionAnswerElement_DataPoolId",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardQuestionAnswer_DataPoolId",
                table: "KeyboardQuestionAnswer");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardOwner_DataPoolId",
                table: "KeyboardOwner");

            migrationBuilder.DropIndex(
                name: "IX_KeyboardNumericKeyRelation_DataPoolId",
                table: "KeyboardNumericKeyRelation");

            migrationBuilder.DropIndex(
                name: "IX_JumpValues_DataPoolId",
                table: "JumpValues");

            migrationBuilder.DropIndex(
                name: "IX_InterpretedTreeOwner_DataPoolId",
                table: "InterpretedTreeOwner");

            migrationBuilder.DropIndex(
                name: "IX_InterpretedImages_DataPoolId",
                table: "InterpretedImages");

            migrationBuilder.DropIndex(
                name: "IX_InterpretedImageGroups_DataPoolId",
                table: "InterpretedImageGroups");

            migrationBuilder.DropIndex(
                name: "IX_ImageAnswers_DataPoolId",
                table: "ImageAnswers");

            migrationBuilder.DropIndex(
                name: "IX_ImageAnswerGroups_DataPoolId",
                table: "ImageAnswerGroups");

            migrationBuilder.DropIndex(
                name: "IX_EB_Question_DataPoolId",
                table: "EB_Question");

            migrationBuilder.DropIndex(
                name: "IX_EB_Q_L_D_Relation_DataPoolId",
                table: "EB_Q_L_D_Relation");

            migrationBuilder.DropIndex(
                name: "IX_EB_Label_DataPoolId",
                table: "EB_Label");

            migrationBuilder.DropIndex(
                name: "IX_EB_ClickablePart_DataPoolId",
                table: "EB_ClickablePart");

            migrationBuilder.DropIndex(
                name: "IX_EB_BoundryCondition_DataPoolId",
                table: "EB_BoundryCondition");

            migrationBuilder.DropIndex(
                name: "IX_EB_AnswerElement_DataPoolId",
                table: "EB_AnswerElement");

            migrationBuilder.DropIndex(
                name: "IX_EB_Answer_DataPoolId",
                table: "EB_Answer");

            migrationBuilder.DropIndex(
                name: "IX_DiagramPoints_DataPoolId",
                table: "DiagramPoints");

            migrationBuilder.DropIndex(
                name: "IX_DiagramPointRelation_DataPoolId",
                table: "DiagramPointRelation");

            migrationBuilder.DropIndex(
                name: "IX_Courses_DataPoolId",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_CourseOwner_DataPoolId",
                table: "CourseOwner");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapKeys_DataPoolId",
                table: "CourseMapKeys");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapElementImages_DataPoolId",
                table: "CourseMapElementImages");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapElementBadge_DataPoolId",
                table: "CourseMapElementBadge");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapElement_DataPoolId",
                table: "CourseMapElement");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapBadgeSystemEntity_DataPoolId",
                table: "CourseMapBadgeSystemEntity");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapBadgeSystem_DataPoolId",
                table: "CourseMapBadgeSystem");

            migrationBuilder.DropIndex(
                name: "IX_CourseMapArrow_DataPoolId",
                table: "CourseMapArrow");

            migrationBuilder.DropIndex(
                name: "IX_CourseMap_DataPoolId",
                table: "CourseMap");

            migrationBuilder.DropIndex(
                name: "IX_ClickTreeOwner_DataPoolId",
                table: "ClickTreeOwner");

            migrationBuilder.DropIndex(
                name: "IX_ClickImage_DataPoolId",
                table: "ClickImage");

            migrationBuilder.DropIndex(
                name: "IX_ClickEquation_DataPoolId",
                table: "ClickEquation");

            migrationBuilder.DropIndex(
                name: "IX_ClickChart_DataPoolId",
                table: "ClickChart");

            migrationBuilder.DropIndex(
                name: "IX_ClickableQuestionSubgroupRelation_DataPoolId",
                table: "ClickableQuestionSubgroupRelation");

            migrationBuilder.DropIndex(
                name: "IX_ChallengeSessions_DataPoolId",
                table: "ChallengeSessions");

            migrationBuilder.DropIndex(
                name: "IX_ChallengePlayer_DataPoolId",
                table: "ChallengePlayer");

            migrationBuilder.DropIndex(
                name: "IX_BackgroundImage_DataPoolId",
                table: "BackgroundImage");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationUsers_DataPoolId",
                table: "ApplicationUsers");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "VariableKeyVariableCharValidValuesGroupChoiceImage");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "VariableKeyVariableChar");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "VariableKeys");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "VariableKeyOwner");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "TutorialVideo");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "TutorialTag");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "TutorialStep");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "TutorialsGroup");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "TutorialPDF");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "Tutorial");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "Topics");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "TopicOwner");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "Subtopics");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "RightGradientValues");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "RationOfGradientsValues");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionTemplateBases");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionSubgroups");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionStatistic");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionSeriesOwner");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionSeriesElement");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionSeries");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionOwner");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionGroups");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionChallengeTemplates");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionChallengeSingleResult");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionChallengeQuestion");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionBase");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "QuestionAttribure");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "NumericKeys");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "NumericKeyOwner");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "MultipleChoiceQuestionChoice");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "LevelsOfDifficulty");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "LeftGradientValues");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "KeysLists");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "KeyboardVariableKeyRelation");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "KeyboardVariableKeyImageRelation");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "Keyboards");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "KeyboardQuestionSubgroupRelation");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "KeyboardQuestionAnswerStatistic");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "KeyboardQuestionAnswerElement");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "KeyboardQuestionAnswer");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "KeyboardOwner");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "KeyboardNumericKeyRelation");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "JumpValues");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "InterpretedTreeOwner");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "InterpretedImages");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "InterpretedImageGroups");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "ImageAnswers");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "ImageAnswerGroups");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "EB_Question");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "EB_Q_L_D_Relation");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "EB_Label");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "EB_ClickablePart");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "EB_BoundryCondition");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "EB_AnswerElement");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "EB_Answer");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "DiagramPoints");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "DiagramPointRelation");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "CourseOwner");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "CourseMapKeys");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "CourseMapElementImages");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "CourseMapElementBadge");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "CourseMapElement");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "CourseMapBadgeSystemEntity");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "CourseMapBadgeSystem");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "CourseMapArrow");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "CourseMap");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "ClickTreeOwner");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "ClickImage");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "ClickEquation");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "ClickChart");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "ClickableQuestionSubgroupRelation");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "ChallengeSessions");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "ChallengePlayer");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "BackgroundImage");

            migrationBuilder.DropColumn(
                name: "DataPoolId",
                table: "ApplicationUsers");
        }
    }
}
