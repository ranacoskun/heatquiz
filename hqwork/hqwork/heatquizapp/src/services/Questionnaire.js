import { ADD_REQUEST_BODY_API, ADD_REQUEST_FILE_API, GET_REQUEST_API, GET_REQUEST_BODY_API } from "./APIRequests";

export function searchQuestionnairesRequest(){
    return GET_REQUEST_API('Survey/GetSurveys', null, true)
}

export function getQuestionnaireRequest(Id){
    return GET_REQUEST_API('Survey/GetSurvey', Id)
}

export function getQuestionnaireViewEditRequest(Id){
    return GET_REQUEST_API('Survey/GetSurveyViewEdit', Id)
}

export function getQuestionnaireStatisticsRequest(Id){
    return GET_REQUEST_API('Survey/GetSurveyStatistics', Id)
}

export function getQuestionnaireHistoryRequest(b){
    return GET_REQUEST_BODY_API('Survey/GetSurveyHistory', b)
}

export function addQuestionnaireRequest(d){
    return ADD_REQUEST_FILE_API('Survey/AddSurveySingleStep', d, true)
}

export function copyQuestionnaireRequest(d){
    return ADD_REQUEST_FILE_API('Survey/CopySurvey', d, true)
}

export function flipQuestionnaireRepeatabilityRequest(d){
    return ADD_REQUEST_FILE_API('Survey/FlipRepeatable', d, true)
}

export function copyQuestionnaireQuestionRequest(d){
    return ADD_REQUEST_FILE_API('Survey/CopySurveyQuestion', d, true)
}

export function addQuestionnaireStatisticRequest(d){
    return ADD_REQUEST_FILE_API('Survey/AddStatistic', d, true)
}

export function assignQuestionnaireSeriesRequest(d){
    return ADD_REQUEST_FILE_API('Survey/AssignSeries', d, true)
}

export function deassignQuestionnaireSeriesGetAssignedSeriesRequest(b){
    return GET_REQUEST_API('Survey/GetAssignedSeries', b)
}

export function deassignQuestionnaireSeriesRequest(d){
    return ADD_REQUEST_FILE_API('Survey/DeassignSeries', d, true)
}

export function assignQuestionnaireMapElementRequest(d){
    return ADD_REQUEST_FILE_API('Survey/AssignMapElement', d, true)
}

export function deassignQuestionnaireMapElementRequest(d){
    return ADD_REQUEST_FILE_API('Survey/DeassignMapElement', d, true)
}

export function flipQuestionnaireMapElementRepeatabilityRequest(d){
    return ADD_REQUEST_FILE_API('Survey/FlipRepeatableMapElement', d, true)
}

export function editQuestionnaireCodeRequest(d){
    return ADD_REQUEST_FILE_API('Survey/EditSurveyCode', d, true)
}

export function addQuestionnaireQuestionRequest(d){
    return ADD_REQUEST_FILE_API('Survey/AddQuestion', d, true)
}

export function removeQuestionnaireQuestionRequest(d){
    return ADD_REQUEST_FILE_API('Survey/RemoveQuestion', d, true)
}

export function editQuestionnaireExplanationRequest(d){
    return ADD_REQUEST_FILE_API('Survey/EditSurveyExplanation', d, true)
}

export function editQuestionnaireFinalTextRequest(d){
    return ADD_REQUEST_FILE_API('Survey/EditSurveyFinalText', d, true)
}

export function editQuestionnaireImageRequest(d){
    return ADD_REQUEST_FILE_API('Survey/UpdateSurveyImage', d, true)
}

export function removeQuestionnaireImageRequest(d){
    return ADD_REQUEST_FILE_API('Survey/RemoveSurveyImage', d, true)
}

export function editQuestionnaireQuestionTitleRequest(d){
    return ADD_REQUEST_FILE_API('Survey/EditQuestionTitle', d, true)
}

export function editQuestionnaireQuestionBodyRequest(d){
    return ADD_REQUEST_FILE_API('Survey/EditQuestionBody', d, true)
}

export function editQuestionnaireQuestionImageRequest(d){
    return ADD_REQUEST_FILE_API('Survey/UpdateQuestionImage', d, true)
}

export function removeQuestionnaireQuestionImageRequest(d){
    return ADD_REQUEST_FILE_API('Survey/RemoveQuestionImage', d, true)
}

///
export function removeQuestionnaireChoiceRequest(d){
    return ADD_REQUEST_FILE_API('Survey/RemoveChoice', d, true)
}

export function removeQuestionnaireChoiceLatexRequest(d){
    return ADD_REQUEST_FILE_API('Survey/RemoveChoiceLatex', d, true)
}

export function removeQuestionnaireChoiceImageRequest(d){
    return ADD_REQUEST_FILE_API('Survey/RemoveChoiceImage', d, true)
}

export function updateQuestionnaireChoiceImageRequest(d){
    return ADD_REQUEST_FILE_API('Survey/EditChoiceImage', d, true)
}

export function updateQuestionnaireChoiceLatexRequest(d){
    return ADD_REQUEST_FILE_API('Survey/EditChoiceLatex', d, true)
}

export function addQuestionnaireChoiceRequest(d){
    return ADD_REQUEST_FILE_API('Survey/AddChoice', d, true)
}

export function reorderQuestionnaireRequest(d){
    return ADD_REQUEST_BODY_API('Survey/ReorderSurvey', d, true)
}

export function reorderQuestionnaireQuestionChoicesRequest(d){
    return ADD_REQUEST_BODY_API('Survey/ReorderSurveyQuestion', d, true)
}

export function getQuestionnaireChoiceTextInputsRequest(Id){
    return GET_REQUEST_API('Survey/GetTextInputChoiceInputs', Id)
}

export function flipQuestionnaireQuestionSingleChoiceRequest(d){
    return ADD_REQUEST_FILE_API('Survey/FlipQuestionSingleChoice', d)
}

export function removeQuestionnaireRequest(d){
    return ADD_REQUEST_FILE_API('Survey/RemoveSurvey', d)
}