import React, { useEffect, useState } from "react";
import {Button, Col, Divider, Drawer, Row, Space, message } from "antd";
import {ArrowLeftOutlined, InfoCircleFilled, LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import {handleResponse} from "../../../services/Auxillary";

export function ReorderQuestionnaireQuestions({open, onClose, survey, reloadSurvey}){
    if(!open) return <div/>;

    const {isLoadingReorderQuestionnaire, reorderQuestionnaire,} = useQuestionnaires()

    const [api, contextHolder] = message.useMessage()

    const [questionsList, setQuestionsList] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)
    
    useEffect(() => {
        const {Questions} = survey

        setQuestionsList(Questions.sort((a,b) => a.Order - b.Order))

    }, [open])

    const firstQuestion = (selectedIndex === 0)
    const lastQuestion = ((selectedIndex + 1) === questionsList.length)

    console.log(isLoadingReorderQuestionnaire)

    return(
        <Drawer
            title={
                <Space>
                    <p className="hq-normal-font-weight">Reorder Questions</p>

                    <Button 
                        size="small" 
                        type="primary" 
                        loading={isLoadingReorderQuestionnaire}
                        onClick={() => {

                            const data = ({
                                SurveyId: survey.Id,
                                ReorderedQuestions: questionsList.map((q, qi) => ({...q, Order: qi+1}))
                            })

                            reorderQuestionnaire(data).then(r => handleResponse(r, api, "Order updated", 1, () => {
                                onClose()
                                reloadSurvey()
                            }))
                        }}
                    >
                        Update order
                    </Button>
                </Space>
            }
            width={'100%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
        >
            {contextHolder}
            <Space size="large">
                <Space>
                    <InfoCircleFilled className="default-title"/>
                    <p className="default-gray">Select a question and then move left/right</p>
                </Space>

                {selectedIndex !== null && 
                <Space>
                    <Button size="small" type="default" 
                            onClick={() => {
                                if(firstQuestion) return;

                                let _questions = [...questionsList]
                                let _questions2 = [...questionsList]

                                _questions[selectedIndex-1] = _questions2[selectedIndex]
                                _questions[selectedIndex] = _questions2[selectedIndex-1]

                                setQuestionsList(_questions)
                                setSelectedIndex(selectedIndex - 1)                                
                            }}>
                                <LeftCircleOutlined className={!firstQuestion ? "default-title" : "default-gray"} />
                            </Button>

                            <Button size="small" type="default" 
                            onClick={() => {
                                    if(lastQuestion) return;

                                    let _questions = [...questionsList]
                                    let _questions2 = [...questionsList]

                                    _questions[selectedIndex+1] = _questions2[selectedIndex]
                                    _questions[selectedIndex] = _questions2[selectedIndex+1]

                                    setQuestionsList(_questions)
                                    setSelectedIndex(selectedIndex + 1)
                                }}>
                                <RightCircleOutlined className={!lastQuestion ? "default-title" : "default-gray"} /> 
                            </Button>
                </Space>}
            </Space>
            <Divider/>
            <Row>
                {questionsList.map((q, qi) => {
                    const {Title} = q
                    const isSelected = (selectedIndex != null) && (selectedIndex === qi)

                    return(
                        <Col className={"hq-element-container hq-clickable " + (isSelected ? "highlighted" : "")} onClick={() => {

                            if(isSelected){
                                setSelectedIndex(null)
                            }
                            else{
                                setSelectedIndex(qi)
                            }
                        }}>
                            <Space>
                            <p className="default-title">{qi+1}</p>
                            <p className="default-gray">{Title}</p>
                            </Space>
                        </Col>
                    )
                })}
            </Row>
        </Drawer>
    )
}
