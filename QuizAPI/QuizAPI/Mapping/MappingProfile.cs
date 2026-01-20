using AutoMapper;
using QuizAPI.Models;
using QuizAPI.Models.Course;
using QuizAPI.Models.Course.ViewModels;
using QuizAPI.Models.DefaultValues.BackgroundImage;
using QuizAPI.Models.DefaultValues.ImageAnswers;
using QuizAPI.Models.DefaultValues.ImageAnswers.ViewModels;
using QuizAPI.Models.DefaultValues.InterpretedImages;
using QuizAPI.Models.DefaultValues.InterpretedImages.ViewModel;
using QuizAPI.Models.DefaultValues.Keyboard;
using QuizAPI.Models.DefaultValues.Keyboard.ViewModels;
using QuizAPI.Models.DefaultValues.QuestionImage;
using QuizAPI.Models.DefaultValues.SeriesButtonImage;
using QuizAPI.Models.Feedback;
using QuizAPI.Models.Information;
using QuizAPI.Models.Information.ViewModels;
using QuizAPI.Models.KeyShare;
using QuizAPI.Models.Ownership;
using QuizAPI.Models.Ownership.ClickTrees;
using QuizAPI.Models.Ownership.ViewModels;
using QuizAPI.Models.QuestionGroupsSubgroup;
using QuizAPI.Models.QuestionGroupsSubgroup.ViewModels;
using QuizAPI.Models.Questionnaire;
using QuizAPI.Models.Questions;
using QuizAPI.Models.Questions.ViewModels;
using QuizAPI.Models.Questions.DiagramsQuestion;
using QuizAPI.Models.Questions.DiagramsQuestion.ViewModals;
using QuizAPI.Models.Questions.EnergyBalanceQuestion;
using QuizAPI.Models.Questions.EnergyBalanceQuestion.ViewModels;
using QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated;
using QuizAPI.Models.Questions.EnergyBalanceQuestionUpdated.ViewModels;
using QuizAPI.Models.Questions.FreebodyDiagramQuestion;
using QuizAPI.Models.Questions.FreebodyDiagramQuestion.ViewModels;
using QuizAPI.Models.Questions.KeyboardQuestion;
using QuizAPI.Models.Questions.KeyboardQuestion.ViewModels;
using QuizAPI.Models.Questions.MultipleChoiceQuestion;
using QuizAPI.Models.Questions.MultipleChoiceQuestion.ViewModels;
using QuizAPI.Models.Questions.PVDiagramQuestion;
using QuizAPI.Models.Questions.QuestionComment;
using QuizAPI.Models.Questions.QuestionSeries;
using QuizAPI.Models.Questions.QuestionSeries.ViewModels;
using QuizAPI.Models.Questions.SimpleClickableQuestion;
using QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels;
using QuizAPI.Models.Topic;
using QuizAPI.Models.Topic.ViewModels;
using QuizAPI.Models.Tutorials;
using QuizAPI.Models.Tutorials.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Mapping
{
    public class MappingProfile : Profile
    {
        public const string FILES_PATH = "http://167.86.98.171:6001/Files/";//"http://localhost:54062/Files/";//

        public MappingProfile()
        {

            CreateMap<QuestionImage, QuestionImageViewModel>()
             .ForMember(vm => vm.ImageURL, opt => opt.MapFrom(i => i.ImageURL != null ? $"{FILES_PATH}/{i.ImageURL}" : ""))
             .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name));

            CreateMap<SeriesButtonImage, SeriesButtonImageViewModel>()
            .ForMember(vm => vm.ExitImageURL, opt => opt.MapFrom(i => i.ExitImageURL != null ? $"{FILES_PATH}/{i.ExitImageURL}" : ""))
            .ForMember(vm => vm.ExitImageURL, opt => opt.MapFrom(i => i.ClearImageURL != null ? $"{FILES_PATH}/{i.ClearImageURL}" : ""))
            .ForMember(vm => vm.ExitImageURL, opt => opt.MapFrom(i => i.SubmitImageURL != null ? $"{FILES_PATH}/{i.SubmitImageURL}" : ""))
            .ForMember(vm => vm.ExitImageURL, opt => opt.MapFrom(i => i.ContinueImageURL != null ? $"{FILES_PATH}/{i.ContinueImageURL}" : ""))
            .ForMember(vm => vm.ExitImageURL, opt => opt.MapFrom(i => i.PDFImageURL != null ? $"{FILES_PATH}/{i.PDFImageURL}" : ""))

            .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name));

            CreateMap<SeriesButtonImage, SeriesButtonImageViewModel>()
           .ForMember(vm => vm.ExitImageURL, opt => opt.MapFrom(i => i.ExitImageURL != null ? $"{FILES_PATH}/{i.ExitImageURL}" : ""))
           .ForMember(vm => vm.ClearImageURL, opt => opt.MapFrom(i => i.ClearImageURL != null ? $"{FILES_PATH}/{i.ClearImageURL}" : ""))
           .ForMember(vm => vm.SubmitImageURL, opt => opt.MapFrom(i => i.SubmitImageURL != null ? $"{FILES_PATH}/{i.SubmitImageURL}" : ""))
           .ForMember(vm => vm.ContinueImageURL, opt => opt.MapFrom(i => i.ContinueImageURL != null ? $"{FILES_PATH}/{i.ContinueImageURL}" : ""))
           .ForMember(vm => vm.PDFImageURL, opt => opt.MapFrom(i => i.PDFImageURL != null ? $"{FILES_PATH}/{i.PDFImageURL}" : ""));


            CreateMap<Tutorial, TutorialViewModel>()
                .ForMember(tvm => tvm.Tags, opt => opt.MapFrom(t => t.Tags
                                                    .Select(tag => tag.Tag)));

            CreateMap<Keyboard, KeyboardViewModel>()
                .ForMember(vm => vm.NumericKeys, opt => opt.MapFrom(k => k.NumericKeys))
                .ForMember(vm => vm.VariableKeys, opt => opt.MapFrom(k => k.VariableKeys))
                .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
                .ForMember(gvm => gvm.Owners, opt => opt.MapFrom(g => g.Owners.Select(o => new OwnerInfoViewModel()
                {
                     Name = o.Owner.Name,
                     Email = o.Owner.Email,
                     ProfilePicture = o.Owner.ProfilePicture != null ? $"{FILES_PATH}/{o.Owner.ProfilePicture}" : null
                })));

            CreateMap<KeyboardVariableKey, KeyboardVariableKeyViewModel>()
                .ForMember(vm => vm.ImagePresentation, opt => opt.MapFrom(i => i.ImagePresentation != null ? $"{FILES_PATH}/{ i.ImagePresentation}" : null))
                .ForMember(vm => vm.VImages, opt => opt.MapFrom(i => i.Images));

            CreateMap<KeyboardNumericKey, KeyboardNumericKeyViewModel>()
               .ForMember(vm => vm.URL, opt => opt.MapFrom(c => c.URL != null ? $"{FILES_PATH}/{c.URL}" : ""));

            
            CreateMap<CourseMapElementBadge, CourseMapElementBadgeViewModel>()
               .ForMember(vm => vm.URL, opt => opt.MapFrom(c => c.URL != null ? $"{FILES_PATH}/{c.URL}" : ""));

            CreateMap<VariableKeyVariableCharValidValuesGroupChoiceImage, VariableKeyVariableCharValidValuesGroupChoiceImageViewModel>()
              .ForMember(vm => vm.URL, opt => opt.MapFrom(c => c.URL != null ? $"{FILES_PATH}/{c.URL}" : ""))
              .ForMember(vm => vm.AnswerElements, opt => opt.MapFrom(c => c.AnswerElements.Count));

            CreateMap<KeyboardVariableKeyImageRelation, KeyboardVariableKeyImageRelationViewModel>()
             .ForMember(vm => vm.ReplacementCharacter, opt => opt.MapFrom(c => c.ReplacementCharacter));

            CreateMap<KeyShare, KeyShareViewModel>();

            CreateMap<QuestionBase, QuestionBaseViewModel>()
               .ForMember(vm => vm.EditedByName, opt => opt.MapFrom(c => c.EditedBy != null ? c.EditedBy.Name :""))
               .ForMember(vm => vm.Base_ImageURL, opt => opt.MapFrom(c => c.Base_ImageURL != null ? $"{FILES_PATH}/{c.Base_ImageURL}" : ""))
               .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(c => c.PDFURL != null ? $"{FILES_PATH}/{c.PDFURL}" : ""))
               .ForMember(vm => vm.VIDEOURL, opt => opt.MapFrom(c => c.VIDEOURL != null ? $"{FILES_PATH}/{c.VIDEOURL}" : ""))
               .ForMember(vm => vm.Extension, opt => opt.MapFrom(c => c.QuestionMap31Extension));

            CreateMap<QuestionMap31Extension, QuestionMap31ExtensionViewModel>();

            CreateMap<Course, CourseViewModel>()
                .ForMember(vm => vm.URL, opt => opt.MapFrom(c => c.URL != null ? $"{FILES_PATH}/{c.URL}" : ""))
                .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
                .ForMember(gvm => gvm.Owners, opt => opt.MapFrom(g => g.Owners.Where(o => o.Owner != null).Select(o => new OwnerInfoViewModel()
                {
                    Name = o.Owner.Name,
                    Email = o.Owner.Email,
                    ProfilePicture = o.Owner.ProfilePicture != null ? $"{FILES_PATH}/{o.Owner.ProfilePicture}" : null
                })));

            CreateMap<CourseMap, CourseMapViewModel>()
               .ForMember(vm => vm.LargeMapURL, opt => opt.MapFrom(c => c.LargeMapURL != null ? $"{FILES_PATH}/{c.LargeMapURL}" : ""));
           
            CreateMap<CourseMap, CourseMapView2Model>()
             .ForMember(vm => vm.LargeMapURL, opt => opt.MapFrom(c => c.LargeMapURL != null ? $"{FILES_PATH}/{c.LargeMapURL}" : ""));

            CreateMap<ClickImage, ClickImageViewModel>()
             .ForMember(vm => vm.BackgroundImage, opt => opt.MapFrom(c => !string.IsNullOrEmpty(c.BackgroundImage) ? $"{FILES_PATH}/{c.BackgroundImage}" : ""));

            CreateMap<ClickChart, ClickChartViewModel>()
             .ForMember(vm => vm.BackgroundImage, opt => opt.MapFrom(c => !string.IsNullOrEmpty(c.BackgroundImage) ? $"{FILES_PATH}/{c.BackgroundImage}" : ""));

            CreateMap<EB_ClickablePart, EB_ClickablePartViewModel>()
             .ForMember(vm => vm.BackgroundImage, opt => opt.MapFrom(c => !string.IsNullOrEmpty(c.BackgroundImage) ? $"{FILES_PATH}/{c.BackgroundImage}" : ""));


            CreateMap<CourseMap, CourseMap_SIMPLEViewModel>()
              .ForMember(vm => vm.LargeMapURL, opt => opt.MapFrom(c => c.LargeMapURL != null ? $"{FILES_PATH}/{c.LargeMapURL}" : ""));

            CreateMap<Questionnaire, QuestionnaireViewModel>()
                .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
                       .ForMember(vm => vm.ImageURL, opt => opt.MapFrom(c => c.ImageURL != null ? $"{FILES_PATH}/{c.ImageURL}" : ""));

            CreateMap<QuestionnaireQuestion, QuestionnaireQuestionViewModel>()
           .ForMember(vm => vm.ImageURL, opt => opt.MapFrom(c => c.ImageURL != null ? $"{FILES_PATH}/{c.ImageURL}" : ""));

            CreateMap<QuestionnaireQuestionChoice, QuestionnaireQuestionChoiceViewModel>()
           .ForMember(vm => vm.ImageURL, opt => opt.MapFrom(c => c.ImageURL != null ? $"{FILES_PATH}/{c.ImageURL}" : ""));


            CreateMap<CourseMapBadgeSystemEntity, CourseMapBadgeSystemEntityViewModel>()
               .ForMember(vm => vm.URL, opt => opt.MapFrom(c => c.URL != null ? $"{FILES_PATH}/{c.URL}" : ""));


            CreateMap<CourseMapElement, CourseMapElementViewModel>()
              .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(c => c.PDFURL != null ? $"{FILES_PATH}/{c.PDFURL}" : ""))
              .ForMember(vm => vm.AudioURL, opt => opt.MapFrom(c => c.AudioURL != null ? $"{FILES_PATH}/{c.AudioURL}" : ""))
              .ForMember(vm => vm.VideoURL, opt => opt.MapFrom(c => c.VideoURL != null ? $"{FILES_PATH}/{c.VideoURL}" : ""))
              .ForMember(vm => vm.BackgroundImage, opt => opt.MapFrom(c => !string.IsNullOrEmpty(c.BackgroundImage) ? $"{FILES_PATH}/{c.BackgroundImage}" : ""));

            CreateMap<CourseMapElement, CourseMapElement_Statistics_ViewModel>()
             .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(c => c.PDFURL != null ? $"{FILES_PATH}/{c.PDFURL}" : ""))
             .ForMember(vm => vm.AudioURL, opt => opt.MapFrom(c => c.AudioURL != null ? $"{FILES_PATH}/{c.AudioURL}" : ""))
             .ForMember(vm => vm.VideoURL, opt => opt.MapFrom(c => c.VideoURL != null ? $"{FILES_PATH}/{c.VideoURL}" : ""))
             .ForMember(vm => vm.BackgroundImage, opt => opt.MapFrom(c => !string.IsNullOrEmpty(c.BackgroundImage) ? $"{FILES_PATH}/{c.BackgroundImage}" : ""));

            CreateMap<CourseMapRequiredElementRelation, CourseMapRequiredElementRelationViewModel>();

            CreateMap<QuestionGroup, QuestionGroupViewModel>()
                .ForMember(vm => vm.URL, opt => opt.MapFrom(g => g.URL != null ? $"{FILES_PATH}/{g.URL}" : ""));

            CreateMap<KeyboardQuestionAnswerElement, KeyboardQuestionAnswerElementViewModel>()
                .ForMember(vm => vm.Image, opt => opt.MapFrom(g => g.Image.Image.URL != null ? $"{FILES_PATH}/{g.Image.Image.URL}" : ""))
                .ForMember(vm => vm.NumericKeyImage, opt => opt.MapFrom(g => g.NumericKey.NumericKey.URL != null ? $"{FILES_PATH}/{g.NumericKey.NumericKey.URL}" : ""))
                .ForMember(vm => vm.Width, opt => opt.MapFrom(g => g.NumericKeyId != null ? g.NumericKey.NumericKey.Width : g.Image.Image.Width))
                .ForMember(vm => vm.Height, opt => opt.MapFrom(g => g.NumericKeyId != null ? g.NumericKey.NumericKey.Height : g.Image.Image.Height))
                .ForMember(vm => vm.TextPresentation, opt => opt.MapFrom(g => g.NumericKeyId != null ? g.NumericKey.NumericKey.TextPresentation : g.Image.Image.TextPresentation))
                .ForMember(vm => vm.IsInteger, opt => opt.MapFrom(g => g.NumericKeyId != null ? g.NumericKey.NumericKey.IsInteger : false));

            CreateMap<InterpretedImage, InterpretedImageViewModel>()
                .ForMember(vm => vm.URL, opt => opt.MapFrom(i => i.URL != null ? $"{FILES_PATH}/{i.URL}" : ""));

            CreateMap<ImageAnswer, ImageAnswerViewModel>()
                .ForMember(vm => vm.URL, opt => opt.MapFrom(i => i.URL != null ? $"{FILES_PATH}/{i.URL}" : ""));

            CreateMap<SimpleClickableQuestion, SimpleClickableQuestionViewModel>()
                .ForMember(vm => vm.Base_ImageURL, opt => opt.MapFrom(i => i.Base_ImageURL != null ? $"{FILES_PATH}/{i.Base_ImageURL}" : ""))
                .ForMember(vm => vm.BackgroundImageURL, opt => opt.MapFrom(i => i.BackgroundImageURL != null ? $"{FILES_PATH}/{i.BackgroundImageURL}" : ""))
                .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(i => i.PDFURL != null ? $"{FILES_PATH}/{i.PDFURL}" : ""))
                .ForMember(vm => vm.VIDEOURL, opt => opt.MapFrom(i => i.VIDEOURL != null ? $"{FILES_PATH}/{i.VIDEOURL}" : ""))
                .ForMember(vm => vm.Extension, opt => opt.MapFrom(c => c.QuestionMap31Extension));

            CreateMap<PVDiagramQuestion, PVDiagramQuestionViewModel>()
                .ForMember(vm => vm.Base_ImageURL, opt => opt.MapFrom(i => i.Base_ImageURL != null ? $"{FILES_PATH}/{i.Base_ImageURL}" : ""))
                .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(i => i.PDFURL != null ? $"{FILES_PATH}/{i.PDFURL}" : ""));
            
            CreateMap<EnergyBalanceQuestion, EnergyBalanceQuestionViewModel>()
              .ForMember(vm => vm.Base_ImageURL, opt => opt.MapFrom(c => c.Base_ImageURL != null ? $"{FILES_PATH}/{c.Base_ImageURL}" : ""))
              .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(i => i.PDFURL != null ? $"{FILES_PATH}/{i.PDFURL}" : ""))
              .ForMember(vm => vm.VIDEOURL, opt => opt.MapFrom(i => i.VIDEOURL != null ? $"{FILES_PATH}/{i.VIDEOURL}" : ""));

            CreateMap<EnergyBalanceQuestionUpdated, EnergyBalanceQuestionUpdatedViewModel>()
              .ForMember(vm => vm.Base_ImageURL, opt => opt.MapFrom(c => c.Base_ImageURL != null ? $"{FILES_PATH}/{c.Base_ImageURL}" : ""))
              .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(i => i.PDFURL != null ? $"{FILES_PATH}/{i.PDFURL}" : ""))
              .ForMember(vm => vm.VIDEOURL, opt => opt.MapFrom(i => i.VIDEOURL != null ? $"{FILES_PATH}/{i.VIDEOURL}" : ""));

            CreateMap<EnergyBalanceQuestion_GeneralAnswerElement, EnergyBalanceQuestion_GeneralAnswerElementViewModel>()
               .ForMember(vm => vm.Image, opt => opt.MapFrom(g => g.Image.Image.URL != null ? $"{FILES_PATH}/{g.Image.Image.URL}" : ""))
               .ForMember(vm => vm.NumericKeyImage, opt => opt.MapFrom(g => g.NumericKey.NumericKey.URL != null ? $"{FILES_PATH}/{g.NumericKey.NumericKey.URL}" : ""))
               .ForMember(vm => vm.Width, opt => opt.MapFrom(g => g.NumericKeyId != null ? g.NumericKey.NumericKey.Width : g.Image.Image.Width))
               .ForMember(vm => vm.Height, opt => opt.MapFrom(g => g.NumericKeyId != null ? g.NumericKey.NumericKey.Height : g.Image.Image.Height))
               .ForMember(vm => vm.TextPresentation, opt => opt.MapFrom(g => g.NumericKeyId != null ? g.NumericKey.NumericKey.TextPresentation : g.Image.Image.TextPresentation))
               .ForMember(vm => vm.IsInteger, opt => opt.MapFrom(g => g.NumericKeyId != null ? g.NumericKey.NumericKey.IsInteger : false));
            
            CreateMap<DatapoolNotificationSubscription, DatapoolNotificationSubscriptionViewModel>()
             .ForMember(vm => vm.User, opt => opt.MapFrom(c => c.User.Name));


            CreateMap<EnergyBalanceQuestion_ControlVolume, EnergyBalanceQuestion_ControlVolumeViewModel>()
             .ForMember(vm => vm.ImageURL, opt => opt.MapFrom(c => c.ImageURL != null ? $"{FILES_PATH}/{c.ImageURL}" : ""));

            CreateMap<EB_BoundryCondition, EB_BoundryConditionViewModel>();

            CreateMap<EB_AnswerElement, EB_AnswerElementViewModel>()
               .ForMember(vm => vm.Image, opt => opt.MapFrom(g => g.Image.Image.URL != null ? $"{FILES_PATH}/{g.Image.Image.URL}" : ""))
               .ForMember(vm => vm.NumericKeyImage, opt => opt.MapFrom(g => g.NumericKey.NumericKey.URL != null ? $"{FILES_PATH}/{g.NumericKey.NumericKey.URL}" : ""))
               .ForMember(vm => vm.Width, opt => opt.MapFrom(g => g.NumericKey != null ? g.NumericKey.NumericKey.Width : g.Image.Image.Width))
               .ForMember(vm => vm.Height, opt => opt.MapFrom(g => g.NumericKey != null ? g.NumericKey.NumericKey.Height : g.Image.Image.Height))
               .ForMember(vm => vm.TextPresentation, opt => opt.MapFrom(g =>g.NumericKey != null ? g.NumericKey.NumericKey.TextPresentation : g.Image.Image.TextPresentation))
               .ForMember(vm => vm.IsInteger, opt => opt.MapFrom(g => g.NumericKey != null ? g.NumericKey.NumericKey.IsInteger : false));

            CreateMap<FreebodyDiagramQuestion, FreebodyDiagramQuestionViewModel>()
              .ForMember(vm => vm.Base_ImageURL, opt => opt.MapFrom(c => c.Base_ImageURL != null ? $"{FILES_PATH}/{c.Base_ImageURL}" : ""))
              .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(i => i.PDFURL != null ? $"{FILES_PATH}/{i.PDFURL}" : ""))
              .ForMember(vm => vm.VIDEOURL, opt => opt.MapFrom(i => i.VIDEOURL != null ? $"{FILES_PATH}/{i.VIDEOURL}" : ""));

            CreateMap<FreebodyDiagramQuestion_GeneralAnswerElement, FreebodyDiagramQuestion_GeneralAnswerElementViewModel>()
               .ForMember(vm => vm.Image, opt => opt.MapFrom(g => g.Image.Image.URL != null ? $"{FILES_PATH}/{g.Image.Image.URL}" : ""))
               .ForMember(vm => vm.NumericKeyImage, opt => opt.MapFrom(g => g.NumericKey.NumericKey.URL != null ? $"{FILES_PATH}/{g.NumericKey.NumericKey.URL}" : ""))
               .ForMember(vm => vm.Width, opt => opt.MapFrom(g => g.NumericKey != null ? g.NumericKey.NumericKey.Width : g.Image.Image.Width))
               .ForMember(vm => vm.Height, opt => opt.MapFrom(g => g.NumericKey != null ? g.NumericKey.NumericKey.Height : g.Image.Image.Height))
               .ForMember(vm => vm.TextPresentation, opt => opt.MapFrom(g => g.NumericKey != null ? g.NumericKey.NumericKey.TextPresentation : g.Image.Image.TextPresentation))
               .ForMember(vm => vm.IsInteger, opt => opt.MapFrom(g => g.NumericKey != null ? g.NumericKey.NumericKey.IsInteger : false));


            CreateMap<DiagramQuestion_SectionViewModel, DiagramQuestion_Section>()
                .ForMember((s) => s.DataPool, opt => opt.Ignore())
                .ForMember((s) => s.Plot, opt => opt.Ignore())
                .ForMember((s) => s.PlotId, opt => opt.Ignore())
                .ForMember((s) => s.Information, opt => opt.Ignore())
                .ForMember((s) => s.InformationId, opt => opt.Ignore());

            CreateMap<DiagramQuestion, DiagramQuestionViewModel>()
              .ForMember(vm => vm.Base_ImageURL, opt => opt.MapFrom(c => c.Base_ImageURL != null ? $"{FILES_PATH}/{c.Base_ImageURL}" : ""))
              .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(i => i.PDFURL != null ? $"{FILES_PATH}/{i.PDFURL}" : ""))
              .ForMember(vm => vm.VIDEOURL, opt => opt.MapFrom(i => i.VIDEOURL != null ? $"{FILES_PATH}/{i.VIDEOURL}" : ""));


            CreateMap<KeyboardQuestion, KeyboardQuestionViewModel>()
                .ForMember(vm => vm.ImageURL, opt => opt.MapFrom(i => i.ImageURL != null ? $"{FILES_PATH}/{i.ImageURL}" : ""))
                .ForMember(vm => vm.Base_ImageURL, opt => opt.MapFrom(i => i.ImageURL != null ? $"{FILES_PATH}/{i.ImageURL}" : ""))
                .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(i => i.PDFURL != null ? $"{FILES_PATH}/{i.PDFURL}" : ""))
                .ForMember(vm => vm.VIDEOURL, opt => opt.MapFrom(i => i.VIDEOURL != null ? $"{FILES_PATH}/{i.VIDEOURL}" : ""))
                .ForMember(vm => vm.AnswerForLatex, opt => opt.MapFrom(i => i.AnswerForLatex != null ? $"{FILES_PATH}/{i.AnswerForLatex}" : ""))
                .ForMember(vm => vm.Extension, opt => opt.MapFrom(c => c.QuestionMap31Extension));

            CreateMap<MultipleChoiceQuestion, MultipleChoiceQuestionViewModel>()
               .ForMember(vm => vm.ImageURL, opt => opt.MapFrom(i => i.ImageURL != null ? $"{FILES_PATH}/{i.ImageURL}" : ""))
               .ForMember(vm => vm.Base_ImageURL, opt => opt.MapFrom(i => i.ImageURL != null ? $"{FILES_PATH}/{i.ImageURL}" : ""))
               .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(i => i.PDFURL != null ? $"{FILES_PATH}/{i.PDFURL}" : ""))
               .ForMember(vm => vm.VIDEOURL, opt => opt.MapFrom(i => i.VIDEOURL != null ? $"{FILES_PATH}/{i.VIDEOURL}" : ""))
               .ForMember(vm => vm.AnswerForLatex, opt => opt.MapFrom(i => i.AnswerForLatex != null ? $"{FILES_PATH}/{i.AnswerForLatex}" : ""))
               .ForMember(vm => vm.Extension, opt => opt.MapFrom(c => c.QuestionMap31Extension));



            CreateMap<MultipleChoiceQuestionChoice, MultipleChoiceQuestionChoiceViewModel>()
              .ForMember(vm => vm.ImageURL, opt => opt.MapFrom(i => i.ImageURL != null ? $"{FILES_PATH}/{i.ImageURL}" : ""))
              .ForMember(vm => vm.LatexURL, opt => opt.MapFrom(i => i.ImageURL != null ? $"{FILES_PATH}/{i.ImageURL}" : ""));


            CreateMap<Tutorial, TutorialViewModel>()
                .ForMember(vm => vm.URL, opt => opt.MapFrom(i => i.URL != null ? $"{FILES_PATH}/{i.URL}" : ""))
                //.ForMember(vm => vm.PDFURL, opt => opt.MapFrom(i => i.PDFURL != null ? $"{FILES_PATH}/{i.PDFURL}" : ""))
                //.ForMember(vm => vm.VideoURL, opt => opt.MapFrom(i => i.VideoURL != null ? $"{FILES_PATH}/{i.VideoURL}" : ""))
                .ForMember(vm => vm.Tags, opt => opt.MapFrom(t => t.Tags.Select(tag => tag.Tag).ToList()));

            CreateMap<TutorialPDF, TutorialPDFViewModel>()
                .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(i => i.PDFURL != null ? $"{FILES_PATH}/{i.PDFURL}" : ""));

            CreateMap<TutorialVideo, TutorialVideoViewModel>()
                .ForMember(vm => vm.VideoURL, opt => opt.MapFrom(i => i.VideoURL != null ? $"{FILES_PATH}/{i.VideoURL}" : ""));

            CreateMap<VariableKeyVariableCharValidValuesGroup, VariableKeyVariableCharValidValuesGroupViewModel>()
                .ForMember(vm => vm.Images, opt => opt.MapFrom(i => 
                i.Images.Select(ii => ii.URL != null ? $"{FILES_PATH}/{ii.URL}" : "")));
            
            //Ownership
            CreateMap<Information, InformationViewModel>()
                .ForMember(vm => vm.PDFURL, opt => opt.MapFrom(c => !string.IsNullOrEmpty(c.PDFURL) ? $"{FILES_PATH}/{c.PDFURL}" : ""))
                .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
                .ForMember(gvm => gvm.Owners, opt => opt.MapFrom(g => g.Owners.Where(o => o.Owner != null).Select(o => new OwnerInfoViewModel()
                {
                    Name = o.Owner.Name,
                    Email = o.Owner.Email,
                    ProfilePicture = o.Owner.ProfilePicture != null ? $"{FILES_PATH}/{o.Owner.ProfilePicture}" : null
                })));
            
            CreateMap<KeysList, KeysListViewModel>()
                .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name));

            CreateMap<QuestionComment, QuestionCommentViewModel>()
               .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
               .ForMember(vm => vm.AddedByProfilePicture, opt => opt.MapFrom(c => c.AddedBy.ProfilePicture != null ? $"{FILES_PATH}/{c.AddedBy.ProfilePicture}" : null));

            CreateMap<DataPoolAccess, DataPoolAccessViewModel>()
               .ForMember(vm => vm.UserName, opt => opt.MapFrom(c => c.User.Name));

            
            CreateMap<QuestionCommentSectionTag, QuestionCommentSectionTagViewModel>()
               .ForMember(vm => vm.UserName, opt => opt.MapFrom(c => c.User.Name));

            CreateMap<QuestionCommentTag, QuestionCommentTagViewModel>()
               .ForMember(vm => vm.UserName, opt => opt.MapFrom(c => c.User.Name));

            CreateMap<BackgroundImage, BackgroundImageViewModel>()
                .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
                .ForMember(vm => vm.URL, opt => opt.MapFrom(c => !string.IsNullOrEmpty(c.URL) ? $"{FILES_PATH}/{c.URL}" : ""));

            CreateMap<CourseMapElementImages, CourseMapElementImagesViewModel>()
               .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
               .ForMember(vm => vm.Play, opt => opt.MapFrom(c => !string.IsNullOrEmpty(c.Play) ? $"{FILES_PATH}/{c.Play}" : ""))
               .ForMember(vm => vm.PDF, opt => opt.MapFrom(c => !string.IsNullOrEmpty(c.PDF) ? $"{FILES_PATH}/{c.PDF}" : ""))
               .ForMember(vm => vm.Video, opt => opt.MapFrom(c => !string.IsNullOrEmpty(c.Video) ? $"{FILES_PATH}/{c.Video}" : ""))
               .ForMember(vm => vm.Link, opt => opt.MapFrom(c => !string.IsNullOrEmpty(c.Link) ? $"{FILES_PATH}/{c.Link}" : ""));


            CreateMap<ImageAnswerGroup, ImageAnswerGroupViewModel>()
                .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
                .ForMember(gvm => gvm.Owners, opt => opt.MapFrom(g => g.Owners.Where(o => o.Owner != null).Select(o => new OwnerInfoViewModel()
                {
                    Name = o.Owner.Name,
                    Email = o.Owner.Email,
                    ProfilePicture = o.Owner.ProfilePicture != null ? $"{FILES_PATH}/{o.Owner.ProfilePicture}" : null
                })));

            CreateMap<InterpretedImageGroup, InterpretedImageGroupViewModel>()
                 .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
                .ForMember(gvm => gvm.Owners, opt => opt.MapFrom(g => g.Owners.Where(o => o.Owner != null).Select(o => new OwnerInfoViewModel()
                {
                    Name = o.Owner.Name,
                    Email = o.Owner.Email,
                    ProfilePicture = o.Owner.ProfilePicture != null ? $"{FILES_PATH}/{o.Owner.ProfilePicture}" : null
                })));

            CreateMap<Topic, TopicViewModel>()
                .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
                .ForMember(gvm => gvm.Owners, opt => opt.MapFrom(g => g.Owners.Where(o => o.Owner != null).Select(o => new OwnerInfoViewModel()
                {
                    Name = o.Owner.Name,
                    Email = o.Owner.Email,
                    ProfilePicture = o.Owner.ProfilePicture != null ? $"{FILES_PATH}/{o.Owner.ProfilePicture}" : null
                })));

            CreateMap<QuestionOwner, OwnerInfoViewModel>()
                .ForMember(gvm => gvm.Name, opt => opt.MapFrom(o => o.Owner.Name))
                .ForMember(gvm => gvm.Email, opt => opt.MapFrom(o => o.Owner.Email))
                .ForMember(gvm => gvm.ProfilePicture, opt => opt.MapFrom(o => o.Owner.ProfilePicture != null ? $"{FILES_PATH}/{o.Owner.ProfilePicture}" : null));

            CreateMap<QuestionSeries, QuestionSeriesViewModel>()
                .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
                .ForMember(gvm => gvm.Owners, opt => opt.MapFrom(g => g.Owners.Where(o => o.Owner != null).Select(o => new OwnerInfoViewModel()
                {
                    Name = o.Owner.Name,
                    Email = o.Owner.Email,
                    ProfilePicture = o.Owner.ProfilePicture != null ? $"{FILES_PATH}/{o.Owner.ProfilePicture}" : null
                })));

            CreateMap<FeedbackQuestionEvent, FeedbackQuestionEventViewModel>()
                .ForMember(vm => vm.EventHolderName, opt => opt.MapFrom(c => c.EventHolder.Name));

            CreateMap<QuestionSeries, QuestionSeries_Statistics_ViewModel>()
                .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
                .ForMember(vm => vm.MedianPlayTime, opt => opt.MapFrom(c => c.Statistics.Any() ?
                c.Statistics.OrderBy(s => s.TotalTime).ToArray()[(int)c.Statistics.Count()/2].TotalTime

                : 0))

                .ForMember(vm => vm.TotalStats, opt => opt.MapFrom(c => c.Statistics.Count()))
                .ForMember(vm => vm.TotalStatsOnMobile, opt => opt.MapFrom(c => c.Statistics.Count(s => s.OnMobile)))

                .ForMember(vm => vm.AddedByName, opt => opt.MapFrom(c => c.AddedBy.Name))
                .ForMember(gvm => gvm.Owners, opt => opt.MapFrom(g => g.Owners.Where(o => o.Owner != null).Select(o => new OwnerInfoViewModel()
                {
                    Name = o.Owner.Name,
                    Email = o.Owner.Email,
                    ProfilePicture = o.Owner.ProfilePicture != null ? $"{FILES_PATH}/{o.Owner.ProfilePicture}" : null
                })));
        }
    }
}
