import { GET_REQUEST_API, LOGIN_REQUEST_API } from "./APIRequests";

const PLAYER_KEY_KEY = 'PLAYER_KEY_HEAT_QUIZ_APP'
const IS_STUDENT_KEY_KEY = 'IS_STUDENT_KEY_HEAT_QUIZ_APP'
const TOKEN_KEY = 'TOKEN_HEAT_QUIZ_APP'

const USER_KEY = 'USER_HEAT_QUIZ_APP'
const USERNAME_KEY = 'USERNAME_HEAT_QUIZ_APP'
const USER_ROLES_KEY = 'USER_ROLES_HEAT_QUIZ_APP'

//Function to add player key to local storage (5 random chars + date now)
export function setPlayerKey(){
    const newPlayerKey = makeid(5) +  Date.now()

    localStorage.setItem(PLAYER_KEY_KEY, newPlayerKey)

    return newPlayerKey
}

//Function to get player key from local storage
export function getPlayerKey(){
    let playerKey = localStorage.getItem(PLAYER_KEY_KEY)

    if(!playerKey) playerKey = setPlayerKey()

    return playerKey
}

//Function to add is student status to local storage
export function setIsStudent_LS(is_student){
    localStorage.setItem(IS_STUDENT_KEY_KEY, is_student)

}

//Function to get  is student status to local storage
export function getIsStudent_LS(){
    let is_student = localStorage.getItem(IS_STUDENT_KEY_KEY)

    return (is_student === 'true')
}

//Function to login
export function login({username, password, datapoolId}){
    return LOGIN_REQUEST_API(username, password, datapoolId)
}

//Function to check login status
export function getAuthData(){
    const playerKey = getPlayerKey()
    const token = getToken()

    const user = getUsername()
    const username = getUserFullname()

    return {playerKey, token, user, username}
}

//Function to check login status
export function checkAuthData(){
    return GET_REQUEST_API('Account/CheckUserToken')
}

//Function to add token to local storage 
export function setToken_LS(token){
    localStorage.setItem(TOKEN_KEY, token)
}

//Function get add token from local storage 
export function getToken(){
    return localStorage.getItem(TOKEN_KEY)
}

//Function to add user to local storage 
export function setUsername_LS(user){
    localStorage.setItem(USER_KEY, user)
}

//Function get user token from local storage 
export function getUsername(){
    return localStorage.getItem(USER_KEY)
}

//Function to add username to local storage 
export function setUserFullname_LS(username){
    localStorage.setItem(USERNAME_KEY, username)
}

//Function get username token from local storage 
export function getUserFullname(){
    return localStorage.getItem(USERNAME_KEY)
}


//Function to add user roles to local storage 
export function setUserRoles_LS(roles){
    const saveRoles = roles.join(',')
    localStorage.setItem(USER_ROLES_KEY, saveRoles)
}

//Function to get user roles from local storage 
export function getUserRoles_LS(){
    let results = localStorage.getItem(USER_ROLES_KEY) || ''

    results = results.split(',')

    return results
}



//Function to create and Id of 5 charactars - randomly selected
function makeid(length) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

   return result;
}