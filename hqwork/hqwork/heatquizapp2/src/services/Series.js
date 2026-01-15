import {ADD_REQUEST_BODY_API, ADD_REQUEST_FILE_API, EDIT_REQUEST_BODY_API, GET_REQUEST_API, GET_REQUEST_BODY_API } from "./APIRequests";


export function getSeriesRequest(Code){
    return GET_REQUEST_API('QuestionSeries/GetSeries', Code)
}

export function getSeriesViewEditRequest(Code){
    return GET_REQUEST_API('QuestionSeries/GetSeries_EXTENDED', Code)
}

export function getSeriesMedianTimeSpectrumRequest(Id){
    return GET_REQUEST_API('Statistics/GetSeriesStatisticDetailed', Id)
}

export function getSeriesStatisticsRequest(Id){
    return GET_REQUEST_API('QuestionSeries/GetSeriesElementStatistics_EXTENDED', Id)
}

export function getSeriesAddersRequest(){
    return GET_REQUEST_API('QuestionSeries/GetSeriesAdders', null, true)
}

export function searchSeriesRequest(b){
    return GET_REQUEST_BODY_API('QuestionSeries/SearchSeries_ADVANCED', b, true)
}

export function searchSeriesByIdsRequest(b){
    return GET_REQUEST_BODY_API('QuestionSeries/SearchSeriesByIds_ADVANCED', b, true)
}


export function addSeriesStatisticRequest(b){
    return ADD_REQUEST_FILE_API('QuestionSeries/AddStatistic', b)
}

export function addSeriesRequest(b){
    return ADD_REQUEST_BODY_API('QuestionSeries/AddSeries', b, true)
}

export function addQuestionsToSeriesRequest(b){
    return ADD_REQUEST_BODY_API('QuestionSeries/AddSeriesElements', b, true)
}

export function editQuestionsInfoRequest(b){
    return EDIT_REQUEST_BODY_API('QuestionSeries/EditSeriesCode', b, true)
}

export function assignQuestionsToPoolRequest(b){
    return EDIT_REQUEST_BODY_API('QuestionSeries/AssignElementsToPool', b, true)
}

export function deselectQuestionFromSeriesRequest(b){
    return EDIT_REQUEST_BODY_API('QuestionSeries/DeselectElementSeries', b, true)
}

export function decreasePoolsNumberSeriesRequest(b){
    return EDIT_REQUEST_BODY_API('QuestionSeries/DecreasePoolsNumber', b, true)
}

export function increasePoolsNumberSeriesRequest(b){
    return EDIT_REQUEST_BODY_API('QuestionSeries/IncreasePoolsNumber', b, true)
}

export function rearrangeSeriesRequest(b){
    return EDIT_REQUEST_BODY_API('QuestionSeries/RearrangeSeries', b, true)
}