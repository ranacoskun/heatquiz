import {ADD_REQUEST_BODY_API, ADD_REQUEST_FILE_API, EDIT_REQUEST_BODY_API, EDIT_REQUEST_FILE_API, GET_REQUEST_API, GET_REQUEST_BODY_API } from "./APIRequests";

export function searchQuestionsRequest(b){
    return GET_REQUEST_BODY_API('SimpleClickable/GetQuestions_ADVANCED2_PORTAL', b, true)
}

export function searchQuestionsByIdsRequest(b){
    return GET_REQUEST_BODY_API('SimpleClickable/GetQuestionsByIds_ADVANCED_PORTAL', b, true)
}

export function getQuestionMedianTimeRequest(Id){
    return GET_REQUEST_API('Statistics/GetQuestionStatisticDetailed', Id)
}


export function getClickableQuestionPlayRequest(Id){
    return GET_REQUEST_API('SimpleClickable/GetQuestion_APP', Id)
}

export function getMultipleChoiceQuestionPlayRequest(Id){
    return GET_REQUEST_API('MultipleChoiceQuestion/GetQuestion_PORTAL', Id)
}

export function getKeyboardQuestionPlayRequest(Id){
    return GET_REQUEST_API('KeyboardQuestion/GetQuestion_PORTAL', Id)
}


export function getEnergyBalanceQuestionPlayRequest(Id){
    return GET_REQUEST_API('EnergyBalanceQuestionUpdated/GetQuestion_PORTAL', Id)
}

export function getFBDQuestionPlayRequest(Id){
    return GET_REQUEST_API('FreebodyDiagramQuestion/GetQuestion_PORTAL', Id)
}

export function getDiagramQuestionPlayRequest(Id){
    return GET_REQUEST_API('DiagramQuestion/GetQuestion_PORTAL', Id)
}

export function getPVDiagramQuestionPlayRequest(Id){
    return GET_REQUEST_API('PVDiagramQuestion/GetQuestion_PORTAL', Id)
} 

export function addQuestionStatisticRequest(b){
    return ADD_REQUEST_BODY_API('SimpleClickable/PostStatistic', b)
}


export function addQuestionPDFStatisticRequest(b){
    return ADD_REQUEST_FILE_API('SimpleClickable/AddQuestionPDFStatistic', b)
}

export function copyQuestionRequest(b){
    return ADD_REQUEST_BODY_API('SimpleClickable/CopyQuestion', b)
}

export function editQuestionBasicInfoRequest(b){
    return ADD_REQUEST_BODY_API('SimpleClickable/EditQuestionBaseInfo', b, true)
}

export function removeQuestionSolutionRequest(b){
    return EDIT_REQUEST_FILE_API('SimpleClickable/RemoveQuestionSolution', b)
}

export function addQuestionSolutionRequest(b){
    return ADD_REQUEST_FILE_API('SimpleClickable/AddEditQuestionPDF', b, true)
}


export function getQuestionRelationsRequest(Id){
    return GET_REQUEST_API('SimpleClickable/GetQuestionSeriesMapRelations_PORTAL', Id)
}

export function GetQuestionStatisticsRequest(Id){
    return GET_REQUEST_API('SimpleClickable/GetQuestionStatisticTotal', Id)
}

//Mutliple choice question edit functions
export function addMultipleChoiceQuestionRequest(b){
    return ADD_REQUEST_FILE_API('MultipleChoiceQuestion/AddQuestionSingleStep', b, true)
}

export function addMultipleChoiceQuestionChoiceRequest(b){
    return ADD_REQUEST_FILE_API('MultipleChoiceQuestion/AddQuestionAnswer', b)
}

export function removeMultipleChoiceQuestionChoiceLatexRequest(b){
    return EDIT_REQUEST_FILE_API('MultipleChoiceQuestion/RemoveQuestionAnswerLatex', b) // should be changed later
}

export function removeMultipleChoiceQuestionChoiceImageRequest(b){
    return EDIT_REQUEST_FILE_API('MultipleChoiceQuestion/RemoveQuestionAnswerImage', b) // should be changed later
}

export function editMultipleChoiceQuestionLatexRequest(b){
    return EDIT_REQUEST_BODY_API('MultipleChoiceQuestion/EditQuestionLatex', b)
}


