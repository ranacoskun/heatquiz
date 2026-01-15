import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import { addQuestionnaireChoiceRequest, addQuestionnaireQuestionRequest, addQuestionnaireRequest, addQuestionnaireStatisticRequest, assignQuestionnaireMapElementRequest, assignQuestionnaireSeriesRequest, copyQuestionnaireQuestionRequest, copyQuestionnaireRequest, deassignQuestionnaireMapElementRequest, deassignQuestionnaireSeriesGetAssignedSeriesRequest, deassignQuestionnaireSeriesRequest, editQuestionnaireCodeRequest, editQuestionnaireExplanationRequest, editQuestionnaireFinalTextRequest, editQuestionnaireImageRequest, editQuestionnaireQuestionBodyRequest, editQuestionnaireQuestionImageRequest, editQuestionnaireQuestionTitleRequest, flipQuestionnaireMapElementRepeatabilityRequest, flipQuestionnaireQuestionSingleChoiceRequest, flipQuestionnaireRepeatabilityRequest, getQuestionnaireChoiceTextInputsRequest, getQuestionnaireHistoryRequest, getQuestionnaireRequest, getQuestionnaireStatisticsRequest, getQuestionnaireViewEditRequest, removeQuestionnaireChoiceImageRequest, removeQuestionnaireChoiceLatexRequest, removeQuestionnaireChoiceRequest, removeQuestionnaireImageRequest, removeQuestionnaireQuestionImageRequest, removeQuestionnaireQuestionRequest, removeQuestionnaireRequest, reorderQuestionnaireQuestionChoicesRequest, reorderQuestionnaireRequest, searchQuestionnairesRequest, updateQuestionnaireChoiceImageRequest, updateQuestionnaireChoiceLatexRequest } from "../services/Questionnaire"

const Context = React.createContext()

export function useQuestionnaires(){
    return useContext(Context)
}

