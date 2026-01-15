import {ADD_REQUEST_BODY_API, GET_REQUEST_API } from "./APIRequests";

export function getLODs(){
    return GET_REQUEST_API('LevelsOfDifficulty/GetLevelsOfDifficulty', null, true)
}

export function getLODsExtended(){
    return GET_REQUEST_API('LevelsOfDifficulty/GetLevelsOfDifficulty_PORTAL_EXTENDED_DETAILS', null, false)
}

export function getLODQuestionsRequest(Id){
    return GET_REQUEST_API('LevelsOfDifficulty/GetLevelOfDifficultyQuestions', Id, false)
}

export function addLODRequest(){
    return ADD_REQUEST_BODY_API('LevelsOfDifficulty/AddLevel', null, false)
}

