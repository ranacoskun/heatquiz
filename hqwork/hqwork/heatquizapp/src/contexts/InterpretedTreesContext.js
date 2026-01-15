import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import { addImageRequest, addInterpretedTreeRequest, editImageNameRequest, editImagePictureRequest, editImageValuesRequest, editInterpretedTreeRequest, getInterpretedTrees, getInterpretedValues, removeInterpretedNodeRequest, removeInterpretedTreeRequest } from "../services/InterpretedTrees"

const Context = React.createContext()

export function useInterpretedTrees(){
    return useContext(Context)
}

export function InterpretedTreesProvider ({children}){
    //Fetch from API
    const {value: interpretedTrees, errorGetInterpretedTrees, loading:isLoadingInterpretedTrees, execute: getAllInterpretedTrees} = useAsyncFn(() => getInterpretedTrees())
    const {value: interpretedValues, errorGetInterpretedValues, loading:isLoadingInterpretedValues, execute: getAllInterpretedValues} = useAsyncFn(() => getInterpretedValues())
    
    const {loading: loadingAddTree, error: getAddTreeError, execute: addTree} = useAsyncFn((b) => addInterpretedTreeRequest(b))
    const {loading: loadingEditTree, error: getEditTreeError, execute: editTree} = useAsyncFn((b) => editInterpretedTreeRequest(b))
    const {loading: loadingRemoveInterpretedTree, error: getRemoveInterpretedTreeError, execute: removeInterpretedTree} = useAsyncFn((b) => removeInterpretedTreeRequest(b))

    const {loading: loadingAddImage, error: getAddImageError, execute: addImage} = useAsyncFn((b) => addImageRequest(b))
    const {loading: loadingRemoveInterpretedNode, error: getRemoveInterpretedNodeError, execute: removeInterpretedNode} = useAsyncFn((b) => removeInterpretedNodeRequest(b))

    const {loading: loadingEditImageName, error: getEditImageNameError, execute: editImageName} = useAsyncFn((b) => editImageNameRequest(b))
    const {loading: loadingEditImagePicture, error: getEditImagePictureError, execute: editImagePicture} = useAsyncFn((b) => editImagePictureRequest(b))
    const {loading: loadingEditImageValues, error: getEditImageValuesError, execute: editImageValues} = useAsyncFn((b) => editImageValuesRequest(b))

    return(
        <Context.Provider value = {{
            interpretedTrees,
            errorGetInterpretedTrees, 
            isLoadingInterpretedTrees, 

            getAllInterpretedTrees,

            interpretedValues,
            errorGetInterpretedValues,
            isLoadingInterpretedValues,
            getAllInterpretedValues,
            
            loadingAddTree,
            getAddTreeError,
            addTree,

            loadingEditTree,
            getEditTreeError,
            editTree,

            loadingAddImage,
            getAddImageError,
            addImage,

            loadingEditImageName,
            getEditImageNameError,
            editImageName,

            loadingEditImagePicture,
            getEditImagePictureError,
            editImagePicture,

            loadingEditImageValues,
            getEditImageValuesError,
            editImageValues,

            loadingRemoveInterpretedTree,
            getRemoveInterpretedTreeError,
            removeInterpretedTree,

            loadingRemoveInterpretedNode,
            getRemoveInterpretedNodeError,
            removeInterpretedNode,

        }}>
            {children}
        </Context.Provider>
    )
}