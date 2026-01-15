import { ADD_REQUEST_BODY_API, ADD_REQUEST_FILE_API, EDIT_REQUEST_BODY_API, EDIT_REQUEST_FILE_API, GET_REQUEST_API, GET_REQUEST_BODY_API } from "./APIRequests";

const MAP_LS_STORAGE_NAME = 'MAP_HEAT_QUIZ_2023_ABCDEFG'
const MAP_KEY_LS_STORAGE_NAME = 'MAP_HEAT_QUIZ_2023_ABCDEFG_KEY'
const MAP_VISITS_LS_STORAGE_NAME = 'MAP_HEAT_QUIZ_2023_ABCDEFG_VISITS'

export function getMapRequest(Id){
    return GET_REQUEST_API('CourseMap/GetCourseMapPlayById_PORTAL/'+Id, null, false)
}

export function getRecentlyVistedMapsRequest(Ids){
    return ADD_REQUEST_FILE_API('CourseMap/GetRecentlyVisitedCourseMapsByIds/', Ids)
}

export function addMapPDFStatisticRequest(b){
    return ADD_REQUEST_FILE_API('CourseMap/AddPDFStatistic/', b)
}

export function getMapExtendedRequest(Id){
    return GET_REQUEST_API('CourseMap/GetCourseMapViewEditById_PORTAL/'+Id, null, false)
}

export function getMapElementStatisticsRequest(Id){
    return GET_REQUEST_API('CourseMap/GetCourseMapStatisticsById_PORTAL/'+Id, null, false)
}

export function addMapRequest(b){
    return ADD_REQUEST_FILE_API('CourseMap/AddMap/', b, true)
}

export function deleteMapElementRequest(b){
    return ADD_REQUEST_BODY_API('CourseMap/DeleteElement/', b, true)
}

export function attachMapToElementRequest(b){
    return ADD_REQUEST_FILE_API('CourseMap/AttachMapToElement/', b)
}

export function deattachMapToElementRequest(b){
    return ADD_REQUEST_FILE_API('CourseMap/DeattachMapToElement/', b)
}


export function editMapBasicInfoRequest(b){
    return EDIT_REQUEST_BODY_API('CourseMap/EditMapBasicInfo/', b)
}

export function addMapBadgeSystemRequest(b){
    return ADD_REQUEST_FILE_API('CourseMap/AddBadgeGroup/', b)
}

export function editMapBadgeSystemRequest(b){
    return EDIT_REQUEST_FILE_API('CourseMap/EditBadgeGroup/', b)
}

export function assignSeriesToMapElementRequest(b){
    return ADD_REQUEST_BODY_API('CourseMap/SetElementSeries/', b, true)
}

export function removeSeriesFromMapElementRequest(b){
    return ADD_REQUEST_BODY_API('CourseMap/DeleteElementSeries/', b, true)
}

export function assignPDFToMapElementRequest(b){
    return ADD_REQUEST_FILE_API('CourseMap/AddEditElementPDF/', b, true)
}

export function removePDFToMapElementRequest(b){
    return ADD_REQUEST_FILE_API('CourseMap/RemoveElementPDF/', b, true)
}

export function assignRelationToMapElementRequest(b){
    return ADD_REQUEST_BODY_API('CourseMap/AddEditElementRelation/', b, true)
}

export function assignRelationsToMapElementRequest(b){
    return ADD_REQUEST_FILE_API('CourseMap/AssingElementRelations/', b, true)
}

export function clearRelationsOfMapElementRequest(b){
    return EDIT_REQUEST_FILE_API('CourseMap/ClearElementRelations/', b, true)
}

export function removeRelationToMapElementRequest(b){
    return ADD_REQUEST_BODY_API('CourseMap/RemoveElementRelation/', b, true)
}

export function removeMapElementBadgeRequest(b){
    return EDIT_REQUEST_BODY_API('CourseMap/RemoveElementBadge/', b)
}

