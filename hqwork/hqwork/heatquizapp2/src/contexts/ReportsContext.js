import React, { useContext } from "react"
import { useAsyncFn } from "../hooks/useAsync"
import { getGraphicalStatisticsQuery, getNumericStatisticsQuery, getPlayerTimelineQuery } from "../services/Reports"

const Context = React.createContext()

export function useReports(){
    return useContext(Context)
}

export function ReportsProvider ({children}){
    
    //Fetch report from API
    const {loading: loadingNumericStats, value: numericStats, error: getNumericStatsError, execute: getNumericStats} = useAsyncFn((q) => getNumericStatisticsQuery(q))
    const {loading: loadingGraphicalStats, value: graphicalStats, error: getGraphicalStatsError, execute: getGraphicalStats} = useAsyncFn((q) => getGraphicalStatisticsQuery(q))
    const {loading: loadingPlayerTimelineReport, value: playerTimelineReport, error: getPlayerTimelineReportError, execute: getPlayerTimelineReport} = useAsyncFn((q) => getPlayerTimelineQuery(q))

    return(
        <Context.Provider value = {{
            loadingNumericStats,
            numericStats,
            getNumericStatsError,
            getNumericStats,

            loadingGraphicalStats,
            graphicalStats,
            getGraphicalStatsError,
            getGraphicalStats,

            loadingPlayerTimelineReport,
            playerTimelineReport,
            getPlayerTimelineReportError,
            getPlayerTimelineReport
        }}>
            {children}
        </Context.Provider>
    )
}