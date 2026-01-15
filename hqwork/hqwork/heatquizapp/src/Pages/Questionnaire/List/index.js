import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import {Col, Divider, Dropdown, Row, Space, Skeleton, message, Popconfirm } from "antd";
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { beautifyDate, handleResponse } from "../../../services/Auxillary";
import {EditOutlined, TrophyOutlined, CopyOutlined, DeleteOutlined} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useDatapools } from "../../../contexts/DatapoolsContext";
import { CopyQuestionnaire } from "../EditView/CopyQuestionnaire";

export function QuestionnairesList(){

    const [api, contextHolder] = message.useMessage()
    const naviagate = useNavigate()

    const {surveys, errorGetSurveys, isLoadingSurveys, getAllSurveys,
        removeQuestionnaire} = useQuestionnaires() 

    const {selectedDatapool} = useDatapools()

    const [showCopySurvey, setShowCopySurvey] = useState(false)
    const [selectedSurvey, setSelectedSurvey] = useState(null)

    useEffect(() => {
        getAllSurveys()
        setSelectedSurvey(null)
        setShowCopySurvey(false)
    }, [selectedDatapool])

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
        {
            key: 'copy_questionnaire',
            label: 'Copy',
            icon: <CopyOutlined style={{color:'green'}}/> ,
            onClick: () => {
                setShowCopySurvey(true)
                setSelectedSurvey(q)
            }
        },
        {
            key:'delete_questionnaire',
            label:
            <Popconfirm
                    title="Remove questionnaire"
                    description="Are you sure to delete the questionnaire?"
                                        
                    onConfirm={() => {
                        const data = new FormData()
                                                
                        data.append("SurveyId", q.Id)

                        removeQuestionnaire(data).then(r => handleResponse(r, api, "Removed successfully", 1, () => {
                            getAllSurveys()
                        }))
                    }}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                    placement="right"
                >
                    delete
                </Popconfirm>,
            icon: <DeleteOutlined style={{color:'red'}}/>,
            onClick:() => {}
        }

        ])
    }

    const surveysList = () => {
        return(
            <div>
                <Row className="hq-full-width">
                    {surveys.map((s, si) => {
                        const {Code, Id, Questions, DateCreated} = s

                        return(
                            <Col xs={4} key={Id} className="hq-element-container">
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
                            </Col>
                        )
                    })}
                </Row>
            </div>
        )
    }

    return(
        <PagesWrapper>
            <Divider orientation="left">
                Questionnaires
            </Divider>
            {contextHolder}

            {isLoadingSurveys && <Skeleton />}

            {errorGetSurveys && 
                <ErrorComponent
                    error={errorGetSurveys}
                    onReload={() => getAllSurveys()}
                />
            }

            {!(isLoadingSurveys || errorGetSurveys) && surveys && surveysList()}

            <CopyQuestionnaire 
                open={showCopySurvey}
                onClose={() => setShowCopySurvey(false)}

                survey={selectedSurvey}
                reloadData={() => getAllSurveys()}
            />
        </PagesWrapper>
    )
}