export function editMapElementBadgeProgressRequest(b){
    return EDIT_REQUEST_BODY_API('CourseMap/EditElementBadgePercentage/', b)
}

export function editMapElementBadgeImageRequest(b){
    return EDIT_REQUEST_FILE_API('CourseMap/EditElementBadge/', b)
}

export function assignClickListToMapElementRequest(b){
    return ADD_REQUEST_FILE_API('CourseMapElementImages/SelectImageGroup/', b, true)
}

export function deassignClickListToMapElementRequest(b){
    return EDIT_REQUEST_FILE_API('CourseMapElementImages/DeassignImagesList/', b)
}

export function removeMapElementRequest(b){
    return EDIT_REQUEST_BODY_API('CourseMap/EditMapElementBasicInfo/', b)
}

export function removeMapBadgeEntityRequest(b){
    return EDIT_REQUEST_FILE_API('CourseMap/RemoveBadgeGroupEntity/', b)
}

export function editMapElementBasicInfoRequest(b){
    return EDIT_REQUEST_BODY_API('CourseMap/EditMapElementBasicInfo/', b)
}

export function editBadgeSystemEntityRequest(b){
    return EDIT_REQUEST_FILE_API('CourseMap/EditBadgeGroupEntity/', b)
}

export function addBadgeSystemEntityRequest(b){
    return ADD_REQUEST_FILE_API('CourseMap/AddBadgeGroupEntities/', b)
}

export function assignBadgeSystemToElementRequest(b){
    return ADD_REQUEST_FILE_API('CourseMap/CopyBadgeGroupEntities/', b)
}

export function reassignMapToCourseRequest(b){
    return EDIT_REQUEST_FILE_API('CourseMap/ReassignMap/', b)
}

export function removeBadgeSystemRequest(b){
    return EDIT_REQUEST_FILE_API('CourseMap/RemoveBadgeGroup/', b)
}

export function editMapImageRequest(b){
    return EDIT_REQUEST_FILE_API('CourseMap/EditMapImage/', b)
}

export function getMapPlayStatisticsRequest_LS(Id){
    const results_LS = localStorage.getItem(MAP_LS_STORAGE_NAME + Id)

    const result_JSON = results_LS ? JSON.parse(results_LS) : ({
        ElementsProgress:[]
    })

    return result_JSON
}

export function updateMapPlayStatisticsRequest_LS(data){
    const {Id, ElementsProgress} = data

    localStorage.setItem(MAP_LS_STORAGE_NAME + Id, JSON.stringify(({
        ElementsProgress:ElementsProgress
    })))

    const result_JSON = localStorage.getItem(MAP_LS_STORAGE_NAME + Id)

    return JSON.parse(result_JSON)
}

export function getMapKey_LS(Id){
    const key = localStorage.getItem(MAP_KEY_LS_STORAGE_NAME + Id)
    return key
}

export function updateMapKey_LS(Id, key){
    localStorage.setItem(MAP_KEY_LS_STORAGE_NAME + Id, key)
    return key
}

export function getMapVisit_LS(){
    const results_LS = localStorage.getItem(MAP_VISITS_LS_STORAGE_NAME) || ""

    return results_LS.split(',')
}

export function recordMapVisit_LS(Id){
    //read from local storage
    let results_LS = localStorage.getItem(MAP_VISITS_LS_STORAGE_NAME) || ""

    //convert to list
    //omit empty or null values
    results_LS = results_LS.split(',').filter(a => a)

    //check if already included
    if(!results_LS.includes(Id)){

        //Top 5 visited
        if(results_LS.length < 5) {
            results_LS.push(Id);
        }
        //First in last out data structure
        else{
            let new_list = results_LS.slice(1)
            new_list.push(Id)

            results_LS = new_list
        }
    }

    //convert back to string 
    results_LS = results_LS.join(',')

    //save to local storage
    localStorage.setItem(MAP_VISITS_LS_STORAGE_NAME, results_LS)
}