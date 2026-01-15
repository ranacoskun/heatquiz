import { ADD_REQUEST_FILE_API, EDIT_REQUEST_BODY_API, EDIT_REQUEST_FILE_API, GET_REQUEST_API } from "./APIRequests";

export function getDefaultImagesRequest(){
    return GET_REQUEST_API('QuestionImage/GetAllImages', null, true)
}

export function addDefaultImageRequest(b){
    return ADD_REQUEST_FILE_API('QuestionImage/AddImage', b, true)
}

export function editDefaultImageNameRequest(b){
    return EDIT_REQUEST_FILE_API('QuestionImage/EditCode', b, true)
}

export function editDefaultImageImageRequest(b){
    return EDIT_REQUEST_FILE_API('QuestionImage/EditImage', b, true)
}

export function removeDefaultImageRequest(b){
    return EDIT_REQUEST_BODY_API('QuestionImage/DeleteImage', b, true)
}


export function getBackgroundImagesRequest(){
    return GET_REQUEST_API('BackgroundImage/GetAllImages', null, true)
}

export function addBackgroundImageRequest(b){
    return ADD_REQUEST_FILE_API('BackgroundImage/AddImage', b, true)
}

export function editBackgroundImageNameRequest(b){
    return ADD_REQUEST_FILE_API('BackgroundImage/EditCode', b, true)
}

export function editBackgroundImageImageRequest(b){
    return ADD_REQUEST_FILE_API('BackgroundImage/EditImage', b, true)
}

export function removeBackgroundImageRequest(b){
    return EDIT_REQUEST_BODY_API('BackgroundImage/DeleteImage', b, true)
}

export function getClickImagesListsRequest(){
    return GET_REQUEST_API('CourseMapElementImages/GetAllImages', null, true)
}

