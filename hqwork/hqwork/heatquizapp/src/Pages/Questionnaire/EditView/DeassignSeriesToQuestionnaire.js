import React, {useEffect, useState } from "react";
import { Button, Divider, Drawer, Dropdown, List, Skeleton, Space, message } from "antd";
import {ArrowLeftOutlined, TrophyOutlined, EditOutlined, RightCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import { beautifyDate, goToSeriesPlay, goToSeriesViewEdit, handleResponse } from "../../../services/Auxillary";
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import { ErrorComponent } from "../../../Components/ErrorComponent";

export function DeassignSeriesToQuestionnaire({open, onClose, survey, reloadSurvey}){

    if(!open) return <div/>;

    const {
        deassignQuestionnaireSeriesGetAssignedSeriesResult: quesitonnaire,
        errorDeassignQuestionnaireSeriesGetAssignedSeries: error,
        isLoadingDeassignQuestionnaireSeriesGetAssignedSeries: isLoading,
        deassignQuestionnaireSeriesGetAssignedSeries: getSeries,

        isLoadingDeassignQuestionnaireSeries,
        deassignQuestionnaireSeries
    } = useQuestionnaires();

    const [api, contextHolder] = message.useMessage()

    const [selectedSeries, setSelectedSeries] = useState([])
    const [isFirstTab, setIsFirstTab] = useState(false)

    useEffect(() => {
        setSelectedSeries([])
        setIsFirstTab(true)

        getSeries(survey.Id)
    },[open])

    const selectedDeselectSeries = (s, isSelected) => {
        let _selected = [...selectedSeries]

        if(isSelected) _selected = _selected.filter(ss => ss.Id !== s.Id);
        else _selected.push(s);

        setSelectedSeries(_selected)
    }

    const seriesList = (s, relation, isSelected) => [{
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
        onClick: () => selectedDeselectSeries(relation, isSelected)
    }]

    const renderSeries = () => {
        const {Relations: relations} = quesitonnaire

        return(
            <div className="hq-full-width">
                <Space>
                    <Button size="small" type="default" className="default-green" onClick={() => {
                        let _notSelectedRelations = relations.filter(a => !selectedSeries.map(r => r.Id).includes(a.Id))

                        let _selected = [...selectedSeries, ..._notSelectedRelations]

                        setSelectedSeries(_selected)

                    }}>
                        Select All
                    </Button>
                    <Button size="small" type="default" className="default-red" onClick={() => {
                        let _selected = [...selectedSeries]

                        _selected = _selected.filter(a => !relations.filter(r => r.Id === a.Id).length)

                        setSelectedSeries(_selected)

                    }}>
                        Deselect All
                    </Button>
                </Space>
                <br/>
                <br/>
                <List 
                    dataSource={relations}
                   renderItem={(r, ri) => {
                    const {Series, Id} = r
                    const {Code, DateCreated, AddedByName, Elements, IsRandom} = Series

                    const isSelected = selectedSeries.map(a => a.Id).includes(Id)

                    return(
                        <div className={"hq-full-width " + (isSelected ? "highlighted":"")} key={Id}>
                            <Space align="start" size="large">
                                <p className="default-gray">{ri+1}</p>

                                <div>
                                    <Dropdown
                                        menu={{
                                            title:'Actions',
                                            items:seriesList(r.Series, r, isSelected)
                                        }}
                                    >
                                        <p className={"hoverable "  + (isSelected ? "default-title" : "gray")}>{Code}</p>
                                    </Dropdown>
                                    <br/>
                                    <p className="default-gray">{AddedByName}</p>
                                    <p className="default-gray">{beautifyDate(DateCreated)}</p>
                                </div>
                                <div>
                                    <p className="series-list-item-code-adder-date-stats">{Elements.length} elements</p>
                                    {IsRandom && <p className="series-list-item-random-series">Random series</p>}
                                </div>
                                <div className="hq-clickable" onClick={() => selectedDeselectSeries(r, isSelected)}>
                                    {!isSelected ? 
                                        <RightCircleOutlined  className="default-title"/> 
                                        : 
                                        <CloseCircleOutlined  className="default-red"/>}
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

    const renderFinalizeDeassign = () => {
        return(
            <div>
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
                            data.append("SeriesIds", s.Series.Id)   
                        }

                        deassignQuestionnaireSeries(data).then(r => handleResponse(r, api, "Deassigned successfully", 1, () => {
                            onClose()
                            reloadSurvey()
                        }))
                    }}

                    disabled={!selectedSeries.length}
                    loading = {isLoadingDeassignQuestionnaireSeries}
                >
                    Deassign
                </Button>

                <br/>
                <br/>
                <List
                    dataSource={selectedSeries}
                    renderItem={(r, ri) => {
                        const {Series, Id} = r

                        const {Code, DateCreated, AddedByName, Elements, IsRandom} = Series

                        return(
                            <div className="hq-full-width" key={Id}>
                                <Space align="start" size="large">
                                    <p className="default-gray">{ri+1}</p>

                                    <div>
                                        <Dropdown
                                            menu={{
                                                title:'Actions',
                                                items:seriesList(r.Series, r, true)
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
                                    <div className="hq-clickable" onClick={() => selectedDeselectSeries(r, true)}>
                                        <CloseCircleOutlined className="default-red"/>
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
            <div className="hq-full-width">
                {isFirstTab && renderSeries()}
                {!isFirstTab && renderFinalizeDeassign()}
            </div>)
    }

    return(
        <Drawer
        title={
            <Space size="large">
                <p>Deassign Questionnaire from Series</p>

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
                    Finalize list & Deassign {' '} ({selectedSeries.length} selected)
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

            {isLoading && <Skeleton />}
            
            {error && 
            <ErrorComponent 
                error={error}
                onReload={() => getSeries(survey.Id)}
            />}

            {!(isLoading || error) && quesitonnaire && renderSections()}
        </Drawer>
    )
}