export function QuestionnairesProvider ({children}){
    //Fetch from API
    const {value: surveys, errorGetSurveys, loading:isLoadingSurveys, execute: getAllSurveys} = useAsyncFn(() => searchQuestionnairesRequest())
    
    const {value: survey, errorGetSurvey, loading:isLoadingSurvey, execute: getSurvey} = useAsyncFn((Id) => getQuestionnaireRequest(Id)) 
    const {value: surveyViewEdit, errorGetSurveyViewEdit, loading:isLoadingSurveyViewEdit, execute:  getSurveyViewEdit} = useAsyncFn((Id) => getQuestionnaireViewEditRequest(Id)) 
    const {value: surveyStatistics, errorGetSurveyStatistics, loading:isLoadingSurveyStatistics, execute:  getSurveyStatistics} = useAsyncFn((Id) => getQuestionnaireStatisticsRequest(Id)) 
    const {value: surveyHistory, errorGetSurveyHistory, loading:isLoadingSurveyHistory, execute:  getSurveyHistory} = useAsyncFn((b) => getQuestionnaireHistoryRequest(b)) 

    const {value: addSurveyResult, errorAddSurvey, loading:isLoadingAddSurvey, execute: addSurvey} = useAsyncFn((d) => addQuestionnaireRequest(d))
    const {value: copySurveyResult, errorCopySurvey, loading:isLoadingCopySurvey, execute: copySurvey} = useAsyncFn((d) => copyQuestionnaireRequest(d))
    const {value: copyQuestionnaireQuestionResult, errorCopyQuestionnaireQuestion, loading:isLoadingCopyQuestionnaireQuestion, execute: copyQuestionnaireQuestion} = useAsyncFn((d) => copyQuestionnaireQuestionRequest(d))
    const {value: addSurveyStatistiResult, errorAddSurveyStatisti, loading:isLoadingAddSurveyStatistic, execute: addSurveyStatistic} = useAsyncFn((d) => addQuestionnaireStatisticRequest(d))
    const {value: flipQuestionnaireRepeatabilityResult, errorFlipQuestionnaireRepeatability, loading:isLoadingFlipQuestionnaireRepeatability, execute: flipQuestionnaireRepeatability} = useAsyncFn((d) => flipQuestionnaireRepeatabilityRequest(d))

    const {value: assignQuestionnaireSeriesResult, errorAssignQuestionnaireSeries, loading:isLoadingAssignQuestionnaireSeries, execute: assignQuestionnaireSeries} = useAsyncFn((d) => assignQuestionnaireSeriesRequest(d))
    const {value: deassignQuestionnaireSeriesResult, errorDeassignQuestionnaireSeries, loading:isLoadingDeassignQuestionnaireSeries, execute: deassignQuestionnaireSeries} = useAsyncFn((d) => deassignQuestionnaireSeriesRequest(d))
    const {value: deassignQuestionnaireSeriesGetAssignedSeriesResult, errorDeassignQuestionnaireSeriesGetAssignedSeries, loading:isLoadingDeassignQuestionnaireSeriesGetAssignedSeries, execute: deassignQuestionnaireSeriesGetAssignedSeries} = useAsyncFn((d) => deassignQuestionnaireSeriesGetAssignedSeriesRequest(d))

    const {value: assignQuestionnaireMapElementResult, errorAssignQuestionnaireMapElement, loading:isLoadingAssignQuestionnaireMapElement, execute: assignQuestionnaireMapElement} = useAsyncFn((d) => assignQuestionnaireMapElementRequest(d))
    const {value: deassignQuestionnaireMapElementResult, errorDeassignQuestionnaireMapElement, loading:isLoadingDeassignQuestionnaireMapElement, execute: deassignQuestionnaireMapElement} = useAsyncFn((d) => deassignQuestionnaireMapElementRequest(d))
    const {value: flipQuestionnaireMapElementRepeatabilityResult, errorFlipQuestionnaireMapElementRepeatability, loading:isLoadingFlipQuestionnaireMapElementRepeatability, execute: flipQuestionnaireMapElementRepeatability} = useAsyncFn((d) => flipQuestionnaireMapElementRepeatabilityRequest(d))

    const {value: editQuestionnaireCodeResult, errorEditQuestionnaireCode, loading:isLoadingEditQuestionnaireCode, execute:  editQuestionnaireCode} = useAsyncFn((d) => editQuestionnaireCodeRequest(d))
    const {value: editQuestionnaireExplanationResult, errorEditQuestionnaireExplanation, loading:isLoadingEditQuestionnaireExplanation, execute:  editQuestionnaireExplanation} = useAsyncFn((d) => editQuestionnaireExplanationRequest(d))
    const {value: editQuestionnaireFinalTextResult, errorEditQuestionnaireFinalText, loading:isLoadingEditQuestionnaireFinalText, execute:  editQuestionnaireFinalText} = useAsyncFn((d) => editQuestionnaireFinalTextRequest(d))
    const {value: editQuestionnaireFinalImageResult, errorEditQuestionnaireImage, loading:isLoadingEditQuestionnaireImage, execute:   editQuestionnaireImage} = useAsyncFn((d) => editQuestionnaireImageRequest(d))
    const {value: removeQuestionnaireImageResult, errorRemoveQuestionnaireImage, loading:isLoadingRemoveQuestionnaireImage, execute:   removeQuestionnaireImage} = useAsyncFn((d) => removeQuestionnaireImageRequest(d))

    const {value: addQuestionnaireQuestionResult, errorAddQuestionnaireQuestion, loading:isLoadingAddQuestionnaireQuestion, execute:  addQuestionnaireQuestion} = useAsyncFn((d) => addQuestionnaireQuestionRequest(d))
    const {value: removeQuestionnaireQuestionResult, errorRemoveQuestionnaireQuestion, loading:isLoadingRemoveQuestionnaireQuestion, execute:  removeQuestionnaireQuestion} = useAsyncFn((d) => removeQuestionnaireQuestionRequest(d))
    
    const {value: editQuestionnaireQuestionTitleResult, errorEditQuestionnaireQuestionTitle, loading:isLoadingEditQuestionnaireQuestionTitle, execute:  editQuestionnaireQuestionTitle} = useAsyncFn((d) => editQuestionnaireQuestionTitleRequest(d))
    const {value: editQuestionnaireQuestionBodyResult, errorEditQuestionnaireQuestionBody, loading:isLoadingEditQuestionnaireQuestionBody, execute:  editQuestionnaireQuestionBody} = useAsyncFn((d) => editQuestionnaireQuestionBodyRequest(d))
    const {value: editQuestionnaireQuestionImageResult, errorEditQuestionnaireQuestionImage, loading:isLoadingEditQuestionnaireQuestionImage, execute:  editQuestionnaireQuestionImage} = useAsyncFn((d) => editQuestionnaireQuestionImageRequest(d))
    const {value: removeQuestionnaireQuestionImageResult, errorRemoveQuestionnaireQuestionImage, loading:isLoadingRemoveQuestionnaireQuestionImage, execute:  removeQuestionnaireQuestionImage} = useAsyncFn((d) => removeQuestionnaireQuestionImageRequest(d))
    const {value: flipQuestionnaireQuestionSingleChoiceResult, errorFlipQuestionnaireQuestionSingleChoice, loading:isLoadingFlipQuestionnaireQuestionSingleChoice, execute:  flipQuestionnaireQuestionSingleChoice} = useAsyncFn((d) => flipQuestionnaireQuestionSingleChoiceRequest(d))

    const {value: removeQuestionnaireChoiceResult, errorRemoveQuestionnaireChoice, loading:isLoadingRemoveQuestionnaireChoice, execute:  removeQuestionnaireChoice} = useAsyncFn((d) => removeQuestionnaireChoiceRequest(d))
    const {value: removeQuestionnaireChoiceLatexResult, errorRemoveQuestionnaireChoiceLatex, loading:isLoadingRemoveQuestionnaireChoiceLatex, execute:  removeQuestionnaireChoiceLatex} = useAsyncFn((d) => removeQuestionnaireChoiceLatexRequest(d))
    const {value: removeQuestionnaireChoiceImageResult, errorRemoveQuestionnaireChoiceImage, loading:isLoadingRemoveQuestionnaireChoiceImage, execute:  removeQuestionnaireChoiceImage} = useAsyncFn((d) => removeQuestionnaireChoiceImageRequest(d))
    const {value: updateQuestionnaireChoiceImageResult, errorUpdateQuestionnaireChoiceImage, loading:isLoadingUpdateQuestionnaireChoiceImage, execute:  updateQuestionnaireChoiceImage} = useAsyncFn((d) => updateQuestionnaireChoiceImageRequest(d))
    const {value: updateQuestionnaireChoiceLatexResult, errorUpdateQuestionnaireChoiceLatex, loading:isLoadingUpdateQuestionnaireChoicLatex, execute:  updateQuestionnaireChoiceLatex} = useAsyncFn((d) => updateQuestionnaireChoiceLatexRequest(d))
    const {value: addQuestionnaireChoiceResult, errorAddQuestionnaireChoice, loading:isLoadingAddQuestionnaireChoice, execute:  addQuestionnaireChoice} = useAsyncFn((d) => addQuestionnaireChoiceRequest(d))
    
    const {value: reorderQuestionnaireResult, errorReorderQuestionnaire, loading:isLoadingReorderQuestionnaire, execute:  reorderQuestionnaire} = useAsyncFn((d) => reorderQuestionnaireRequest(d))
    const {value: reorderQuestionnaireQuestionChoicesResult, errorReorderQuestionnaireQuestionChoices, loading:isLoadingReorderQuestionnaireQuestionChoices, execute:  reorderQuestionnaireQuestionChoices} = useAsyncFn((d) => reorderQuestionnaireQuestionChoicesRequest(d))

    const {value: questionnaireChoiceTextInputs, errorGetQuestionnaireChoiceTextInputs, loading:isLoadingGetQuestionnaireChoiceTextInputs, execute:  getQuestionnaireChoiceTextInputs} = useAsyncFn((d) => getQuestionnaireChoiceTextInputsRequest(d))
    const {value: removeQuestionnaireResult, errorRemoveQuestionnaire, loading:isLoadingRemoveQuestionnaire, execute:  removeQuestionnaire} = useAsyncFn((d) => removeQuestionnaireRequest(d))

    return(
        <Context.Provider value = {{
            surveys,
            errorGetSurveys,
            isLoadingSurveys,
            getAllSurveys,

            survey,
            errorGetSurvey,
            isLoadingSurvey,
            getSurvey,

            surveyViewEdit,
            errorGetSurveyViewEdit,
            isLoadingSurveyViewEdit,
            getSurveyViewEdit,

            surveyStatistics,
            errorGetSurveyStatistics,
            isLoadingSurveyStatistics,
            getSurveyStatistics,

            surveyHistory,
            errorGetSurveyHistory,
            isLoadingSurveyHistory,
            getSurveyHistory,

            addSurveyResult,
            errorAddSurvey,
            isLoadingAddSurvey,
            addSurvey,

            copySurveyResult,
            errorCopySurvey,
            isLoadingCopySurvey,
            copySurvey,


            copyQuestionnaireQuestionResult,
            isLoadingCopyQuestionnaireQuestion,
            errorCopyQuestionnaireQuestion,
            copyQuestionnaireQuestion,

            isLoadingAddSurveyStatistic,
            addSurveyStatistiResult,
            errorAddSurveyStatisti,
            addSurveyStatistic,

            assignQuestionnaireSeriesResult,
            isLoadingAssignQuestionnaireSeries,
            errorAssignQuestionnaireSeries,
            assignQuestionnaireSeries,

            deassignQuestionnaireSeriesResult,
            isLoadingDeassignQuestionnaireSeries,
            errorDeassignQuestionnaireSeries,
            deassignQuestionnaireSeries,

            assignQuestionnaireMapElementResult,
            isLoadingAssignQuestionnaireMapElement,
            errorAssignQuestionnaireMapElement,
            assignQuestionnaireMapElement,

            deassignQuestionnaireMapElementResult,
            isLoadingDeassignQuestionnaireMapElement,
            errorDeassignQuestionnaireMapElement,
            deassignQuestionnaireMapElement,

            flipQuestionnaireMapElementRepeatabilityResult,
            isLoadingFlipQuestionnaireMapElementRepeatability,
            errorFlipQuestionnaireMapElementRepeatability,
            flipQuestionnaireMapElementRepeatability,

            deassignQuestionnaireSeriesGetAssignedSeriesResult,
            errorDeassignQuestionnaireSeriesGetAssignedSeries,
            isLoadingDeassignQuestionnaireSeriesGetAssignedSeries,
            deassignQuestionnaireSeriesGetAssignedSeries,

            editQuestionnaireCodeResult,
            isLoadingEditQuestionnaireCode,
            errorEditQuestionnaireCode,
            editQuestionnaireCode,

            editQuestionnaireExplanationResult,
            isLoadingEditQuestionnaireExplanation,
            errorEditQuestionnaireExplanation,
            editQuestionnaireExplanation,

            editQuestionnaireFinalTextResult,
            isLoadingEditQuestionnaireFinalText,
            errorEditQuestionnaireFinalText,
            editQuestionnaireFinalText,

            editQuestionnaireFinalImageResult,
            isLoadingEditQuestionnaireImage,
            errorEditQuestionnaireImage,
            editQuestionnaireImage,

            removeQuestionnaireImageResult,
            isLoadingRemoveQuestionnaireImage,
            errorRemoveQuestionnaireImage,
            removeQuestionnaireImage,

            editQuestionnaireQuestionTitleResult,
            isLoadingEditQuestionnaireQuestionTitle,
            errorEditQuestionnaireQuestionTitle,
            editQuestionnaireQuestionTitle,

            editQuestionnaireQuestionBodyResult,
            isLoadingEditQuestionnaireQuestionBody,
            errorEditQuestionnaireQuestionBody,
            editQuestionnaireQuestionBody,

            editQuestionnaireQuestionImageResult,
            isLoadingEditQuestionnaireQuestionImage,
            errorEditQuestionnaireQuestionImage,
            editQuestionnaireQuestionImage,

            removeQuestionnaireQuestionImageResult,
            isLoadingRemoveQuestionnaireQuestionImage,
            errorRemoveQuestionnaireQuestionImage,
            removeQuestionnaireQuestionImage,

            flipQuestionnaireQuestionSingleChoiceResult,
            errorFlipQuestionnaireQuestionSingleChoice,
            isLoadingFlipQuestionnaireQuestionSingleChoice,
            flipQuestionnaireQuestionSingleChoice,

            removeQuestionnaireChoiceResult,
            errorRemoveQuestionnaireChoice,
            isLoadingRemoveQuestionnaireChoice,
            removeQuestionnaireChoice,

            removeQuestionnaireChoiceLatexResult,
            errorRemoveQuestionnaireChoiceLatex,
            isLoadingRemoveQuestionnaireChoiceLatex,
            removeQuestionnaireChoiceLatex,

            removeQuestionnaireChoiceImageResult,
            errorRemoveQuestionnaireChoiceImage,
            isLoadingRemoveQuestionnaireChoiceImage,
            removeQuestionnaireChoiceImage,

            updateQuestionnaireChoiceImageResult,
            errorUpdateQuestionnaireChoiceImage,
            isLoadingUpdateQuestionnaireChoiceImage,
            updateQuestionnaireChoiceImage,

            updateQuestionnaireChoiceLatexResult,
            errorUpdateQuestionnaireChoiceLatex,
            isLoadingUpdateQuestionnaireChoicLatex,
            updateQuestionnaireChoiceLatex,

            addQuestionnaireChoiceResult,
            errorAddQuestionnaireChoice,
            isLoadingAddQuestionnaireChoice,
            addQuestionnaireChoice,

            addQuestionnaireQuestionResult,
            errorAddQuestionnaireQuestion,
            isLoadingAddQuestionnaireQuestion,
            addQuestionnaireQuestion,

            removeQuestionnaireQuestionResult,
            errorRemoveQuestionnaireQuestion,
            isLoadingRemoveQuestionnaireQuestion,
            removeQuestionnaireQuestion,

            reorderQuestionnaireResult,
            errorReorderQuestionnaire,
            isLoadingReorderQuestionnaire,
            reorderQuestionnaire,

            reorderQuestionnaireQuestionChoicesResult,
            errorReorderQuestionnaireQuestionChoices,
            isLoadingReorderQuestionnaireQuestionChoices,
            reorderQuestionnaireQuestionChoices,

            flipQuestionnaireRepeatabilityResult,
            errorFlipQuestionnaireRepeatability,
            isLoadingFlipQuestionnaireRepeatability,
            flipQuestionnaireRepeatability,

            questionnaireChoiceTextInputs,
            errorGetQuestionnaireChoiceTextInputs,            
            isLoadingGetQuestionnaireChoiceTextInputs,
            getQuestionnaireChoiceTextInputs,

            removeQuestionnaireResult,
            errorRemoveQuestionnaire,
            isLoadingRemoveQuestionnaire,
            removeQuestionnaire
        }}>
            {children}
        </Context.Provider>
    )
}