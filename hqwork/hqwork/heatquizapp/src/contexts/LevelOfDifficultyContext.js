import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import { addLODRequest, getLODQuestionsRequest, getLODs, getLODsExtended } from "../services/LevelOfDiffulty"

const Context = React.createContext()

export function useLevelsOfDifficulty(){
    return useContext(Context)
}

export function LevelsOfDifficultyProvider ({children}){
    //Fetch from API
    const {value: LODs, errorGetLODs, loading:isLoadingLODs, execute: getAllLODs} = useAsyncFn(() => getLODs()) 

    const {value: LODsExtended, errorGetLODsExtended, loading:isLoadingLODsExtended, execute: getAllLODsExtended} = useAsyncFn(() => getLODsExtended()) 
    const {value: LODQuestions, errorGetLODQuestions, loading:isLoadingLODQuestions, execute: getLODQuestions} = useAsyncFn((Id) => getLODQuestionsRequest(Id)) 

    const {value: addLODResult, errorAddLOD, loading:isLoadingAddLOD, execute: addLOD} = useAsyncFn(() => addLODRequest()) 

    return(
        <Context.Provider value = {{
            isLoadingLODs,
            errorGetLODs,
            LODs,
            getAllLODs,

            isLoadingLODsExtended,
            errorGetLODsExtended,
            LODsExtended,
            getAllLODsExtended,

            isLoadingLODQuestions,
            errorGetLODQuestions,
            LODQuestions,
            getLODQuestions,

            isLoadingAddLOD,
            addLODResult,
            errorAddLOD,
            addLOD
        }}>
            {children}
        </Context.Provider>
    )
}