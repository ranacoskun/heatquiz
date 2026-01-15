import { ADD_REQUEST_BODY_API, ADD_REQUEST_FILE_API, EDIT_REQUEST_FILE_API, GET_REQUEST_API } from "./APIRequests";

export function getAllMapClickImageListsRequest(){
    return GET_REQUEST_API('CourseMapElementImages/GetAllImages', null, true)
}

export function addMapClickImageListRequest(b){
    return ADD_REQUEST_FILE_API('CourseMapElementImages/AddImage', b, true)
}

export function editMapClickImageListNameRequest(b){
    return EDIT_REQUEST_FILE_API('CourseMapElementImages/EditCode', b, true)
}

export function editMapClickImageListImageRequest(b){
    return EDIT_REQUEST_FILE_API('CourseMapElementImages/EditImage', b, true)
}

export function getAllQuestionInformationRequest(){
    return GET_REQUEST_API('Information/GetAllInformation', null, true)
}

export function getAllQuestionsAssignedInformationRequest(b){
    return ADD_REQUEST_BODY_API('Information/SearchInformationQuestions', b, true)
}

export function assignQuestionsInformationRequest(b){
    return EDIT_REQUEST_FILE_API('Information/AssignQuestions', b, true)
}

export function unassignQuestionsInformationRequest(b){
    return EDIT_REQUEST_FILE_API('Information/DeassignQuestions', b)
}

export function addQuestionInformationRequest(b){
    return ADD_REQUEST_FILE_API('Information/AddInfo', b, true)
}

export function editQuestionInformationNameRequest(b){
    return EDIT_REQUEST_FILE_API('Information/EditCode', b)
}

export function editQuestionInformationLatexRequest(b){
    return EDIT_REQUEST_FILE_API('Information/EditLatex', b)
}

export function editQuestionInformationDocumentRequest(b){
    return EDIT_REQUEST_FILE_API('Information/EditPDF', b)
}

export function removeQuestionInformationDocumentRequest(b){
    return EDIT_REQUEST_FILE_API('Information/RemovePDF', b)
}