export function editMultipleChoiceQuestionAdditionalInfoRequest(b){
    return EDIT_REQUEST_BODY_API('MultipleChoiceQuestion/EditQuestionAdditionalInfo', b)
}

export function editMultipleChoiceQuestionImageRequest(b){
    return EDIT_REQUEST_FILE_API('MultipleChoiceQuestion/AddEditQuestionImage', b)
}

export function editMultipleChoiceQuestionChoiceRequest(b){
    return EDIT_REQUEST_FILE_API('MultipleChoiceQuestion/EditQuestionAnswer', b)
}

export function removeMultipleChoiceQuestionChoiceRequest(b){
    return EDIT_REQUEST_BODY_API('MultipleChoiceQuestion/RemoveQuestionAnswer', b) // should be changed later
}

//Keyboard question edit functions
export function addKeyboardQuestionRequest(b){
    return ADD_REQUEST_FILE_API('KeyboardQuestion/AddQuestionSingleStep', b, true)
}

export function addKeyboardQuestionAnswerRequest(b){
    return EDIT_REQUEST_BODY_API('KeyboardQuestion/AddQuestionAnswer', b)
}

export function removeKeyboardQuestionAnswerRequest(b){
    return EDIT_REQUEST_BODY_API('KeyboardQuestion/RemoveQuestionAnswer', b)
}

export function editKeyboardQuestionLatexRequest(b){
    return EDIT_REQUEST_BODY_API('KeyboardQuestion/EditQuestionLatex', b)
}


export function editKeyboardQuestionImageRequest(b){
    return EDIT_REQUEST_FILE_API('KeyboardQuestion/AddEditQuestionImage', b)
}

export function getKeyboardQuestionWrongAnswersRequest(b){
    return GET_REQUEST_API('KeyboardQuestion/GetKeyboardQuestionWrongAnswers_PORTAL', b)
}

//Clickable question edit functions
export function addClickableQuestionRequest(b){
    return ADD_REQUEST_FILE_API('SimpleClickable/AddQuestionSingleStep', b, true)
}

export function editClickableQuestionAnswerRequest(b){
    return EDIT_REQUEST_BODY_API('SimpleClickable/UpdateClickableImageAnswer', b, true)
}

export function deleteClickableQuestionPartRequest(b){
    return EDIT_REQUEST_BODY_API('SimpleClickable/RemoveClickable', b)
}

export function addClickableQuestionPartsRequest(b){
    return ADD_REQUEST_FILE_API('SimpleClickable/AddNewQuestionParts', b)
}

export function editClickableQuestionImageRequest(b){
    return EDIT_REQUEST_FILE_API('SimpleClickable/AddEditQuestionBackgroundImage', b)
}

//Energy balance question
export function addEnergyBalanceQuestionRequest(b){
    return ADD_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/AddQuestionSingleStep', b, true)
}

export function editEnergyBalanceLatexRequest(b){
    return EDIT_REQUEST_BODY_API('EnergyBalanceQuestionUpdated/EditQuestionText', b)
}

export function editEnergyBalanceImageRequest(b){
    return EDIT_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/AddEditQuestionBackgroundImage', b)
}

export function addEnergyBalanceControlVolumeRequest(b){
    return EDIT_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/AddControlVolume', b)
}

export function editEnergyBalanceControlVolumeStatusRequest(b){
    return EDIT_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/SetControlVolumeAsCorrect', b)
}

export function editEnergyBalanceControlVolumeCommentRequest(b){
    return EDIT_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/SetControlVolumeComment', b)
}

export function editEnergyBalanceBCICCommentRequest(b){
    return EDIT_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/SetBCICComment', b)
}

export function editEnergyBalanceControlVolumeImageRequest(b){
    return EDIT_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/EditControlVolumePicture', b)
}

export function removeEnergyBalanceControlVolumeRequest(b){
    return EDIT_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/DeleteControlVolume', b)
}

export function editEnergyBalanceTermCodeLatexTextRequest(b){
    return EDIT_REQUEST_BODY_API('EnergyBalanceQuestionUpdated/EditEBTermCodeLatexText', b)
}

export function editEnergyBalanceEBT_Direction_Request(b){
    return EDIT_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/EditEBTermDirections', b)
}

export function addEnergyBalanceEBT_Question_Request(b){
    return ADD_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/AddEBTermQuestion', b)
}

