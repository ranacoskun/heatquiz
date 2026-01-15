import { ADD_REQUEST_BODY_API, ADD_REQUEST_FILE_API, EDIT_REQUEST_FILE_API, GET_REQUEST_API } from "./APIRequests";

const DATAPOOL_LS_ID_KEY = 'USER_DATA_POOL_ID_HEAT_QUIZ_APP'

export function getDatapools(){
    return GET_REQUEST_API('DataPools/GetDataPools')
}

export function getDatapoolsAdmin(){
    return GET_REQUEST_API('DataPools/GetDataPoolsAdmin')
}

export function AddDataPoolRequest(b){
    return ADD_REQUEST_BODY_API('DataPools/AddDataPool', b, false)
}

export function EditDataPoolRequest(b){
    return ADD_REQUEST_BODY_API('DataPools/EditDataPool', b, false)
}

export function EditDataPoolAccessRequest(b){
    return ADD_REQUEST_BODY_API('DataPools/EditDataPoolAccess', b, false)
}

export function getUserNotificationSubscriptionsRequest(){
    return GET_REQUEST_API('DataPools/GetUserNotificationSubscriptions')
}

export function subscribeQuestionFeedbackRequest(data){
    return ADD_REQUEST_FILE_API('DataPools/SubscribeNotifications', data, false)
}

export function unsubscribeQuestionFeedbackRequest(data){
    return EDIT_REQUEST_FILE_API('DataPools/UnsubscribeNotifications', data, false)
}

export function registerFeedbackSeenRequest(){
    return GET_REQUEST_API('DataPools/RegisterSeenNotifications')
}



export function getCurrentDatapool(){
    const datapoolId = localStorage.getItem(DATAPOOL_LS_ID_KEY)

    return Number(datapoolId)
}

export function setCurrentDatapool(datapool){
    localStorage.setItem(DATAPOOL_LS_ID_KEY, datapool.value) 
}