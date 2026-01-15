using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace QuizAPI.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ApplicationUsers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    NickName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ImageAnswerGroups",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageAnswerGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InterpretedImageGroups",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InterpretedImageGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "JumpValues",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JumpValues", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Keyboards",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Keyboards", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LeftGradientValues",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeftGradientValues", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LevelsOfDifficulty",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    HexColor = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LevelsOfDifficulty", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NumericKeys",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    TextPresentation = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NumericKeys", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "QuestionChallengeTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    TimeInMinutes = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionChallengeTemplates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RationOfGradientsValues",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RationOfGradientsValues", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RightGradientValues",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RightGradientValues", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Topics",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Active = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Topics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    RegisteredOn = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VariableKeys",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    TextPresentation = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariableKeys", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ImageAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Choosable = table.Column<bool>(nullable: false),
                    URL = table.Column<string>(nullable: true),
                    Size = table.Column<long>(nullable: false),
                    GroupId = table.Column<int>(nullable: false),
                    RootId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImageAnswers_ImageAnswerGroups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "ImageAnswerGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ImageAnswers_ImageAnswers_RootId",
                        column: x => x.RootId,
                        principalTable: "ImageAnswers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "KeyboardNumericKeyRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    KeyboardId = table.Column<int>(nullable: false),
                    NumericKeyId = table.Column<int>(nullable: false),
                    KeySimpleForm = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeyboardNumericKeyRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KeyboardNumericKeyRelation_Keyboards_KeyboardId",
                        column: x => x.KeyboardId,
                        principalTable: "Keyboards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KeyboardNumericKeyRelation_NumericKeys_NumericKeyId",
                        column: x => x.NumericKeyId,
                        principalTable: "NumericKeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChallengeSessions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    TemplateId = table.Column<int>(nullable: false),
                    Active = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChallengeSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChallengeSessions_QuestionChallengeTemplates_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "QuestionChallengeTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InterpretedImages",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    LeftId = table.Column<int>(nullable: false),
                    RightId = table.Column<int>(nullable: false),
                    RationOfGradientsId = table.Column<int>(nullable: false),
                    JumpId = table.Column<int>(nullable: false),
                    URL = table.Column<string>(nullable: true),
                    Size = table.Column<long>(nullable: false),
                    GroupId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InterpretedImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InterpretedImages_InterpretedImageGroups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "InterpretedImageGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InterpretedImages_JumpValues_JumpId",
                        column: x => x.JumpId,
                        principalTable: "JumpValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InterpretedImages_LeftGradientValues_LeftId",
                        column: x => x.LeftId,
                        principalTable: "LeftGradientValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InterpretedImages_RationOfGradientsValues_RationOfGradients~",
                        column: x => x.RationOfGradientsId,
                        principalTable: "RationOfGradientsValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InterpretedImages_RightGradientValues_RightId",
                        column: x => x.RightId,
                        principalTable: "RightGradientValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    RoleId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Subtopics",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Active = table.Column<bool>(nullable: false),
                    TopicId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subtopics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subtopics_Topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "Topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    URL = table.Column<string>(nullable: true),
                    Size = table.Column<long>(nullable: false),
                    AddedById = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Courses_User_AddedById",
                        column: x => x.AddedById,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    UserId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserClaims_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_UserLogins_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_UserTokens_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KeyboardVariableKeyRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    KeyboardId = table.Column<int>(nullable: false),
                    VariableKeyId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeyboardVariableKeyRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KeyboardVariableKeyRelation_Keyboards_KeyboardId",
                        column: x => x.KeyboardId,
                        principalTable: "Keyboards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KeyboardVariableKeyRelation_VariableKeys_VariableKeyId",
                        column: x => x.VariableKeyId,
                        principalTable: "VariableKeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VariableKeyVariableChar",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    KeyId = table.Column<int>(nullable: false),
                    VariableChar = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariableKeyVariableChar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VariableKeyVariableChar_VariableKeys_KeyId",
                        column: x => x.KeyId,
                        principalTable: "VariableKeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChallengePlayer",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    SessionId = table.Column<int>(nullable: false),
                    Score = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChallengePlayer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChallengePlayer_ChallengeSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "ChallengeSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionBase",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    AddedById = table.Column<string>(nullable: true),
                    Public = table.Column<bool>(nullable: false),
                    Approved = table.Column<bool>(nullable: false),
                    LevelOfDifficultyId = table.Column<int>(nullable: false),
                    ThumbnailURL = table.Column<string>(nullable: true),
                    ThumbnailSize = table.Column<long>(nullable: false),
                    SubtopicId = table.Column<int>(nullable: false),
                    PDFURL = table.Column<string>(nullable: true),
                    PDFSize = table.Column<long>(nullable: false),
                    Discriminator = table.Column<string>(nullable: false),
                    AnswerForLatex = table.Column<string>(nullable: true),
                    ImageURL = table.Column<string>(nullable: true),
                    ImageSize = table.Column<long>(nullable: true),
                    KeyboardId = table.Column<int>(nullable: true),
                    BackgroundImageURL = table.Column<string>(nullable: true),
                    BackgroundImageSize = table.Column<int>(nullable: true),
                    BackgroundImageWidth = table.Column<int>(nullable: true),
                    BackgroundImageHeight = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionBase", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionBase_Keyboards_KeyboardId",
                        column: x => x.KeyboardId,
                        principalTable: "Keyboards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionBase_User_AddedById",
                        column: x => x.AddedById,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionBase_LevelsOfDifficulty_LevelOfDifficultyId",
                        column: x => x.LevelOfDifficultyId,
                        principalTable: "LevelsOfDifficulty",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionBase_Subtopics_SubtopicId",
                        column: x => x.SubtopicId,
                        principalTable: "Subtopics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionTemplateBases",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    LevelOfDifficultyId = table.Column<int>(nullable: false),
                    SubtopicId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionTemplateBases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionTemplateBases_LevelsOfDifficulty_LevelOfDifficultyId",
                        column: x => x.LevelOfDifficultyId,
                        principalTable: "LevelsOfDifficulty",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionTemplateBases_Subtopics_SubtopicId",
                        column: x => x.SubtopicId,
                        principalTable: "Subtopics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionGroups",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    URL = table.Column<string>(nullable: true),
                    Size = table.Column<long>(nullable: false),
                    CourseId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionGroups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionGroups_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TutorialsGroup",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    CourseId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorialsGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TutorialsGroup_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VariableKeyVariableCharValidValues",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    CharId = table.Column<int>(nullable: false),
                    Value = table.Column<string>(nullable: true),
                    IsLatex = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariableKeyVariableCharValidValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VariableKeyVariableCharValidValues_VariableKeyVariableChar_~",
                        column: x => x.CharId,
                        principalTable: "VariableKeyVariableChar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionChallengeSingleResult",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    SessionId = table.Column<int>(nullable: false),
                    PlayerId = table.Column<int>(nullable: false),
                    Result = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionChallengeSingleResult", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionChallengeSingleResult_ChallengePlayer_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "ChallengePlayer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionChallengeSingleResult_ChallengeSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "ChallengeSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClickChart",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    X = table.Column<int>(nullable: false),
                    Y = table.Column<int>(nullable: false),
                    Width = table.Column<int>(nullable: false),
                    Height = table.Column<int>(nullable: false),
                    AnswerWeight = table.Column<int>(nullable: false),
                    AnswerId = table.Column<int>(nullable: false),
                    AnswerGroupId = table.Column<int>(nullable: false),
                    SimpleClickableQuestionId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClickChart", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClickChart_InterpretedImageGroups_AnswerGroupId",
                        column: x => x.AnswerGroupId,
                        principalTable: "InterpretedImageGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClickChart_InterpretedImages_AnswerId",
                        column: x => x.AnswerId,
                        principalTable: "InterpretedImages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClickChart_QuestionBase_SimpleClickableQuestionId",
                        column: x => x.SimpleClickableQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClickEquation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    X = table.Column<int>(nullable: false),
                    Y = table.Column<int>(nullable: false),
                    Width = table.Column<int>(nullable: false),
                    Height = table.Column<int>(nullable: false),
                    AnswerWeight = table.Column<int>(nullable: false),
                    SimpleClickableQuestionId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClickEquation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClickEquation_QuestionBase_SimpleClickableQuestionId",
                        column: x => x.SimpleClickableQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClickImage",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    X = table.Column<int>(nullable: false),
                    Y = table.Column<int>(nullable: false),
                    Width = table.Column<int>(nullable: false),
                    Height = table.Column<int>(nullable: false),
                    AnswerWeight = table.Column<int>(nullable: false),
                    AnswerId = table.Column<int>(nullable: false),
                    AnswerGroupId = table.Column<int>(nullable: false),
                    QuestionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClickImage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClickImage_ImageAnswerGroups_AnswerGroupId",
                        column: x => x.AnswerGroupId,
                        principalTable: "ImageAnswerGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClickImage_ImageAnswers_AnswerId",
                        column: x => x.AnswerId,
                        principalTable: "ImageAnswers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClickImage_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KeyboardQuestionAnswer",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    TextAnswer = table.Column<string>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeyboardQuestionAnswer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KeyboardQuestionAnswer_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionChallengeQuestion",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Order = table.Column<int>(nullable: false),
                    ChallengeTemplateId = table.Column<int>(nullable: false),
                    ClickableQuestionId = table.Column<int>(nullable: true),
                    KeyboardQuestionId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionChallengeQuestion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionChallengeQuestion_QuestionChallengeTemplates_Challe~",
                        column: x => x.ChallengeTemplateId,
                        principalTable: "QuestionChallengeTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionChallengeQuestion_QuestionBase_ClickableQuestionId",
                        column: x => x.ClickableQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionChallengeQuestion_QuestionBase_KeyboardQuestionId",
                        column: x => x.KeyboardQuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuestionAttribure",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    QuestionBaseId = table.Column<int>(nullable: false),
                    QuestionTemplateBaseId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionAttribure", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionAttribure_QuestionBase_QuestionBaseId",
                        column: x => x.QuestionBaseId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionAttribure_QuestionTemplateBases_QuestionTemplateBas~",
                        column: x => x.QuestionTemplateBaseId,
                        principalTable: "QuestionTemplateBases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuestionSubgroups",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    GroupId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionSubgroups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionSubgroups_QuestionGroups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "QuestionGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tutorial",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    AddedById = table.Column<string>(nullable: true),
                    GroupId = table.Column<int>(nullable: false),
                    URL = table.Column<string>(nullable: true),
                    Size = table.Column<long>(nullable: false),
                    PDFURL = table.Column<string>(nullable: true),
                    PDFSize = table.Column<long>(nullable: false),
                    VideoURL = table.Column<string>(nullable: true),
                    VideoSize = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tutorial", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tutorial_User_AddedById",
                        column: x => x.AddedById,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tutorial_TutorialsGroup_GroupId",
                        column: x => x.GroupId,
                        principalTable: "TutorialsGroup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClickableQuestionSubgroupRelation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    SubgroupId = table.Column<int>(nullable: false),
                    QuestionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClickableQuestionSubgroupRelation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClickableQuestionSubgroupRelation_QuestionBase_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionBase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClickableQuestionSubgroupRelation_QuestionSubgroups_Subgrou~",
                        column: x => x.SubgroupId,
                        principalTable: "QuestionSubgroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TutorialStep",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Order = table.Column<int>(nullable: false),
                    TutorialId = table.Column<int>(nullable: false),
                    Info = table.Column<string>(nullable: true),
                    URL = table.Column<string>(nullable: true),
                    Size = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorialStep", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TutorialStep_Tutorial_TutorialId",
                        column: x => x.TutorialId,
                        principalTable: "Tutorial",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TutorialTag",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: true),
                    Tag = table.Column<string>(nullable: true),
                    TutorialId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorialTag", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TutorialTag_Tutorial_TutorialId",
                        column: x => x.TutorialId,
                        principalTable: "Tutorial",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChallengePlayer_SessionId",
                table: "ChallengePlayer",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_ChallengeSessions_TemplateId",
                table: "ChallengeSessions",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickableQuestionSubgroupRelation_QuestionId",
                table: "ClickableQuestionSubgroupRelation",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickableQuestionSubgroupRelation_SubgroupId",
                table: "ClickableQuestionSubgroupRelation",
                column: "SubgroupId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickChart_AnswerGroupId",
                table: "ClickChart",
                column: "AnswerGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickChart_AnswerId",
                table: "ClickChart",
                column: "AnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickChart_SimpleClickableQuestionId",
                table: "ClickChart",
                column: "SimpleClickableQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickEquation_SimpleClickableQuestionId",
                table: "ClickEquation",
                column: "SimpleClickableQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickImage_AnswerGroupId",
                table: "ClickImage",
                column: "AnswerGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickImage_AnswerId",
                table: "ClickImage",
                column: "AnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_ClickImage_QuestionId",
                table: "ClickImage",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_AddedById",
                table: "Courses",
                column: "AddedById");

            migrationBuilder.CreateIndex(
                name: "IX_ImageAnswers_GroupId",
                table: "ImageAnswers",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_ImageAnswers_RootId",
                table: "ImageAnswers",
                column: "RootId");

            migrationBuilder.CreateIndex(
                name: "IX_InterpretedImages_GroupId",
                table: "InterpretedImages",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_InterpretedImages_JumpId",
                table: "InterpretedImages",
                column: "JumpId");

            migrationBuilder.CreateIndex(
                name: "IX_InterpretedImages_LeftId",
                table: "InterpretedImages",
                column: "LeftId");

            migrationBuilder.CreateIndex(
                name: "IX_InterpretedImages_RationOfGradientsId",
                table: "InterpretedImages",
                column: "RationOfGradientsId");

            migrationBuilder.CreateIndex(
                name: "IX_InterpretedImages_RightId",
                table: "InterpretedImages",
                column: "RightId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardNumericKeyRelation_KeyboardId",
                table: "KeyboardNumericKeyRelation",
                column: "KeyboardId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardNumericKeyRelation_NumericKeyId",
                table: "KeyboardNumericKeyRelation",
                column: "NumericKeyId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardQuestionAnswer_QuestionId",
                table: "KeyboardQuestionAnswer",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardVariableKeyRelation_KeyboardId",
                table: "KeyboardVariableKeyRelation",
                column: "KeyboardId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyboardVariableKeyRelation_VariableKeyId",
                table: "KeyboardVariableKeyRelation",
                column: "VariableKeyId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionAttribure_QuestionBaseId",
                table: "QuestionAttribure",
                column: "QuestionBaseId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionAttribure_QuestionTemplateBaseId",
                table: "QuestionAttribure",
                column: "QuestionTemplateBaseId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBase_KeyboardId",
                table: "QuestionBase",
                column: "KeyboardId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBase_AddedById",
                table: "QuestionBase",
                column: "AddedById");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBase_LevelOfDifficultyId",
                table: "QuestionBase",
                column: "LevelOfDifficultyId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBase_SubtopicId",
                table: "QuestionBase",
                column: "SubtopicId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionChallengeQuestion_ChallengeTemplateId",
                table: "QuestionChallengeQuestion",
                column: "ChallengeTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionChallengeQuestion_ClickableQuestionId",
                table: "QuestionChallengeQuestion",
                column: "ClickableQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionChallengeQuestion_KeyboardQuestionId",
                table: "QuestionChallengeQuestion",
                column: "KeyboardQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionChallengeSingleResult_PlayerId",
                table: "QuestionChallengeSingleResult",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionChallengeSingleResult_SessionId",
                table: "QuestionChallengeSingleResult",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionGroups_CourseId",
                table: "QuestionGroups",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionSubgroups_GroupId",
                table: "QuestionSubgroups",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionTemplateBases_LevelOfDifficultyId",
                table: "QuestionTemplateBases",
                column: "LevelOfDifficultyId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionTemplateBases_SubtopicId",
                table: "QuestionTemplateBases",
                column: "SubtopicId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "Role",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_RoleId",
                table: "RoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Subtopics_TopicId",
                table: "Subtopics",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_Tutorial_AddedById",
                table: "Tutorial",
                column: "AddedById");

            migrationBuilder.CreateIndex(
                name: "IX_Tutorial_GroupId",
                table: "Tutorial",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialsGroup_CourseId",
                table: "TutorialsGroup",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialStep_TutorialId",
                table: "TutorialStep",
                column: "TutorialId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialTag_TutorialId",
                table: "TutorialTag",
                column: "TutorialId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "User",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "User",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserClaims_UserId",
                table: "UserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLogins_UserId",
                table: "UserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableChar_KeyId",
                table: "VariableKeyVariableChar",
                column: "KeyId");

            migrationBuilder.CreateIndex(
                name: "IX_VariableKeyVariableCharValidValues_CharId",
                table: "VariableKeyVariableCharValidValues",
                column: "CharId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationUsers");

            migrationBuilder.DropTable(
                name: "ClickableQuestionSubgroupRelation");

            migrationBuilder.DropTable(
                name: "ClickChart");

            migrationBuilder.DropTable(
                name: "ClickEquation");

            migrationBuilder.DropTable(
                name: "ClickImage");

            migrationBuilder.DropTable(
                name: "KeyboardNumericKeyRelation");

            migrationBuilder.DropTable(
                name: "KeyboardQuestionAnswer");

            migrationBuilder.DropTable(
                name: "KeyboardVariableKeyRelation");

            migrationBuilder.DropTable(
                name: "QuestionAttribure");

            migrationBuilder.DropTable(
                name: "QuestionChallengeQuestion");

            migrationBuilder.DropTable(
                name: "QuestionChallengeSingleResult");

            migrationBuilder.DropTable(
                name: "RoleClaims");

            migrationBuilder.DropTable(
                name: "TutorialStep");

            migrationBuilder.DropTable(
                name: "TutorialTag");

            migrationBuilder.DropTable(
                name: "UserClaims");

            migrationBuilder.DropTable(
                name: "UserLogins");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "UserTokens");

            migrationBuilder.DropTable(
                name: "VariableKeyVariableCharValidValues");

            migrationBuilder.DropTable(
                name: "QuestionSubgroups");

            migrationBuilder.DropTable(
                name: "InterpretedImages");

            migrationBuilder.DropTable(
                name: "ImageAnswers");

            migrationBuilder.DropTable(
                name: "NumericKeys");

            migrationBuilder.DropTable(
                name: "QuestionTemplateBases");

            migrationBuilder.DropTable(
                name: "QuestionBase");

            migrationBuilder.DropTable(
                name: "ChallengePlayer");

            migrationBuilder.DropTable(
                name: "Tutorial");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "VariableKeyVariableChar");

            migrationBuilder.DropTable(
                name: "QuestionGroups");

            migrationBuilder.DropTable(
                name: "InterpretedImageGroups");

            migrationBuilder.DropTable(
                name: "JumpValues");

            migrationBuilder.DropTable(
                name: "LeftGradientValues");

            migrationBuilder.DropTable(
                name: "RationOfGradientsValues");

            migrationBuilder.DropTable(
                name: "RightGradientValues");

            migrationBuilder.DropTable(
                name: "ImageAnswerGroups");

            migrationBuilder.DropTable(
                name: "Keyboards");

            migrationBuilder.DropTable(
                name: "LevelsOfDifficulty");

            migrationBuilder.DropTable(
                name: "Subtopics");

            migrationBuilder.DropTable(
                name: "ChallengeSessions");

            migrationBuilder.DropTable(
                name: "TutorialsGroup");

            migrationBuilder.DropTable(
                name: "VariableKeys");

            migrationBuilder.DropTable(
                name: "Topics");

            migrationBuilder.DropTable(
                name: "QuestionChallengeTemplates");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
