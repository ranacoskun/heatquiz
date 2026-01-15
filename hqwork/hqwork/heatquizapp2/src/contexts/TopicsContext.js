import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import { addSubtopicRequest, addTopicRequest, editSubtopicName, editTopicName, getTopics, removeSubtopicRequest, removeTopicRequest } from "../services/Topics"

const Context = React.createContext()

export function useTopics(){
    return useContext(Context)
}

export function TopicsProvider ({children}){
    //Fetch from API
    const {value: topics, errorGetTopics, loading:isLoadingTopics, execute: getAllTopics} = useAsyncFn(() => getTopics())

    const {loading: loadingAddTopic, error: getAddTopicError, execute: addTopic} = useAsyncFn((b) => addTopicRequest(b))
    const {loading: loadingAddSubtopic, error: getAddSubtopicError, execute: addSubtopic} = useAsyncFn((b) => addSubtopicRequest(b))

    const {loading: loadingEditName, error: getEditNameError, execute: updateTopicName} = useAsyncFn((b) => editTopicName(b))
    const {loading: loadingEditSubtopicName, error: getEditSubtopicNameError, execute: updateSubtopicName} = useAsyncFn((b) => editSubtopicName(b))

    const {loading: loadingRemoveTopic, error: getRemoveTopicError, execute: removeTopic} = useAsyncFn((b) => removeTopicRequest(b))
    const {loading: loadingRemoveSubtopic, error: getRemoveSubtopicError, execute: removeSubtopic} = useAsyncFn((b) => removeSubtopicRequest(b))


    return(
        <Context.Provider value = {{
            topics,
            errorGetTopics, 
            isLoadingTopics, 

            getAllTopics,

            loadingEditName,
            getEditNameError,
            updateTopicName,

            loadingEditSubtopicName,
            getEditSubtopicNameError,
            updateSubtopicName,

            loadingAddTopic,
            getAddTopicError,
            addTopic,

            loadingAddSubtopic, 
            getAddSubtopicError,
            addSubtopic,

            loadingRemoveTopic,
            getRemoveTopicError,
            removeTopic,

            loadingRemoveSubtopic,
            getRemoveSubtopicError,
            removeSubtopic
        }}>
            {children}
        </Context.Provider>
    )
}