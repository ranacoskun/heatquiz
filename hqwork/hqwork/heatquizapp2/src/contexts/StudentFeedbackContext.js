import React, { useContext } from "react"
import { addQuestionFeedbackRequest, getFeedbackDebugCodeQuery, getQuestionFeedbackQuery, getQuestionFeedbackReferenceQuery, getStudentFeedbackQuery } from "../services/StudentFeedback"
import { useAsyncFn } from "../hooks/useAsync"

const Context = React.createContext()

export function useStudentFeedback(){
    return useContext(Context)
}

export function StudentFeedbackProvider ({children}){
    
    //Fetch feedback from API
    const {loading: loadingStudentFeedback, value: studentFeedback, error: getStudentFeedbackError, execute: getStudentFeedback} = useAsyncFn((q) => getStudentFeedbackQuery(q))
    const {loading: loadingQuestionFeedback, value: questionFeedback, error: getQuestionFeedbackError, execute: getQuestionFeedback} = useAsyncFn((q) => getQuestionFeedbackQuery(q))
    const {loading: loadingDebugCodeDecryption, value: debugCodeDecryption, error: decryptDebugCodeError, execute: decryptDebugCode} = useAsyncFn((q) => getFeedbackDebugCodeQuery(q))
    const {loading: loadingReferenceQuestion, value: referenceQuestionResult, error: referenceQuestionError, execute: referenceQuestion} = useAsyncFn((q) => getQuestionFeedbackReferenceQuery(q))
    const {loading: loadingAddFeedback, value: addFeedbackResult, error: addFeedbackError, execute: addFeedback} = useAsyncFn((f) => addQuestionFeedbackRequest(f))
   
    return(
        <Context.Provider value = {{
            loadingStudentFeedback,
            studentFeedback,
            getStudentFeedbackError,
            getStudentFeedback,

            loadingQuestionFeedback,
            questionFeedback,
            getQuestionFeedbackError,
            getQuestionFeedback,

            loadingDebugCodeDecryption,
            debugCodeDecryption,
            decryptDebugCodeError,
            decryptDebugCode,

            loadingReferenceQuestion,
            referenceQuestionResult,
            referenceQuestionError,
            referenceQuestion,

            loadingAddFeedback,
            addFeedbackResult,
            addFeedbackError,
            addFeedback
        }}>
            {children}
        </Context.Provider>
    )
}