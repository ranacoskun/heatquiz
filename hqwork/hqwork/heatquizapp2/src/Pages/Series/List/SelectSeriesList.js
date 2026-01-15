import React from "react";
import { useState } from "react";
import { useSeries } from "../../../contexts/SeriesContext";
import { Col, Empty, Row, Skeleton, Space } from "antd";
import { beautifyDatetime } from "../../../services/Auxillary";
import { SeriesSearchTool } from "./SeriesSearchTool";

export function SelectSeriesList({onSelect}){
    const {
        isLoadingSeriesQuery, SeriesQuery,
        isLoadingSeriesByIdsQuery, SeriesByIdsQuery
    } = useSeries() 

    const [firstIndex, setFirstIndex] = useState(0)

    const renderSeries = () => {
        let series = []
        if(SeriesQuery && !isLoadingSeriesQuery){
            series = SeriesQuery.Series
        }

        if(SeriesByIdsQuery && !isLoadingSeriesByIdsQuery){
            series = SeriesByIdsQuery
        }
        
        return(
           <div>
            {series.length ? 
            <Row
                gutter={24}
            >
                {series.map((q, qi) => {

                const {Code, AddedByName, DateCreated, IsRandom, Elements} = q

                return(
                    <Col
                        xs={12}
                        className="series-list-item-container-0"
                    >
                    <div className="series-list-item-container-0-internal">
                            <div className="series-list-item-container-1">
                                <p 
                                onClick={() => onSelect(q)}
                                className="hoverable-plus">
                                    <span className="series-list-item-index">{firstIndex + qi+1}</span>
                                    {Code}
                                </p>
                                <br/>

                                <p className="series-list-item-code-adder-date-stats">{AddedByName}</p>
                                <p className="series-list-item-code-adder-date-stats">{beautifyDatetime(DateCreated)}</p>


                            </div>
                            <div>
                                <p className="series-list-item-code-adder-date-stats">{Elements.length} elements</p>
                                {IsRandom && <p className="series-list-item-random-series">Random series</p>}
                            </div>
                    </div>
                    
                </Col>
                )
                })}
                </Row> : <Space align="center">{!(isLoadingSeriesByIdsQuery || isLoadingSeriesQuery) && <Empty />}</Space>}
           </div>
        )
    }

    return(
        <div>
            <SeriesSearchTool  onSetFirstIndex={(i) => setFirstIndex(i)}/>
            <br/>
            {(isLoadingSeriesQuery || isLoadingSeriesByIdsQuery) && <Skeleton />}
            {(!(isLoadingSeriesByIdsQuery || isLoadingSeriesByIdsQuery) && (SeriesQuery || SeriesByIdsQuery)) && renderSeries()}

        </div>
    )
}