export function addEnergyBalanceEBT_Request(b){
    return ADD_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/AddEBTerm', b)
}

export function removeEnergyBalanceEBT_Request(b){
    return ADD_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/DeleteEBTerm', b)
}

export function removeEnergyBalanceEBT_Question_Request(b){
    return EDIT_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/DeleteEBTermQuestion', b)
}

export function editEnergyBalanceEBT_Question_Latex_Request(b){
    return EDIT_REQUEST_BODY_API('EnergyBalanceQuestionUpdated/EditEBTermQuestionLatex', b)
}

export function flipEnergyBalanceEBT_Question_Direction_Request(b){
    return EDIT_REQUEST_BODY_API('EnergyBalanceQuestionUpdated/EditEBTermQuestionFlow', b)
}

export function editEnergyBalanceBCKeyboardRequest(b){
    return EDIT_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/SetBoundaryConditionKeyboard', b)
}

export function addEnergyBalanceBCRequest(b){
    return ADD_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/AddBoundaryCondition', b)
}

export function removeEnergyBalanceBCRequest(b){
    return ADD_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/RemoveBoundaryCondition', b)
}


export function editEnergyBalanceICKeyboardRequest(b){
    return EDIT_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/SetInitialConditionKeyboard', b)
}

export function addEnergyBalanceICRequest(b){
    return ADD_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/AddInitialCondition', b)
}

export function removeEnergyBalanceICRequest(b){
    return ADD_REQUEST_FILE_API('EnergyBalanceQuestionUpdated/RemoveInitialCondition', b)
}

//FBD Quesiton
export function editFBDQuestionBodyRequest(b){
    return EDIT_REQUEST_BODY_API('FreebodyDiagramQuestion/EditQuestionText', b)
}

export function editFBDArrowLengthRequest(b){
    return EDIT_REQUEST_FILE_API('FreebodyDiagramQuestion/EditArrowLength', b)
}

export function editFBDObjectBodyColorRequest(b){
    return EDIT_REQUEST_BODY_API('FreebodyDiagramQuestion/EditOBColor', b)
}

export function editFBDObjectBodyCommentRequest(b){
    return EDIT_REQUEST_BODY_API('FreebodyDiagramQuestion/EditOBComment', b)
}


export function editFBDVectorTermColorRequest(b){
    return EDIT_REQUEST_BODY_API('FreebodyDiagramQuestion/EditVTColor', b)
}

export function editFBDVectorTermRequest(b){
    return EDIT_REQUEST_BODY_API('FreebodyDiagramQuestion/EditVTCodeLatexTextAngleDirection', b)
}

export function editFBDVectorTermAssociationRequest(b){
    return EDIT_REQUEST_FILE_API('FreebodyDiagramQuestion/EditVTAssociation', b)
}

export function editFBDQuestionImageRequest(b){
    return EDIT_REQUEST_FILE_API('FreebodyDiagramQuestion/AddEditQuestionBackgroundImage', b)
}

export function addFBDQuestionOBRequest(b){
    return ADD_REQUEST_BODY_API('FreebodyDiagramQuestion/AddObjectBody', b)
}

export function removeFBDQuestionOBRequest(b){
    return EDIT_REQUEST_FILE_API('FreebodyDiagramQuestion/DeleteObjectBody', b)
}

export function addFBDQuestionVTRequest(b){
    return ADD_REQUEST_FILE_API('FreebodyDiagramQuestion/AddVectorTerm', b)
}

export function removeFBDQuestionVTRequest(b){
    return EDIT_REQUEST_FILE_API('FreebodyDiagramQuestion/DeleteVectorTerm', b)
}

export function addFBDQuestionRequest(b){
    return ADD_REQUEST_FILE_API('FreebodyDiagramQuestion/AddQuestionSingleStep', b, true)
}

//PV Diagram
export function addPVDiagramQuestionRequest(b){
    return ADD_REQUEST_FILE_API('PVDiagramQuestion/AddQuestionSingleStep', b, true)
} 

export function editPVDiagramQuestionGroupInfoRequest(b){
    return ADD_REQUEST_BODY_API('PVDiagramQuestion/UpdateGroupInfo', b, true)
} 

export function editPVDiagramQuestionConditionCommentRequest(b){
    return ADD_REQUEST_FILE_API('PVDiagramQuestion/UpdateConditionComment', b, true)
} 


