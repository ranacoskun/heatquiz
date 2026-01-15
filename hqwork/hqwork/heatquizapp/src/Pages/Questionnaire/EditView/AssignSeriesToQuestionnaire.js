import { Button, Col, Divider, Drawer, Dropdown, List, Row, Skeleton, Space, message } from "antd";
import React, {useEffect, useState } from "react";
import {ArrowLeftOutlined, TrophyOutlined, EditOutlined, PlusCircleOutlined, MinusCircleOutlined} from '@ant-design/icons';
import { SeriesSearchTool } from "../../Series/List/SeriesSearchTool";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { useSeries } from "../../../contexts/SeriesContext";
import { beautifyDate, goToSeriesPlay, goToSeriesViewEdit, handleResponse } from "../../../services/Auxillary";
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";

export function AssignSeriesToQuestionnaire({open, onClose, survey, reloadSurvey}){

    if(!open) return <div/>;

    const {isLoadingSeriesQuery, errorGetSeriesQuery, SeriesQuery,} = useSeries() 
    const {isLoadingAssignQuestionnaireSeries, assignQuestionnaireSeries,} = useQuestionnaires() 
    
    const [api, contextHolder] = message.useMessage()

    const [selectedSeries, setSelectedSeries] = useState([])
    const [firstIndex, setFirstIndex] = useState(0)

    const [isFirstTab, setIsFirstTab] = useState(false)

    useEffect(() => {
        setSelectedSeries([])
        setIsFirstTab(true)
        setFirstIndex(0)
    },[open])

    const selectedDeselectSeries = (s, isSelected) => {
        let _selected = [...selectedSeries]

        if(isSelected) _selected = _selected.filter(ss => ss.Id !== s.Id);
        else _selected.push(s);

        setSelectedSeries(_selected)
    }

    const seriesList = (s, isSelected) => [{
        key:'series_ply',
        label:'Play series',
        icon: <TrophyOutlined className="default-green" />,
        onClick: () => goToSeriesPlay(s)
    },{
        key:'series_view',
        label:'Edit view series',
        icon: <EditOutlined />,
        onClick: () => goToSeriesViewEdit(s)
    },{
        key:'select_deselect_series',
        label:(!isSelected ? 'Select ' : 'Deselect ') + 'Series',
        icon: <EditOutlined />,
        onClick: () => selectedDeselectSeries(s, isSelected)
    }]

    const renderSeries = () => {
        const {Relations} = survey
        const series = SeriesQuery.Series.filter(s => !Relations.filter(r => r.SeriesId === s.Id).length)

        return(
            <div className="hq-full-width">
                <br/>
                <Space>
                    <Button size="small" type="default" className="default-green" onClick={() => {
                        let _notSelectedSeries = series.filter(a => !selectedSeries.map(s => s.Id).includes(a.Id))

                        let _selected = [...selectedSeries, ..._notSelectedSeries]

                        setSelectedSeries(_selected)

                    }}>
                        Select All
                    </Button>
                    <Button size="small" type="default" className="default-red" onClick={() => {
                        let _selected = [...selectedSeries]

                        _selected = _selected.filter(a => !series.filter(s => s.Id === a.Id).length)

                        setSelectedSeries(_selected)

                    }}>
                        Deselect All
                    </Button>
                </Space>
                <br/>
                <br/>
                <Row  className="hq-full-width">
                    {series.map((s, si) => {
                        const {Id, AddedByName, Code, DateCreated, Elements, IsRandom} = s
                        const isSelected = selectedSeries.map((ss) => ss.Id).includes(s.Id)

                        return(
                            <Col key={Id} xs={5} className={"hq-element-container " + (isSelected ? "highlighted" : "")} >
                                <Space align="start" className="hq-full-width hq-opposite-arrangement">
                                    <Space className="hq-full-width hq-opposite-arrangement" align="start" size="large">
                                        <p className="default-gray">{firstIndex + si+1}</p>
                                        <div>
                                            <Dropdown
                                                menu={{
                                                    title:'Actions',
                                                    items:seriesList(s, isSelected)
                                                }}
                                            >
                                                <p className={"hoverable " + (isSelected ? "default-title" : "default-gray")}>{Code}</p>
                                            </Dropdown>
                                            <br/>
                                            <p className="default-gray">{AddedByName}</p>
                                            <p className="default-gray">{beautifyDate(DateCreated)}</p>
                                        </div>

                                        <div>
                                            <p className="series-list-item-code-adder-date-stats">{Elements.length} elements</p>
                                            {IsRandom && <p className="series-list-item-random-series">Random series</p>}
                                        </div>
                                    </Space>

                                    <div className="hq-clickable" onClick={() => selectedDeselectSeries(s, isSelected)}>
                                        {!isSelected ? 
                                        <PlusCircleOutlined className="default-green"/> 
                                        : 
                                        <MinusCircleOutlined className="default-red"/>}
                                    </div>
                                </Space>
                            </Col>
                        )
                    })}
                </Row>
            </div>
        )
    }

    const renderSeriesSection = () => {
        return(
            <div className="hq-full-width">
                <SeriesSearchTool  onSetFirstIndex={(i) => setFirstIndex(i)}/>
                <small className="default-title">Already assigned series do not appear here.</small>
                <br/>
                {isLoadingSeriesQuery && <Skeleton />}
                
                {errorGetSeriesQuery && !isLoadingSeriesQuery && 
                    <ErrorComponent
                        error={errorGetSeriesQuery}
                        onReload={() => window.location.reload()}
                    />
                }

            {(!isLoadingSeriesQuery && SeriesQuery) && renderSeries()}
            </div>
        )
    }

    const renderFinalSection = () => {
        return(
            <div className="hq-full-width">
                <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                        if(!selectedSeries.length){
                            api.destroy()
                            api.warning("Please select series to assign")
                            return
                        }

                        const data = new FormData()

                        data.append("SurveyId", survey.Id)

                        for(const s of selectedSeries){
                            data.append("SeriesIds", s.Id)   
                        }

                        assignQuestionnaireSeries(data).then(r => handleResponse(r, api, "Assigned successfully", 1, () => {
                            onClose()
                            reloadSurvey()
                        }))
                    }}

                    disabled={!selectedSeries.length}
                    loading = {isLoadingAssignQuestionnaireSeries}
                >
                    Assign
                </Button>

                <br/>
                <br/>
                <List
                    dataSource={selectedSeries}
                    renderItem={(s, si) => {
                        const {Id, Code, DateCreated, AddedByName, Elements, IsRandom} = s

                        return(
                            <div className="hq-full-width" key={Id}>
                                <Space align="start" size="large">
                                    <p className="default-gray">{si+1}</p>

                                    <div>
                                        <Dropdown
                                            menu={{
                                                title:'Actions',
                                                items:seriesList(s, true)
                                            }}
                                        >
                                            <p className="hoverable default-title">{Code}</p>
                                        </Dropdown>
                                        <br/>
                                        <p className="default-gray">{AddedByName}</p>
                                        <p className="default-gray">{beautifyDate(DateCreated)}</p>
                                    </div>
                                    <div>
                                        <p className="series-list-item-code-adder-date-stats">{Elements.length} elements</p>
                                        {IsRandom && <p className="series-list-item-random-series">Random series</p>}
                                    </div>
                                    <div className="hq-clickable" onClick={() => selectedDeselectSeries(s, true)}>
                                        <MinusCircleOutlined className="default-red"/>
                                    </div>
                                </Space>
                                <Divider />
                            </div>
                        )
                    }}
                />
            </div>
        )
    }

    const renderSections = () => {
        return(
            <div>
                {isFirstTab && renderSeriesSection()}
                {!isFirstTab && renderFinalSection()}
            </div>
        )
    }

    return(
        <Drawer
        title={
            <Space size="large">
                <p>Assign Questionnaire to Series</p>

                <Button
                    size="small"
                    type={isFirstTab ? "primary" : "default"}

                    onClick={() => setIsFirstTab(true)}
                >
                    Select series
                </Button>

                <Button
                    size="small"
                    type={!isFirstTab ? "primary" : "default"}

                    onClick={() => setIsFirstTab(false)}
                >
                    Finalize list & Assign {' '} ({selectedSeries.length} selected)
                </Button>
            </Space>
        }
        width={'100%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        >
            {contextHolder}
            {renderSections()}
        </Drawer>
    )


}