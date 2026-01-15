import React, { useEffect, useState } from "react";
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import {ArrowLeftOutlined, TrophyOutlined, EditOutlined, RightCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import { Button, Space, Drawer,  message, Skeleton, Col, Row, Dropdown } from "antd";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { beautifyDate, handleResponse } from "../../../services/Auxillary";
import { useNavigate } from "react-router-dom";

export function AddEditQuestionnaireSeries({open, onClose, series, reloadData}){
    if(!open) return <div/>;

    const [api, contextHolder] = message.useMessage()
    const naviagate = useNavigate()

    const {
        surveys, errorGetSurveys, isLoadingSurveys, getAllSurveys,
        isLoadingAssignQuestionnaireSeries, assignQuestionnaireSeries,} = useQuestionnaires()

    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null)

    useEffect(() => {
        setSelectedQuestionnaire(null)
        getAllSurveys()
    }, [open])

    const QList = (q) => {
        return([{
            key: 'view_edit_questionnaire',
            label: 'View / edit',
            icon: <EditOutlined/>,
            onClick: () => naviagate('/questionnaire_edit_view/'+q.Id)
        },
        {
            key: 'play_questionnaire',
            label: 'Play',
            icon: <TrophyOutlined style={{color:'green'}}/> ,
            onClick: () => {naviagate('/questionnaire_play/'+q.Id)}
        },

        ])
    }

    const renderSurveys = () => {
        return(
            <div className="hq-full-width">
                <Row className="hq-full-width">
                    {surveys.map((s, si) => {
                        const {Code, Id, DateCreated} = s

                        const isSelected = selectedQuestionnaire && Id === selectedQuestionnaire.Id

                        return(
                            <Col 
                                xs={4} 
                                key={Id} 
                                className={"hq-element-container " + (isSelected ? "highlighted":"")}
                            >
                                <Space className="hq-full-width hq-opposite-arrangement" align="start">
                                    <Space direction="vertical">
                                        <Dropdown
                                            menu={{
                                                items:QList(s),
                                                title:'Actions'
                                                }}
                                            >
                                            <Space  className="hoverable">
                                                <p className="default-gray">{si+1}</p>
                                                <p className="default-title">{Code}</p>
                                            </Space>
                                        </Dropdown>
                                        
                                        <Space>
                                            <p className="default-gray">{beautifyDate(DateCreated)}</p>
                                        </Space>
                                    </Space>

                                    <div className="hq-clickable" onClick={() => setSelectedQuestionnaire(isSelected ? null : s)}>
                                        {!isSelected ? 
                                        <RightCircleOutlined  className="default-title"/> 
                                        : 
                                        <CloseCircleOutlined  className="default-red"/>}
                                    </div>
                                </Space>
                            </Col>
                        )
                    })}
                </Row>
            </div>
        )
    }

    return(
        <Drawer
            title={
                <Space size="large">
                    <p>Add/Edit Questionnaire</p>

                    <Button
                        size="small"
                        type="primary"
                        loading={isLoadingAssignQuestionnaireSeries}
                        onClick={() => {
                            if(!selectedQuestionnaire){
                                api.destroy()
                                api.warning("Please select a questionnaire")
                            }

                            const data = new FormData()

                            data.append("SurveyId", selectedQuestionnaire.Id)

                            data.append("SeriesIds", series.Id)   
    
                            assignQuestionnaireSeries(data).then(r => handleResponse(r, api, "Assigned successfully", 1, () => {
                                onClose()
                                reloadData()
                            }))
                        }}
                    >
                        Update
                    </Button>
                </Space>
            }
            width={'100%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}

            footer={<Space><p className="default-gray">Selected:</p> {selectedQuestionnaire && <p className="">{selectedQuestionnaire.Code}</p>}</Space>}
        >
            {contextHolder}
            
            {isLoadingSurveys && <Skeleton />}
            {errorGetSurveys && 
            <ErrorComponent 
                error={errorGetSurveys}
                onReload={() => getAllSurveys()}
            />}

            {!(isLoadingSurveys || errorGetSurveys) && surveys && renderSurveys()}
        </Drawer>
    )
}