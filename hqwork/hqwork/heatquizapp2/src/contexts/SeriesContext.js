import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import { addQuestionsToSeriesRequest, addSeriesRequest, addSeriesStatisticRequest, assignQuestionsToPoolRequest, decreasePoolsNumberSeriesRequest, deselectQuestionFromSeriesRequest, editQuestionsInfoRequest, getSeriesAddersRequest, getSeriesMedianTimeSpectrumRequest, getSeriesRequest, getSeriesStatisticsRequest, getSeriesViewEditRequest, increasePoolsNumberSeriesRequest, rearrangeSeriesRequest, searchSeriesByIdsRequest, searchSeriesRequest } from "../services/Series"

const Context = React.createContext()

export function useSeries(){
    return useContext(Context)
}

export function SeriesProvider ({children}){
    //Fetch from API
    const {value: Series, error: errorGetSeries, loading:isLoadingSeries, execute: getSeries} = useAsyncFn((code) => getSeriesRequest(code)) 
    const {value: SeriesViewEdit, error: errorGetSeriesViewEdit, loading:isLoadingSeriesViewEdit, execute: getSeriesViewEdit} = useAsyncFn((code) => getSeriesViewEditRequest(code)) 
    const {value: seriesMedianTimeSpectrum, error: errorGetSeriesMedianTimeSpectrum, loading:isLoadingGetSeriesMedianTimeSpectrum, execute: getSeriesMedianTimeSpectrum} = useAsyncFn((Id) => getSeriesMedianTimeSpectrumRequest(Id)) 


    const {value: SeriesStatistics, error:errorGetSeriesStatistics, loading:isLoadingSeriesStatistics, execute: getSeriesStatistics} = useAsyncFn((code) => getSeriesStatisticsRequest(code))
    const {value: SeriesAdders, error:errorGetSeriesAdders, loading:isLoadingSeriesAdders, execute: getSeriesAdders} = useAsyncFn(() => getSeriesAddersRequest())

    const {value: addSeriesStatisticResult, error:errorAddSeriesStatistic, loading:isLoadingAddSeriesStatistic, execute: postSeriesStatistic} = useAsyncFn((b) => addSeriesStatisticRequest(b)) 
   
    const {value: addSeriesResult, error:errorAddSeries, loading:isLoadingAddSeries, execute: addSeries} = useAsyncFn((b) => addSeriesRequest(b)) 
    
    const {value: editQuestionsInfoResult, error:errorEditQuestionsInfo, loading:isLoadingEditQuestionsInfo, execute: editQuestionsInfo} = useAsyncFn((b) => editQuestionsInfoRequest(b)) 
    const {value: addQuestionsToSeriesResult, error:errorAddQuestionsToSeries, loading:isLoadingAddQuestionsToSeries, execute: addQuestionsToSeries} = useAsyncFn((b) => addQuestionsToSeriesRequest(b)) 
    const {value: assignQuestionsToPoolResult, error:errorAssignQuestionsToPool, loading:isLoadingAssignQuestionsToPool, execute: assignQuestionsToPool} = useAsyncFn((b) => assignQuestionsToPoolRequest(b)) 
    const {value: deselectQuestionFromSeriesResult, error:errorDeselectQuestionFromSeries, loading:isLoadingDeselectQuestionFromSeries, execute: deselectQuestionFromSeries} = useAsyncFn((b) => deselectQuestionFromSeriesRequest(b)) 
    const {value: decreasePoolsNumberSeriesResult, error:errorDecreasePoolsNumberSeries, loading:isLoadingDecreasePoolsNumberSeries, execute: decreasePoolsNumberSeries} = useAsyncFn((b) => decreasePoolsNumberSeriesRequest(b)) 
    const {value: increasePoolsNumberSeriesResult, error:errorIncreasePoolsNumberSeries, loading:isLoadingIncreasePoolsNumberSeries, execute: increasePoolsNumberSeries} = useAsyncFn((b) => increasePoolsNumberSeriesRequest(b)) 
    const {value: rearrangeSeriesResult, error:errorRearrangeSeries, loading:isLoadingRearrangeSeries, execute: rearrangeSeries} = useAsyncFn((b) => rearrangeSeriesRequest(b)) 
    
    const {value: SeriesQuery, error: errorGetSeriesQuery, loading:isLoadingSeriesQuery, execute: searchSeries} = useAsyncFn((b, substream) => {
        if(substream){
            return searchSeriesByIdsRequest(b)
        }
        else{
            return searchSeriesRequest(b)
        }
    })
    
    return(
        <Context.Provider value = {{
            isLoadingSeries,
            errorGetSeries,
            Series,
            getSeries,

            isLoadingSeriesViewEdit,
            errorGetSeriesViewEdit,
            SeriesViewEdit,
            getSeriesViewEdit,

            isLoadingSeriesStatistics,
            errorGetSeriesStatistics,
            SeriesStatistics,
            getSeriesStatistics,    

            isLoadingSeriesAdders,
            errorGetSeriesAdders,
            SeriesAdders,
            getSeriesAdders,
            
            addSeriesStatisticResult,
            errorAddSeriesStatistic,
            isLoadingAddSeriesStatistic,
            postSeriesStatistic,

            isLoadingSeriesQuery,
            errorGetSeriesQuery,
            SeriesQuery,
            searchSeries,

            addSeriesResult,
            errorAddSeries,
            isLoadingAddSeries,
            addSeries,

            addQuestionsToSeriesResult,
            isLoadingAddQuestionsToSeries,
            errorAddQuestionsToSeries,
            addQuestionsToSeries,

            assignQuestionsToPoolResult,
            isLoadingAssignQuestionsToPool,
            errorAssignQuestionsToPool,
            assignQuestionsToPool,

            deselectQuestionFromSeriesResult,
            isLoadingDeselectQuestionFromSeries,
            errorDeselectQuestionFromSeries,
            deselectQuestionFromSeries,

            decreasePoolsNumberSeriesResult,
            isLoadingDecreasePoolsNumberSeries,
            errorDecreasePoolsNumberSeries,
            decreasePoolsNumberSeries,

            increasePoolsNumberSeriesResult,
            isLoadingIncreasePoolsNumberSeries,
            errorIncreasePoolsNumberSeries,
            increasePoolsNumberSeries,

            editQuestionsInfoResult,
            editQuestionsInfo,
            isLoadingEditQuestionsInfo,
            errorEditQuestionsInfo,

            rearrangeSeriesResult,
            errorRearrangeSeries,
            isLoadingRearrangeSeries,
            rearrangeSeries,

            seriesMedianTimeSpectrum,
            isLoadingGetSeriesMedianTimeSpectrum,
            errorGetSeriesMedianTimeSpectrum,
            getSeriesMedianTimeSpectrum
        }}>
            {children}
        </Context.Provider>
    )
}