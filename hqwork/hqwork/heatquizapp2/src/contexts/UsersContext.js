import React, { useContext, useEffect } from "react"
import { useAsyncFn } from "../hooks/useAsync"
import { addNewUserRequest, editUserNameEmail, editUserProfilePicture, getAllUsers, removeUserProfilePicture } from "../services/Users"
import { useAuth } from "./AuthContext"

const Context = React.createContext()

export function useUsers(){
    return useContext(Context)
}

export function UsersProvider ({children}){

    const {isStudent} = useAuth()

    //Fetch users from API
    const {loading: loadingUsers, value: users, error: getUserError, execute: getUsers} = useAsyncFn(() => getAllUsers())
    const {loading: loadingAddNewUser, value: addNewUserResult, error: addNewUserError, execute: addNewUser} = useAsyncFn(() => addNewUserRequest())

    //Edit name email
    const {loading: loadingEditNameEmail, error: getEditNameEmailError, execute: updateUserNameEmail} = useAsyncFn((b) => editUserNameEmail(b))
    const {loading: loadingEditProfilePicture, error: getEditProfilePictureError, execute: updateUserProfilePicture} = useAsyncFn((b) => editUserProfilePicture(b))
    const {loading: loadingRemoveProfilePicture, error: getRemoveProfilePictureError, execute: deleteUserProfilePicture} = useAsyncFn((b) => removeUserProfilePicture(b))
    
    useEffect(() => {
        if(!isStudent){
            getUsers()
        }
    }, [isStudent])

    return(
        <Context.Provider value = {{
            loadingUsers, 
            users,
            getUserError,
            getUsers,
            
            loadingEditNameEmail,
            getEditNameEmailError,
            updateUserNameEmail,

            loadingEditProfilePicture,
            getEditProfilePictureError,
            updateUserProfilePicture,

            loadingRemoveProfilePicture,
            getRemoveProfilePictureError,
            deleteUserProfilePicture,

            loadingAddNewUser,
            addNewUserResult,
            addNewUserError,
            addNewUser
        }}>
            {children}
        </Context.Provider>
    )
}