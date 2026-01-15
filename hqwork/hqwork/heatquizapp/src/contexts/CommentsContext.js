import React, { useContext } from "react"
import { addQuestionCommentRequest, getQuestionCommentsQuery, getUnreadCommentsQuery, registerCommentViewRequest, searchUserCommentsQuery } from "../services/Comments"
import { useAsyncFn } from "../hooks/useAsync"

const Context = React.createContext()

export function useComments(){
    return useContext(Context)
}

export function CommentsProvider ({children}){
    
    //Fetch Comments from API
    const {loading: loadingQuestionComments, value: questionComments, error: getQuestionCommentsError, execute: getQuestionComments} = useAsyncFn((q) => getQuestionCommentsQuery(q))
    const {loading: loadingSearchUserComments, value: searchUserCommentsResult, error: searchUserCommentsError, execute: searchUserComments} = useAsyncFn((q) => searchUserCommentsQuery(q))
    const {loading: loadingAddComment, value: addCommentResult, error: addCommentError, execute: addComment} = useAsyncFn((f) => addQuestionCommentRequest(f))
   
    const {loading: loadingUnreadComments, value: getUnreadCommentsResult, error: getUnreadCommentsError, execute: getUnreadComments} = useAsyncFn(() => getUnreadCommentsQuery())
    const {loading: loadingRegisterCommentView, value: registerCommentViewResult, error: registerCommentViewError, execute: registerCommentView} = useAsyncFn((v) => registerCommentViewRequest(v))

    return(
        <Context.Provider value = {{
           
            loadingQuestionComments,
            questionComments,
            getQuestionCommentsError,
            getQuestionComments,

            loadingAddComment,
            addCommentResult,
            addCommentError,
            addComment,

            loadingUnreadComments,
            getUnreadCommentsResult,
            getUnreadCommentsError,
            getUnreadComments,

            loadingRegisterCommentView,
            registerCommentViewResult,
            registerCommentViewError,
            registerCommentView,

            loadingSearchUserComments,
            searchUserCommentsResult,
            searchUserCommentsError,
            searchUserComments
        }}>
            {children}
        </Context.Provider>
    )
}