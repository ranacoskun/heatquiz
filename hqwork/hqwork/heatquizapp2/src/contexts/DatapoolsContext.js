import React, { useContext, useEffect, useState } from "react"
import { AddDataPoolRequest, EditDataPoolAccessRequest, EditDataPoolRequest, getCurrentDatapool, getDatapools, getDatapoolsAdmin, getUserNotificationSubscriptionsRequest, registerFeedbackSeenRequest, setCurrentDatapool, subscribeQuestionFeedbackRequest, unsubscribeQuestionFeedbackRequest } from "../services/Datapools"
import { useAsyncFn } from "../hooks/useAsync"

const Context = React.createContext()

export function useDatapools(){
    return useContext(Context)
}

export function DatapoolsProvider ({children}){
    //Fetch datapools from API
    const {value: datapools, errorGetDatapools, loading:isLoadingDatapools, execute: getAllDatapools} = useAsyncFn(() => getDatapools())
    const {value: datapoolsAdmin, errorGetDatapoolsAdmin, loading:isLoadingDatapoolsAdmin, execute: getAllDatapoolsAdmin} = useAsyncFn(() => getDatapoolsAdmin())

    const {value: AddDataPoolResult, errorAddDataPool, loading:isLoadingAddDataPool, execute: AddDataPool} = useAsyncFn((b) => AddDataPoolRequest(b))

    const {value: EditDataPoolResult, errorEditDataPool, loading:isLoadingEditDataPool, execute: EditDataPool} = useAsyncFn((b) => EditDataPoolRequest(b))

    const {value: EditDataPoolAccessResult, errorEditDataPoolAccess, loading:isLoadingEditDataPoolAccess, execute: EditDataPoolAccess} = useAsyncFn((b) => EditDataPoolAccessRequest(b))

    const {value: subscribeQuestionFeedbackResult, errorSubscribeQuestionFeedback, loading:isLoadingSubscribeQuestionFeedback, execute: subscribeQuestionFeedback} = useAsyncFn((b) => subscribeQuestionFeedbackRequest(b))
    const {value: unsubscribeQuestionFeedbackResult, errorUnsubscribeQuestionFeedback, loading:isLoadingUnsubscribeQuestionFeedback, execute: unsubscribeQuestionFeedback} = useAsyncFn((b) => unsubscribeQuestionFeedbackRequest(b))
    const {value: getUserNotificationSubscriptionsResult, errorGetUserNotificationSubscriptions, loading:isLoadingGetUserNotificationSubscriptions, execute: getUserNotificationSubscriptions} = useAsyncFn(() => getUserNotificationSubscriptionsRequest())
    const {value: registerFeedbackSeenResult, errorRegisterFeedbackSeen, loading:isLoadingRegisterFeedbackSeen, execute: registerFeedbackSeen} = useAsyncFn(() => registerFeedbackSeenRequest())

    const [selectedDatapool, setSelectedDatapool] = useState(null)

    function changeDatapool(datapool){

        //Update datapool Id in Local storage
        setCurrentDatapool(datapool)

        //Update datapool name in the state
        setSelectedDatapool(datapool.label)
    }

    useEffect(() => {        
        getAllDatapools().then((r) => {
            //Get data from response 
            const {data} = r

            //Get datapool saved on local storage
            const currentDatapool = getCurrentDatapool()

            //when daatapools are received from the database (API)
            if(data && data.length){
                //see if datapool exists
                const corrospondingDatapool = data.filter((d) => d.Id === currentDatapool)[0]

                if(corrospondingDatapool) setSelectedDatapool(corrospondingDatapool.NickName);

                //if datapool saved in local storage is not in the list, default it to null
                else setCurrentDatapool({value:null});
            }
            else{
                //Nullify current data pool if no proper response exists
                setCurrentDatapool({value:null})
            }
            
        })
    }, [])

    return(
        <Context.Provider value = {{
            datapools,
            errorGetDatapools, 
            isLoadingDatapools, 
            selectedDatapool,
            changeDatapool,

            datapoolsAdmin,
            errorGetDatapoolsAdmin, 
            isLoadingDatapoolsAdmin, 
            getAllDatapoolsAdmin,

            errorAddDataPool,
            isLoadingAddDataPool,
            AddDataPoolResult,
            AddDataPool,

            errorEditDataPool,
            isLoadingEditDataPool,
            EditDataPoolResult,
            EditDataPool,

            errorEditDataPoolAccess,
            isLoadingEditDataPoolAccess,
            EditDataPoolAccessResult,
            EditDataPoolAccess,

            subscribeQuestionFeedbackResult,
            isLoadingSubscribeQuestionFeedback,
            errorSubscribeQuestionFeedback,
            subscribeQuestionFeedback,

            unsubscribeQuestionFeedbackResult,
            isLoadingUnsubscribeQuestionFeedback,
            errorUnsubscribeQuestionFeedback,
            unsubscribeQuestionFeedback,

            getUserNotificationSubscriptionsResult,
            errorGetUserNotificationSubscriptions,
            isLoadingGetUserNotificationSubscriptions,
            getUserNotificationSubscriptions,

            registerFeedbackSeenResult,
            errorRegisterFeedbackSeen,
            isLoadingRegisterFeedbackSeen,
            registerFeedbackSeen
        }}>
            {children}
        </Context.Provider>
    )
}