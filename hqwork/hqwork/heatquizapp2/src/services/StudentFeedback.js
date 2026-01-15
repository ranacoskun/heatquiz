import { ADD_REQUEST_FILE_API, GET_REQUEST_API, GET_REQUEST_BODY_API } from "./APIRequests";

export function getStudentFeedbackQuery(query){
    return GET_REQUEST_BODY_API('Feedback/GetFeedback', query, true)
}

export function getQuestionFeedbackQuery(q){
    return GET_REQUEST_API('Feedback/GetQuestionFeedback', q.Id, false)
}

//Remove this functionality
export function getQuestionFeedbackReferenceQuery(q){
    return GET_REQUEST_API('Feedback/ReferenceQuestion', q.Id, false)
}

//Remove this functionality
export function getFeedbackDebugCodeQuery(query){
    return GET_REQUEST_BODY_API('Feedback/DecryptObject', query, false)
}

export function addQuestionFeedbackRequest(data){
    return ADD_REQUEST_FILE_API('Feedback/AddStudentFeedback', data, false)
}




