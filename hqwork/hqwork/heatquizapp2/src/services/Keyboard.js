import { ADD_REQUEST_BODY_API, EDIT_REQUEST_BODY_API, EDIT_REQUEST_FILE_API, GET_REQUEST_API, GET_REQUEST_BODY_API } from "./APIRequests";

export function getAllKeyListsRequest(){
    return GET_REQUEST_API('KeysList/GetAllKeyLists', null, true)
}

export function getKeyListAssignedKeysRequest(b){
    return GET_REQUEST_BODY_API('KeysList/GetListAssignedKeys', b)
}

export function addKeyListRequest(b){
    return ADD_REQUEST_BODY_API('KeysList/AddList', b, true)
}

export function removeKeyListRequest(b){
    return EDIT_REQUEST_BODY_API('KeysList/RemoveKeyList', b)
}

export function reassignKeysToListRequest(b){
    return EDIT_REQUEST_BODY_API('KeysList/ReassignKeys', b)
}

export function editKeyListCodeRequest(b){
    return EDIT_REQUEST_FILE_API('KeysList/UpdateCode', b, true)
}

export function getKeyboardRequest(Id){
    return GET_REQUEST_API('Keyboard/GetKeyboard_PORTAL_VIEW_EDIT', Id)
}

export function searchKeyboardsRequest(b){
    return GET_REQUEST_BODY_API('Keyboard/SearchKeyoards_ADVANCED_UPDATED_PORTAL', b, true)
}

export function searchKeyboardsByIdsRequest(b){
    return GET_REQUEST_BODY_API('Keyboard/SearchKeyoardsByIds_ADVANCED', b)
}

export function getKeyboardQuestionsRequest(Id){
    return GET_REQUEST_API('Keyboard/GetQuestionsSpecificKeyboard', Id)
}

export function addNumericKeyRequest(b){
    return ADD_REQUEST_BODY_API('Keyboard/AddKeyboardNumericKey', b, true)
}

export function addVariableKeyRequest(b){
    return ADD_REQUEST_BODY_API('Keyboard/AddKeyboardVariableKey', b, true)
}

export function addKeyVariantRequest(b){
    return ADD_REQUEST_BODY_API('Keyboard/AddKeyboardVariableKeyImage', b, true)
}

export function searchKeysRequest(b){
    return GET_REQUEST_BODY_API('Keyboard/SearchKeys_ADVANCED_PORTAL', b, true)
}

export function searchKeysByIdsRequest(b){
    return GET_REQUEST_BODY_API('Keyboard/SearchKeysByIds_ADVANCED', b)
}

export function addKeyboardRequest(b){
    return ADD_REQUEST_BODY_API('Keyboard/AddKeyboard', b, true)
}

export function editKeyboardNameRequest(b){
    return EDIT_REQUEST_BODY_API('Keyboard/EditKeyboardName', b, true)
}

export function getKeyConnectedQuestionsRequest(b){
    return ADD_REQUEST_BODY_API('Keyboard/GetQuestionsForKeyboardKey', b)
}

export function swabKeyboardKeysRequest(b){
    return EDIT_REQUEST_BODY_API('Keyboard/SwabKeyboardKeys', b)
}

