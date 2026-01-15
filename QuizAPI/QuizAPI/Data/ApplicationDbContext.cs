using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using QuizAPI.Models;
using QuizAPI.Models.Course;
using QuizAPI.Models.DefaultValues.BackgroundImage;
using QuizAPI.Models.DefaultValues.ImageAnswers;
using QuizAPI.Models.DefaultValues.InterpretedImages;
using QuizAPI.Models.DefaultValues.Keyboard;
using QuizAPI.Models.DefaultValues.LevelsOfDifficulty;
using QuizAPI.Models.DefaultValues.QuestionImage;
using QuizAPI.Models.DefaultValues.SeriesButtonImage;
using QuizAPI.Models.Feedback;
using QuizAPI.Models.Information;
using QuizAPI.Models.KeyShare;
using QuizAPI.Models.QuestionChallenges;
using QuizAPI.Models.QuestionGroupsSubgroup;
using QuizAPI.Models.Questionnaire;
using QuizAPI.Models.Questions;
using QuizAPI.Models.Questions.DiagramsQuestion;
using QuizAPI.Models.Questions.EnergyBalanceQuestion;
using QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated;
using QuizAPI.Models.Questions.FreebodyDiagramQuestion;
using QuizAPI.Models.Questions.KeyboardQuestion;
using QuizAPI.Models.Questions.MultipleChoiceQuestion;
using QuizAPI.Models.Questions.PVDiagramQuestion;
using QuizAPI.Models.Questions.QuestionComment;
using QuizAPI.Models.Questions.QuestionSeries;
using QuizAPI.Models.Questions.SimpleClickableQuestion;
using QuizAPI.Models.QuestionTemplates;
using QuizAPI.Models.Topic;
using QuizAPI.Models.Tutorials;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace QuizAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<BaseUser> , IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public DbSet<DataPool> DataPools { get; set; }
        public DbSet<DataPoolAccess> DataPoolAccesses { get; set; }
        public DbSet<KeyShare> KeyShare { get; set; }
        
        public DbSet<UserLinkedPlayerKey> UserLinkedPlayerKeys { get; set; }

        //Information
        public DbSet<Information> Information { get; set; }
        public DbSet<InformationOwner> InformationOwner { get; set; }
        public DbSet<BackgroundImage> BackgroundImage { get; set; }
        public DbSet<CourseMapElementImages> CourseMapElementImages { get; set; }

        //Courses
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseMap> CourseMap { get; set; }
        public DbSet<CourseMapElement> CourseMapElement { get; set; }
        public DbSet<MapElementLink> MapElementLink { get; set; }
        public DbSet<CourseMapElementBadge> CourseMapElementBadge { get; set; }
        public DbSet<CourseMapBadgeSystem> CourseMapBadgeSystem { get; set; }
        public DbSet<CourseMapBadgeSystemEntity> CourseMapBadgeSystemEntity { get; set; }
        public DbSet<CourseMapPDFStatistics> CourseMapPDFStatistics { get; set; }
        public DbSet<CourseMapLinkStatistics> CourseMapLinkStatistics { get; set; }

        public DbSet<CourseMapKey> CourseMapKeys { get; set; }

        //Topics
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Subtopic> Subtopics { get; set; }

        //Question Groups
        public DbSet<QuestionGroup> QuestionGroups { get; set; }
        public DbSet<QuestionSubgroup> QuestionSubgroups { get; set; }

        //Levels Of Difficulty
        public DbSet<LevelOfDifficulty> LevelsOfDifficulty { get; set; }

        //Image Answers
        public DbSet<ImageAnswerGroup> ImageAnswerGroups { get; set; }
        public DbSet<ImageAnswer> ImageAnswers { get; set; }

        //Interpreted Images
        public DbSet<InterpretedImageGroup> InterpretedImageGroups { get; set; }
        public DbSet<LeftGradientValue> LeftGradientValues { get; set; }
        public DbSet<RightGradientValue> RightGradientValues { get; set; }
        public DbSet<RationOfGradientsValue> RationOfGradientsValues { get; set; }
        public DbSet<JumpValue> JumpValues { get; set; }
        public DbSet<InterpretedImage> InterpretedImages { get; set; }

        //Keyboard
        public DbSet<Keyboard> Keyboards { get; set; }
        public DbSet<KeyboardNumericKey> NumericKeys { get; set; }
        public DbSet<KeyboardVariableKey> VariableKeys { get; set; }
        
        public DbSet<KeysList> KeysLists { get; set; }

        //Tutorials
        public DbSet<TutorialsGroup> TutorialsGroup { get; set; }
        public DbSet<Tutorial> Tutorial { get; set; }
        public DbSet<TutorialTag> TutorialTag { get; set; }

        //ApplicationUsers
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }

        //Question
        public DbSet<QuestionBase> QuestionBase { get; set; }
        public DbSet<QuestionStatistic> QuestionStatistic { get; set; }
        public DbSet<QuestionPDFStatistic> QuestionPDFStatistic { get; set; }
        
        public DbSet<QuestionCommentSection> QuestionCommentSection { get; set; }
        public DbSet<QuestionComment> QuestionComments { get; set; }
        public DbSet<QuestionCommentTag> QuestionCommentTags { get; set; }
        public DbSet<QuestionCommentSectionTag> QuestionCommentSectionTags { get; set; }

        //Simple Clickable Questions
        public DbSet<SimpleClickableQuestion> SimpleClickableQuestions { get; set; }
        
        public DbSet<ClickImage> ClickImage { get; set; }
        public DbSet<ClickChart> ClickChart { get; set; }

        //Keyboard Questions
        public DbSet<KeyboardQuestion> KeyboardQuestion { get; set; }
        public DbSet<QuestionSeries> QuestionSeries { get; set; }
        public DbSet<QuestionSeriesElement> QuestionSeriesElement { get; set; }
        public DbSet<QuestionSeriesStatistic> QuestionSeriesStatistic { get; set; }

        public DbSet<Questionnaire> Questionnaires { get; set; }
        public DbSet<QuestionnaireQuestion> QuestionnaireQuestion { get; set; }
        public DbSet<QuestionnaireQuestionChoice> QuestionnaireQuestionChoice { get; set; }
        public DbSet<QuestionnaireStatisticInstanceBase> QuestionnaireStatisticInstanceBase { get; set; }
        
        public DbSet<QuestionnaireSeriesRelation> QuestionnaireSeriesRelation { get; set; }
        public DbSet<QuestionnaireMapElementRelation> QuestionnaireMapElementRelation { get; set; }

        public DbSet<KeyboardQuestionAnswer> KeyboardQuestionAnswer { get; set; }
        public DbSet<KeyboardQuestionAnswerStatistic> KeyboardQuestionAnswerStatistic { get; set; }

        //Multiple Choice Questions
        public DbSet<MultipleChoiceQuestion> MultipleChoiceQuestion { get; set; }

        //Diagram Questions
        public DbSet<DiagramQuestion> DiagramQuestions { get; set; }

        //EB Questions
        public DbSet<EnergyBalanceQuestion> EnergyBalanceQuestion { get; set; }
        public DbSet<EB_Answer> EB_Answer { get; set; }

        public DbSet<EnergyBalanceQuestionUpdated> EnergyBalanceQuestionUpdated { get; set; }
        public DbSet<EnergyBalanceQuestion_EBTerm> EnergyBalanceQuestion_EBTerm { get; set; }
        public DbSet<EnergyBalanceQuestion_EBTerm_Question> EnergyBalanceQuestion_EBTerm_Question { get; set; }
        public DbSet<EnergyBalanceQuestion_GeneralAnswer> EnergyBalanceQuestion_GeneralAnswers { get; set; }

        public DbSet<FreebodyDiagramQuestion> FreebodyDiagramQuestion { get; set; }
        public DbSet<FreebodyDiagramQuestion_VectorTerm> FreebodyDiagramQuestion_VectorTerm { get; set; }
        public DbSet<FreebodyDiagramQuestion_FBD> FreebodyDiagramQuestion_FBD { get; set; }

        public DbSet<DiagramQuestion> DiagramQuestion { get; set; }
        public DbSet<DiagramQuestion_Plot> DiagramQuestionPlot { get; set; }
        public DbSet<DiagramQuestion_Section> DiagramQuestionSection { get; set; }
        public DbSet<DiagramQuestion_SectionRelations> DiagramQuestionSectionRelation { get; set; }

        //PV Diagram 
        public DbSet<PVDiagramQuestion> PVDiagramQuestion { get; set; }
        public DbSet<PVDiagramQuestion_Group> PVDiagramQuestion_Group { get; set; }

        public DbSet<PVDiagramQuestion_Point> PVDiagramQuestionPoint { get; set; }
        public DbSet<PVDiagramQuestion_Relation> PVDiagramQuestionRelation { get; set; }


        //Challenges
        public DbSet<QuestionChallengeTemplate> QuestionChallengeTemplates { get; set; }
        public DbSet<ChallengeSession> ChallengeSessions { get; set; }

        //Question Templates
        public DbSet<QuestionTemplateBase> QuestionTemplateBases { get; set; }

        //Question Image
        public DbSet<QuestionImage> QuestionImages { get; set; }
        public DbSet<SeriesButtonImage> SeriesButtonImages { get; set; }
        public DbSet<FeedbackQuestion> QuestionFeedback { get; set; }
        public DbSet<FeedbackQuestionEvent> FeedbackQuestionEvent { get; set; }
        
        public DbSet<DatapoolNotificationSubscription> DatapoolNotificationSubscriptions { get; set; }
        

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
          : base(options)
        {

        }


        public ApplicationDbContext()
        {

        }

        public ApplicationDbContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            builder.UseNpgsql(connectionString);
            return new ApplicationDbContext(builder.Options);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Rename the default ASP user and roles
            SetIdenetityTablesName(builder);

           
            //Keyboar Keys Relation
            KeyboardKeysSetup(builder);

            //Map element attachment
            MapElementAttachmentSetup(builder);

            MapElementGroupRelationSetup(builder);

            //LOD - QUESTION BASE RELATION
            builder.Entity<LevelOfDifficulty>()
            .HasMany(l => l.Questions)
            .WithOne(q => q.LevelOfDifficulty);

            builder.Entity<QuestionBase>()
           .HasOne(e => e.LevelOfDifficulty)
           .WithMany(c => c.Questions);

            builder.Entity<QuestionBase>()
            .HasOne(a => a.CommentSection).WithOne(b => b.Question)
            .HasForeignKey<QuestionCommentSection>(e => e.QuestionId);

            //Questionnaire series relation
            builder.Entity<QuestionnaireSeriesRelation>()
            .HasOne(a => a.Questionnaire)
            .WithMany(q => q.Relations);

            builder.Entity<QuestionnaireSeriesRelation>()
            .HasOne(a => a.Series)
            .WithOne(q => q.QuestionnaireRelation)
            .HasForeignKey<QuestionnaireSeriesRelation>(a => a.SeriesId);

            //Questionnaire map element relation
            builder.Entity<QuestionnaireMapElementRelation>()
            .HasOne(a => a.Questionnaire)
            .WithMany(q => q.MapElementRelations);

            builder.Entity<QuestionnaireMapElementRelation>()
            .HasOne(a => a.MapElement)
            .WithOne(q => q.QuestionnaireRelation)
            .HasForeignKey<QuestionnaireMapElementRelation>(a => a.MapElementId);

        }

        /*private void KeyboardQuestionAnswerSetup(ModelBuilder builder)
        {
            builder.Entity<KeyboardQuestionAnswer>()
                .HasOne(a => a.Question)
                .WithOne(q => q.Answer)
                .HasForeignKey<KeyboardQuestionAnswer>(a => a.QuestionId);
        }*/

        private void KeyboardKeysSetup(ModelBuilder builder)
        {
            builder.Entity<KeyboardNumericKeyRelation>()
                .HasOne(r => r.Keyboard)
                .WithMany(k => k.NumericKeys)
                .HasForeignKey(r => r.KeyboardId);

            builder.Entity<KeyboardNumericKeyRelation>()
               .HasOne(r => r.NumericKey)
               .WithMany(k => k.Relations)
               .HasForeignKey(r => r.NumericKeyId);

            builder.Entity<KeyboardVariableKeyRelation>()
                .HasOne(r => r.Keyboard)
                .WithMany(k => k.VariableKeys)
                .HasForeignKey(r => r.KeyboardId);

            builder.Entity<KeyboardVariableKeyRelation>()
               .HasOne(r => r.VariableKey)
               .WithMany(k => k.Relations)
               .HasForeignKey(r => r.VariableKeyId);

        }

        private void MapElementAttachmentSetup(ModelBuilder builder)
        {
            builder.Entity<MapElementLink>()
                .HasOne(r => r.Element)
                .WithOne(k => k.MapAttachment)
                .HasForeignKey<MapElementLink>(r => r.ElementId);

            builder.Entity<MapElementLink>()
               .HasOne(r => r.Map)
               .WithMany(k => k.Attachments);

        }

        private void MapElementGroupRelationSetup(ModelBuilder builder)
        {
            builder.Entity<CourseMapRequiredElementRelation>()
                .HasOne(r => r.BaseElement)
                .WithMany(e => e.Relations)
                .HasForeignKey(r => r.BaseElementId);
        }


        /*private void CourseProfessorSetup(ModelBuilder builder)
       {
          builder.Entity<CourseProfessor>()
               .HasOne(cp => cp.Course)
               .WithMany(c => c.AssignedProfessors)
               .HasForeignKey(cp => cp.CourseId);

           builder.Entity<CourseProfessor>()
               .HasOne(cp => cp.Professor)
               .WithMany(p => p.AssignedCourses)
               .HasForeignKey(cp => cp.ProfessorId);
        }*/

        private void SetIdenetityTablesName(ModelBuilder builder)
        {
            builder.Entity<BaseUser>(entity =>
            {
                entity.ToTable(name: "User");
            });

            builder.Entity<IdentityRole>(entity =>
            {
                entity.ToTable(name: "Role");
            });
            builder.Entity<IdentityUserRole<string>>(entity =>
            {
                entity.ToTable("UserRoles");
                //in case you chagned the TKey type
                //  entity.HasKey(key => new { key.UserId, key.RoleId });
            });

            builder.Entity<IdentityUserClaim<string>>(entity =>
            {
                entity.ToTable("UserClaims");
            });

            builder.Entity<IdentityUserLogin<string>>(entity =>
            {
                entity.ToTable("UserLogins");
                //in case you chagned the TKey type
                //  entity.HasKey(key => new { key.ProviderKey, key.LoginProvider });       
            });

            builder.Entity<IdentityRoleClaim<string>>(entity =>
            {
                entity.ToTable("RoleClaims");

            });

            builder.Entity<IdentityUserToken<string>>(entity =>
            {
                entity.ToTable("UserTokens");
                //in case you chagned the TKey type
                // entity.HasKey(key => new { key.UserId, key.LoginProvider, key.Name });

            });
        }

        /** Set the update time and creat time automatic for all classes extends Base*/

        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            AddTimestamps();
            return await base.SaveChangesAsync(cancellationToken);
        }

        public override EntityEntry<TEntity> Remove<TEntity>(TEntity entity)
        {
            if (entity is BaseEntity)
            {
                BaseEntity b = entity as BaseEntity;
            }

            return base.Remove(entity);
        }

        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries().Where(x =>
                x.Entity is BaseEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));


            foreach (var entity in entities)
            {
                if (entity.State == EntityState.Added)
                {
                    ((BaseEntity)entity.Entity).DateCreated = DateTime.Now;
                }
                ((BaseEntity)entity.Entity).DateModified = DateTime.Now;
            }

            var notifications = ChangeTracker.Entries().Where(x =>
                x.Entity is DatapoolNotificationSubscription && (x.State == EntityState.Added || x.State == EntityState.Modified));


            foreach (var notification in notifications)
            {
                if (notification.State == EntityState.Added)
                {
                    ((DatapoolNotificationSubscription)notification.Entity).DateCreated = DateTime.Now;
                }
            }
        }
    }
}
