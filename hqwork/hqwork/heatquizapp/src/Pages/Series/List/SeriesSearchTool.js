import React, { useEffect } from "react";
import './List.css'
import { useState } from "react";
import { Button, Col, Input, Row, Select, Space, Spin, Switch } from "antd";
import { useSeries } from "../../../contexts/SeriesContext";
import { GetPagesArray } from "../../../services/Auxillary";
import { useDatapools } from "../../../contexts/DatapoolsContext";

export function SeriesSearchTool({onSetFirstIndex}){
    const {isLoadingSeriesAdders, SeriesAdders, getSeriesAdders,
        isLoadingSeriesQuery, SeriesQuery, searchSeries,
    } = useSeries() 

    const {selectedDatapool} = useDatapools()


    const [seriesCode, setSeriesCode] = useState('')
    const [selectedAdder, setSelectedAdder] = useState(null)

    const [selectedPerPage, setSelectedPerPage] = useState(50)
    const [selectedPage, setSelectedPage] = useState(1)

    const [getUnusedSeries, setGetUnusedSeries] = useState(false)


    useEffect(() => {
        setGetUnusedSeries(false)
        setSelectedPage(1)
    }, [])

    useEffect(() => {
        getSeriesAdders()
        setSelectedAdder(null)
    }, [selectedDatapool])


    const searchData = () => {
        const VM = ({
            Code:seriesCode.trim(),
            Page:0,
            QperPage:selectedPerPage,
            Adder: (selectedAdder === 'Any') ? null : selectedAdder,
            Used: !getUnusedSeries
        })

        searchSeries(VM)

        onSetFirstIndex(0)
        setSelectedPage(1)
    }

    const getAllData = () => {
        const VM = ({
            Code: "",
            Page:0,
            QperPage:selectedPerPage,
            Adder: null,
            Used: true
        })

        searchSeries(VM)

        onSetFirstIndex(0)
        setSelectedPage(1)
    }

    const renderPagesCols = () => {
        const {Codes, NumberOfSeries, SeriesIds} = SeriesQuery
        const pageCols = GetPagesArray(NumberOfSeries, selectedPerPage, Codes)
        console.log(selectedPage)
        return(
            <div>
                <Row
                    className="pages-single-row"
                    gutter={8}
                >
                    {pageCols.map((c, ci) => 
                    <Col 
                        key={ci}
                        className={(selectedPage === (ci+1)) ? "pages-single-col-selected" : "pages-single-col"}

                        onClick={() => {
                            console.log(ci)
                            setSelectedPage(ci+1)
                            onSetFirstIndex(ci*selectedPerPage)

                            const Ids = SeriesIds.slice(ci*selectedPerPage, (ci + 1)*selectedPerPage)

                            const VM = ({Ids, Codes, NumberOfSeries, SeriesIds})

                            searchSeries(VM, true)
                        }}
                    >
                        <p className="pages-single-value">{c.Index + ' ' + c.Character}</p>
                    </Col>
                )}
                </Row>
                <small className="search-result"> {NumberOfSeries} series</small>
            </div>
        )
    }

    return(
        <div className="series-search-container">
            <div className="series-search-inner-container">
                <Row
                    gutter={12}
                    className="series-search-input-container"
                >
                    <Col>
                        <Input
                            placeholder="Series code or part of it"
                            value={seriesCode}
                            onChange={(v) => setSeriesCode(v.target.value.trim())}
                            suffix = {<small className="suffix-word">Code</small>}
                        />
                    </Col>
                    <Col >
                        <div className="series-search-input-select">
                        {isLoadingSeriesAdders ?
                            <Spin/>
                            :
                            <Select
                                className="series-search-input-select"
                                onChange={(v, option) => {
                                    setSelectedAdder(option.value)
                                }}
                                defaultValue={'please select'}
                                value={(selectedAdder || 'please select')}

                                options={(['Any', ...(SeriesAdders || [])]).map((d) => ({
                                    value: d,
                                    label: d
                                    }))}

                                suffixIcon={<span>Added by</span>}
                            />}
                        </div>
                    </Col>
                    <Col>
                        <Switch 
                        onChange={(v) => setGetUnusedSeries(v)}
                        checkedChildren="Get unused series" 
                        unCheckedChildren="Get unused series" />
                    </Col>
                    <Col >
                        <Select
                            className="series-search-input-select-page"
                            onChange={(v, option) => {
                                const value = option.value

                                setSelectedPerPage(value)
                            }}
                            defaultValue={'please select'}
                            value={selectedPerPage}

                            options={[50,20,10].map(v => ({value:v, label:v}))}
                            suffixIcon={<span>Series per page</span>}
                        />
                    </Col>
                </Row>

                <Space
                    className="series-search-buttons-line"
                >
                    <Button
                        loading={isLoadingSeriesQuery}
                        size="small"
                        onClick={searchData}
                    >
                        Search
                    </Button>
                    <Button
                        loading={isLoadingSeriesQuery}

                        size="small"
                        onClick={getAllData}
                    >
                        Get all series
                    </Button>
                </Space>

            </div>
            {isLoadingSeriesQuery ? <Spin /> : (SeriesQuery && renderPagesCols())}

        </div>
    )
}