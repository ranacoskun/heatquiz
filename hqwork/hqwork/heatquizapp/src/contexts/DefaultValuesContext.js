import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import {addBackgroundImageRequest, addDefaultImageRequest, editBackgroundImageImageRequest, editBackgroundImageNameRequest, editDefaultImageImageRequest, editDefaultImageNameRequest, getBackgroundImagesRequest, getClickImagesListsRequest, getDefaultImagesRequest, removeBackgroundImageRequest, removeDefaultImageRequest } from "../services/DefaultValues"

const Context = React.createContext()

export function useDefaultValues(){
    return useContext(Context)
}

export function DefaultValuesProvider({children}){
    //Fetch from API
    const {value: DefaultImages, error: errorGetDefaultImages, loading:isLoadingDefaultImages, execute: getDefaultImages} = useAsyncFn(() => getDefaultImagesRequest())
    const {value: addDefaultImageResult, error: errorAddDefaultImage, loading:isLoadingAddDefaultImage, execute: addDefaultImage} = useAsyncFn((b) => addDefaultImageRequest(b))
    const {value: editDefaultImageNameResult, error: errorEditDefaultImageName, loading:isLoadingEditDefaultImageName, execute: editDefaultImageName} = useAsyncFn((b) => editDefaultImageNameRequest(b))
    const {value: editDefaultImageImageResult, error: errorEditDefaultImageImage, loading:isLoadingEditDefaultImageImage, execute: editDefaultImageImage} = useAsyncFn((b) => editDefaultImageImageRequest(b))
    const {value: removeDefaultImageImageResult, error: errorRemoveDefaultImage, loading:isLoadingRemoveDefaultImage, execute: removeDefaultImage} = useAsyncFn((b) => removeDefaultImageRequest(b))


    const {value: BackgroundImages, error: errorGetBackgroundImages, loading:isLoadingBackgroundImages, execute: getBackgroundImages} = useAsyncFn(() => getBackgroundImagesRequest())
    const {value: addBackgroundImageResult, error: errorAddBackgroundImage, loading:isLoadingAddBackgroundImage, execute: addBackgroundImage} = useAsyncFn((b) => addBackgroundImageRequest(b))
    const {value: editBackgroundImageNameResult, error: errorEditBackgroundImageName, loading:isLoadingEditBackgroundImageName, execute: editBackgroundImageName} = useAsyncFn((b) => editBackgroundImageNameRequest(b))
    const {value: editBackgroundImageImageResult, error: errorEditBackgroundImageImage, loading:isLoadingEditBackgroundImageImage, execute: editBackgroundImageImage} = useAsyncFn((b) => editBackgroundImageImageRequest(b))
    const {value: removeBackgroundImageResult, error: errorRemoveBackgroundImage, loading:isLoadingRemoveBackgroundImage, execute: removeBackgroundImage} = useAsyncFn((b) => removeBackgroundImageRequest(b))
    
    
    const {value: ClickImagesLists, error: errorGetClickImagesLists, loading:isLoadingClickImagesLists, execute: getClickImagesLists} = useAsyncFn(() => getClickImagesListsRequest())

    return(
        <Context.Provider value = {{
            DefaultImages,
            errorGetDefaultImages, 
            isLoadingDefaultImages, 
            getDefaultImages,

            BackgroundImages,
            errorGetBackgroundImages,
            isLoadingBackgroundImages,
            getBackgroundImages,

            ClickImagesLists,
            errorGetClickImagesLists,
            isLoadingClickImagesLists,
            getClickImagesLists,

            isLoadingAddDefaultImage,
            addDefaultImageResult,
            errorAddDefaultImage,
            addDefaultImage,

            isLoadingEditDefaultImageName,
            editDefaultImageNameResult,
            errorEditDefaultImageName,
            editDefaultImageName,

            isLoadingEditDefaultImageImage,
            editDefaultImageImageResult,
            errorEditDefaultImageImage,
            editDefaultImageImage,

            isLoadingRemoveDefaultImage,
            removeDefaultImageImageResult,
            errorRemoveDefaultImage,
            removeDefaultImage,

            isLoadingAddBackgroundImage,
            addBackgroundImageResult,
            errorAddBackgroundImage,
            addBackgroundImage,

            isLoadingEditBackgroundImageName,
            editBackgroundImageNameResult,
            errorEditBackgroundImageName,
            editBackgroundImageName,

            isLoadingEditBackgroundImageImage,
            editBackgroundImageImageResult,
            errorEditBackgroundImageImage,
            editBackgroundImageImage,

            isLoadingRemoveBackgroundImage,
            errorRemoveBackgroundImage,
            removeBackgroundImageResult,
            removeBackgroundImage
        }}>
            {children}
        </Context.Provider>
    )
}