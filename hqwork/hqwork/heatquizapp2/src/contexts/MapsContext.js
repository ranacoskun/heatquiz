import React, { useContext } from "react"
import { useAsyncFn } from "../hooks/useAsync"
import {addBadgeSystemEntityRequest, addMapBadgeSystemRequest, addMapPDFStatisticRequest, addMapRequest, assignBadgeSystemToElementRequest, assignClickListToMapElementRequest, assignPDFToMapElementRequest, assignRelationToMapElementRequest, assignRelationsToMapElementRequest, assignSeriesToMapElementRequest, attachMapToElementRequest, clearRelationsOfMapElementRequest, deassignClickListToMapElementRequest, deattachMapToElementRequest, deleteMapElementRequest, editBadgeSystemEntityRequest, editMapBadgeSystemRequest, editMapBasicInfoRequest, editMapElementBadgeImageRequest, editMapElementBadgeProgressRequest, editMapElementBasicInfoRequest, getMapElementStatisticsRequest, getMapExtendedRequest, getMapRequest, getRecentlyVistedMapsRequest, reassignMapToCourseRequest, removeBadgeSystemRequest, removeMapBadgeEntityRequest, removeMapElementBadgeRequest, removePDFToMapElementRequest, removeRelationToMapElementRequest, removeSeriesFromMapElementRequest, editMapImageRequest } from "../services/Maps"

const Context = React.createContext()

export function useMaps(){
    return useContext(Context)
}

