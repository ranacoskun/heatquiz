import { ADD_REQUEST_BODY_API, ADD_REQUEST_FILE_API, EDIT_REQUEST_BODY_API, EDIT_REQUEST_FILE_API, GET_REQUEST_API } from "./APIRequests";

export function getClickTrees(){
    return GET_REQUEST_API('ImageAnswers/GetImageAnswerGroups', null, true)
}


export function addTreeRequest(b){
    return ADD_REQUEST_BODY_API('ImageAnswers/AddGroup', b, true)
}

export function editTreeRequest(b){
    return EDIT_REQUEST_BODY_API('ImageAnswers/EditGroup', b, true)
}

export function removeTreeRequest(b){
    return EDIT_REQUEST_BODY_API('ImageAnswers/DeleteTree', b)
}

export function addImageTreeRequest(b){
    return ADD_REQUEST_FILE_API('ImageAnswers/AddAnswerImageOneStep', b, true)
}

export function editNodeRequest(b){
    return EDIT_REQUEST_FILE_API('ImageAnswers/EditAnswerImageOneStep', b, true)
}

export function removeNodeRequest(b){
    return EDIT_REQUEST_BODY_API('ImageAnswers/DeleteNode', b)
}
