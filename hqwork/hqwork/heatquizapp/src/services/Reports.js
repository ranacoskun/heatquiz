import { GET_REQUEST_BODY_API } from "./APIRequests";

export function getNumericStatisticsQuery(query){
    return GET_REQUEST_BODY_API('SimpleClickable/GetStudentReport', query, true)
}

export function getGraphicalStatisticsQuery(query){
    return GET_REQUEST_BODY_API('SimpleClickable/GetGraphicalStudentReport', query, true)
}

export function getPlayerTimelineQuery(query){
    return GET_REQUEST_BODY_API('Statistics/GetSpecificStudentReportTimeline', query, true)
}


