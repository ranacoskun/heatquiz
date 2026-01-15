import {Button, Col, Drawer, Dropdown, Row, Skeleton, Space, message} from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, RightCircleOutlined, CloseCircleOutlined, EditOutlined, TrophyOutlined} from '@ant-design/icons';
import { useQuestionnaires } from "../../../../contexts/QuestionnaireContext";
import { useNavigate } from "react-router-dom";
import { beautifyDate, handleResponse } from "../../../../services/Auxillary";
import { ErrorComponent } from "../../../../Components/ErrorComponent";


export function AssignQuestionnaireToElement({open, onClose, element, reloadMap}){
    
    if(!open) return <div/>;
    const [api, contextHolder] = message.useMessage()
    const naviagate = useNavigate()

    const [selectedSurvey, setSelectedSurvey] = useState(null)

    const {surveys, errorGetSurveys, isLoadingSurveys, getAllSurveys,
        isLoadingAssignQuestionnaireMapElement,assignQuestionnaireMapElement,} = useQuestionnaires() 

    useEffect(() => {
        getAllSurveys()
        setSelectedSurvey(null)
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
        }
        ])
    }

    const renderSurveys = () => {
        return(
            <div className="hq-full-width">
                <Row className="hq-full-width">
                    {surveys.map((s, si) => {
                        const {Code, Id, DateCreated} = s

                        const isSelected = selectedSurvey && Id === selectedSurvey.Id

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

                                    <div className="hq-clickable" onClick={() => setSelectedSurvey(isSelected ? null : s)}>
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
                <p>Attach Questionnaire to Element</p>

                <Button
                    size="small"
                    type="primary"
                    loading={isLoadingAssignQuestionnaireMapElement}
                    onClick={() => {
                        if(!selectedSurvey){
                            api.destroy()
                            api.warning("Please select a questionnaire")
                        }

                        const data = new FormData()

                        data.append("SurveyId", selectedSurvey.Id)

                        data.append("MapElementId", element.Id)   

                        assignQuestionnaireMapElement(data).then(r => handleResponse(r, api, "Assigned successfully", 1, () => {
                            onClose()
                            reloadMap()
                        }))
                    }}
                >
                    Assign
                </Button>
            </Space>
        }
        width={'100%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={<Space><p className="default-gray">Selected:</p> {selectedSurvey && <p className="">{selectedSurvey.Code}</p>}</Space>}
    >
            {contextHolder}
            {isLoadingSurveys && <Skeleton />}

            {errorGetSurveys && 
                <ErrorComponent
                    error={errorGetSurveys}
                    onReload={() => getAllSurveys()}
                />
            }

            {!(isLoadingSurveys || errorGetSurveys) && surveys && renderSurveys()}
        </Drawer>
    )
}