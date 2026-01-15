import { ADD_REQUEST_BODY_API, EDIT_REQUEST_BODY_API, EDIT_REQUEST_FILE_API, GET_REQUEST_API } from "./APIRequests";

export function getAllUsers(){
    return GET_REQUEST_API('Account/GetAllUsers')
}

export function addNewUserRequest(u){
    return ADD_REQUEST_BODY_API('Account/AddUser', u, true)
}


export function editUserNameEmail(b){
    return EDIT_REQUEST_BODY_API('Account/EditNameEmail', b, true)
}

export function editUserProfilePicture(b){
    return EDIT_REQUEST_FILE_API('Account/UpdateProfilePicture', b, true)
}

export function removeUserProfilePicture(b){
    return EDIT_REQUEST_FILE_API('Account/RemoveProfilePicture', b, true)
}



