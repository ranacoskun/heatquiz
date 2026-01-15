import { ADD_REQUEST_FILE_API, GET_REQUEST_API, GET_REQUEST_BODY_API } from "./APIRequests";


export function getQuestionCommentsQuery(q){
    return GET_REQUEST_API('QuestionComments/GetQuestionComments', q.Id, false)
}

export function searchUserCommentsQuery(b){
    return GET_REQUEST_BODY_API('QuestionComments/GetComments2', b)
}

export function getUnreadCommentsQuery(){
    return GET_REQUEST_API('QuestionComments/GetUnseenCommentsNumber')
}

export function addQuestionCommentRequest(b){
    return ADD_REQUEST_FILE_API('QuestionComments/AddQuestionComment', b, false)
}

export function registerCommentViewRequest(v){
    return GET_REQUEST_API('QuestionComments/RegisterSeenNotification', v)
}