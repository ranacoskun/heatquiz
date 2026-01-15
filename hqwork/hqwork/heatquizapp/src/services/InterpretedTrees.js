import { ADD_REQUEST_BODY_API, ADD_REQUEST_FILE_API, EDIT_REQUEST_BODY_API, EDIT_REQUEST_FILE_API, GET_REQUEST_API } from "./APIRequests";

export function getInterpretedTrees(){
    return GET_REQUEST_API('InterpretedImages/GetGroups', null, true)
}

export function getInterpretedValues(){
    return GET_REQUEST_API('InterpretedImages/GetValues', null, true)
}

export function addInterpretedTreeRequest(b){
    return ADD_REQUEST_BODY_API('InterpretedImages/AddGroup', b, true)
}

export function editInterpretedTreeRequest(b){
    return EDIT_REQUEST_BODY_API('InterpretedImages/EditGroup', b, true)
}

export function removeInterpretedTreeRequest(b){
    return EDIT_REQUEST_BODY_API('InterpretedImages/DeleteTree', b)
}

export function addImageRequest(b){
    return ADD_REQUEST_FILE_API('InterpretedImages/AddImageSingleStep', b, true)
}

export function removeInterpretedNodeRequest(b){
    return EDIT_REQUEST_BODY_API('InterpretedImages/DeleteNode', b)
}

export function editImageNameRequest(b){
    return EDIT_REQUEST_FILE_API('InterpretedImages/EditInterpretedImageName', b, true)
}

export function editImagePictureRequest(b){
    return EDIT_REQUEST_FILE_API('InterpretedImages/EditInterpretedImagePicture', b, true)
}

export function editImageValuesRequest(b){
    return EDIT_REQUEST_FILE_API('InterpretedImages/EditInterpretedImageValues', b, true)
}