export function MapsProvider ({children}){
    
    //Fetch courses from API
    const {loading: loadingMap, value: map, error: getMapError, execute: getMap} = useAsyncFn((Id) => getMapRequest(Id))
    const {loading: loadingRecentlyVistedMaps, value: recentlyVistedMaps, error: getRecentlyVistedMapsError, execute: getRecentlyVistedMaps} = useAsyncFn((Ids) => getRecentlyVistedMapsRequest(Ids))
    
    const {loading: loadingAddMapPDFStatistic, value: addMapPDFStatisticResult, error: addMapPDFStatisticError, execute: addMapPDFStatistic} = useAsyncFn((b) => addMapPDFStatisticRequest(b))

    const {loading: loadingEditMapBasicInfo, value: editMapBasicInfoResult, error: editMapBasicInfoError, execute: editMapBasicInfo} = useAsyncFn((Id) => editMapBasicInfoRequest(Id))
    const {loading: loadingEditMapImage, value: editMapImageResult, error: editMapImageError, execute: editMapImage} = useAsyncFn((d) => editMapImageRequest(d))
    const {loading: loadingDeleteMapElement, value: deleteMapElementResult, error: deleteMapElementError, execute: deleteMapElement} = useAsyncFn((b) => deleteMapElementRequest(b))

    const {loading: loadingAddMapBadgeSystem, value: addMapBadgeSystemResult, error: addMapBadgeSystemError, execute: addMapBadgeSystem} = useAsyncFn((b) => addMapBadgeSystemRequest(b))
    const {loading: loadingRemoveBadgeSystem, value: removeBadgeSystemResult, error: removeBadgeSystemError, execute: removeBadgeSystem} = useAsyncFn((b) => removeBadgeSystemRequest(b))
    const {loading: loadingEditMapBadgeSystem, value: editMapBadgeSystemResult, error: editMapBadgeSystemError, execute: editMapBadgeSystem} = useAsyncFn((b) => editMapBadgeSystemRequest(b))

    const {loading: loadingMapExtended, value: mapExtended, error: getMapExtendedError, execute: getMapExtended} = useAsyncFn((Id) => getMapExtendedRequest(Id))
    const {loading: loadingMapElementStatistics, value: mapElementStatistics, error: getMapElementStatisticsError, execute: getMapElementStatistics} = useAsyncFn((Id) => getMapElementStatisticsRequest(Id))

    const {loading: loadingAddMap, value: addMapResult, error: addMapError, execute: addMap} = useAsyncFn((Id) => addMapRequest(Id))
    const {loading: loadingAssignSeriesToMapElement, value: assignSeriesToMapElementResult, error: assignSeriesToMapElementError, execute: assignSeriesToMapElement} = useAsyncFn((b) => assignSeriesToMapElementRequest(b))
    const {loading: loadingRemoveSeriesFromMapElement, value: removeSeriesFromMapElementResult, error: removeSeriesFromMapElementError, execute: removeSeriesFromMapElement} = useAsyncFn((b) => removeSeriesFromMapElementRequest(b))

    const {loading: loadingAssignPDFToMapElement, value: assignPDFToMapElementResult, error: assignPDFToMapElementError, execute: assignPDFToMapElement} = useAsyncFn((b) => assignPDFToMapElementRequest(b))
    const {loading: loadingRemovePDFToMapElement, value: removePDFToMapElementResult, error: removePDFToMapElementError, execute: removePDFToMapElement} = useAsyncFn((b) => removePDFToMapElementRequest(b))

    const {loading: loadingAttachMapToElement, value: attachMapToElementResult, error: attachMapToElementError, execute: attachMapToElement} = useAsyncFn((b) => attachMapToElementRequest(b))
    const {loading: loadingDeattachMapToElement, value: deattachMapToElementResult, error: deattachMapToElementError, execute: deattachMapToElement} = useAsyncFn((b) => deattachMapToElementRequest(b))

    const {loading: loadingAssignRelationToMapElement, value: assignRelationToMapElementResult, error: assignRelationToMapElementError, execute: assignRelationToMapElement} = useAsyncFn((b) => assignRelationToMapElementRequest(b))
    const {loading: loadingAssignRelationsToMapElement, value: assignRelationsToMapElementResult, error: assignRelationsToMapElementError, execute: assignRelationsToMapElement} = useAsyncFn((b) => assignRelationsToMapElementRequest(b))
    const {loading: loadingClearRelationsOfMapElement, value: clearRelationsOfMapElementResult, error: clearRelationsOfMapElementError, execute: clearRelationsOfMapElement} = useAsyncFn((b) => clearRelationsOfMapElementRequest(b))

    const {loading: loadingRemoveRelationToMapElement, value: removeRelationToMapElementResult, error: removeRelationToMapElementError, execute: removeRelationToMapElement} = useAsyncFn((b) => removeRelationToMapElementRequest(b))

    const {loading: loadingAssignClickListToMapElement, value: assignClickListToMapElementResult, error: assignClickListToMapElementError, execute: assignClickListToMapElement} = useAsyncFn((b) => assignClickListToMapElementRequest(b))
    const {loading: loadingDeassignClickListToMapElement, value: deassignClickListToMapElementResult, error: deassignClickListToMapElementError, execute: deassignClickListToMapElement} = useAsyncFn((b) => deassignClickListToMapElementRequest(b))

    const {loading: loadingEditMapElementBasicInfo, value: editMapElementBasicInfoResult, error: editMapElementBasicInfoError, execute: editMapElementBasicInfo} = useAsyncFn((b) => editMapElementBasicInfoRequest(b))

    const {loading: loadingRemoveMapElementBadge, value: removeMapElementBadgeResult, error: removeMapElementBadgeError, execute: removeMapElementBadge} = useAsyncFn((b) => removeMapElementBadgeRequest(b))
    const {loading: loadingRemoveMapBadgeEntity, value:removeMapBadgeEntityResult, error: removeMapBadgeEntityError, execute: removeMapBadgeEntity} = useAsyncFn((b) => removeMapBadgeEntityRequest(b))

    const {loading: loadingEditMapElementBadgeProgress, value: editMapElementBadgeProgressResult, error: editMapElementBadgeProgressError, execute: editMapElementBadgeProgress} = useAsyncFn((b) => editMapElementBadgeProgressRequest(b))
    const {loading: loadingEditMapElementBadgeImage, value: editMapElementBadgeImageResult, error: editMapElementBadgeImageError, execute: editMapElementBadgeImage} = useAsyncFn((b) => editMapElementBadgeImageRequest(b))

    const {loading: loadingEditBadgeSystemEntity, value: editBadgeSystemEntityResult, error: editBadgeSystemEntityError, execute: editBadgeSystemEntity} = useAsyncFn((b) => editBadgeSystemEntityRequest(b))
    const {loading: loadingAddBadgeSystemEntity, value: addBadgeSystemEntityResult, error: addBadgeSystemEntityError, execute: addBadgeSystemEntity} = useAsyncFn((b) => addBadgeSystemEntityRequest(b))
    const {loading: loadingAssignBadgeSystemToElement, value: assignBadgeSystemToElementResult, error: assignBadgeSystemToElementError, execute: assignBadgeSystemToElement} = useAsyncFn((b) => assignBadgeSystemToElementRequest(b))
    
    const {loading: loadingReassignMapToCourse, value: reassignMapToCourseResult, error: reassignMapToCourseError, execute: reassignMapToCourse} = useAsyncFn((b) => reassignMapToCourseRequest(b))


    return(
        <Context.Provider value = {{
            loadingMap,
            getMapError,
            map,
            getMap,

            loadingAddMapPDFStatistic,
            addMapPDFStatisticError,
            addMapPDFStatisticResult,
            addMapPDFStatistic,

            loadingMapExtended,
            getMapExtendedError,
            mapExtended,
            getMapExtended,

            loadingMapElementStatistics,
            mapElementStatistics,
            getMapElementStatisticsError,
            getMapElementStatistics,

            loadingAddMap,
            addMapError,
            addMapResult,
            addMap,

            loadingDeleteMapElement,
            deleteMapElementResult,
            deleteMapElementError,
            deleteMapElement,

            loadingEditMapBasicInfo,
            editMapBasicInfoResult,
            editMapBasicInfoError,
            editMapBasicInfo,

            loadingEditMapImage,
            editMapImageResult,
            editMapImageError,
            editMapImage,

            loadingAddMapBadgeSystem,
            addMapBadgeSystemResult,
            addMapBadgeSystemError,
            addMapBadgeSystem,

            loadingEditMapBadgeSystem,
            editMapBadgeSystemResult,
            editMapBadgeSystemError,
            editMapBadgeSystem,

            loadingAssignSeriesToMapElement,
            assignSeriesToMapElementResult,
            assignSeriesToMapElementError,
            assignSeriesToMapElement,

            loadingRemoveSeriesFromMapElement,
            removeSeriesFromMapElementResult,
            removeSeriesFromMapElementError,
            removeSeriesFromMapElement,

            loadingAssignPDFToMapElement,
            assignPDFToMapElementResult,
            assignPDFToMapElementError,
            assignPDFToMapElement,

            loadingRemovePDFToMapElement,
            removePDFToMapElementResult,
            removePDFToMapElementError,
            removePDFToMapElement,

            loadingAssignRelationToMapElement,
            assignRelationToMapElementResult,
            assignRelationToMapElementError,
            assignRelationToMapElement,

            loadingAssignRelationsToMapElement,
            assignRelationsToMapElementResult,
            assignRelationsToMapElementError,
            assignRelationsToMapElement,

            loadingClearRelationsOfMapElement,
            clearRelationsOfMapElementResult,
            clearRelationsOfMapElementError,
            clearRelationsOfMapElement,

            loadingRemoveRelationToMapElement,
            removeRelationToMapElementResult,
            removeRelationToMapElementError,
            removeRelationToMapElement,

            loadingAssignClickListToMapElement,
            assignClickListToMapElementResult,
            assignClickListToMapElementError,
            assignClickListToMapElement,

            loadingDeassignClickListToMapElement,
            deassignClickListToMapElementResult,
            deassignClickListToMapElementError,
            deassignClickListToMapElement,

            loadingEditMapElementBasicInfo,
            editMapElementBasicInfoResult,
            editMapElementBasicInfoError,
            editMapElementBasicInfo,

            loadingRemoveMapElementBadge,
            removeMapElementBadgeResult,
            removeMapElementBadgeError,
            removeMapElementBadge,

            loadingEditMapElementBadgeProgress,
            editMapElementBadgeProgressResult,
            editMapElementBadgeProgressError,
            editMapElementBadgeProgress,

            loadingEditMapElementBadgeImage,
            editMapElementBadgeImageResult,
            editMapElementBadgeImageError,
            editMapElementBadgeImage,

            loadingEditBadgeSystemEntity,
            editBadgeSystemEntityResult,
            editBadgeSystemEntityError,
            editBadgeSystemEntity,

            loadingRemoveMapBadgeEntity,
            removeMapBadgeEntityResult,
            removeMapBadgeEntityError,
            removeMapBadgeEntity,

            loadingAddBadgeSystemEntity,
            addBadgeSystemEntityResult,
            addBadgeSystemEntityError,
            addBadgeSystemEntity,

            loadingAssignBadgeSystemToElement,
            assignBadgeSystemToElementResult,
            assignBadgeSystemToElementError,
            assignBadgeSystemToElement,

            loadingRemoveBadgeSystem,
            removeBadgeSystemResult,
            removeBadgeSystemError,
            removeBadgeSystem,

            loadingAttachMapToElement,
            attachMapToElementResult,
            attachMapToElementError,
            attachMapToElement,

            loadingDeattachMapToElement,
            deattachMapToElementResult,
            deattachMapToElementError,
            deattachMapToElement,

            loadingRecentlyVistedMaps,
            recentlyVistedMaps,
            getRecentlyVistedMapsError,
            getRecentlyVistedMaps,

            loadingReassignMapToCourse,
            reassignMapToCourseResult,
            reassignMapToCourseError,
            reassignMapToCourse
        }}>
            {children}
        </Context.Provider>
    )
}