import React, { useEffect, useState } from "react";
import {Button, Col, Divider, Drawer, Row, Space, message } from "antd";
import {ArrowLeftOutlined, InfoCircleFilled, LeftCircleOutlined, RightCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import {handleResponse} from "../../../services/Auxillary";
import { LatexRenderer } from "../../../Components/LatexRenderer";

export function ReorderQuestionnaireQuestionChoices({open, onClose, question, reloadSurvey}){
    if(!open) return <div/>;

    const {isLoadingReorderQuestionnaireQuestionChoices, reorderQuestionnaireQuestionChoices,} = useQuestionnaires()

    const [api, contextHolder] = message.useMessage()

    const [choicesList, setChoicesList] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)
    
    useEffect(() => {
        const {Choices} = question

        setChoicesList(Choices.sort((a,b) => b.Order - a.Order))

    }, [open])

    const firstChoice = (selectedIndex === 0)
    const lastChoice = ((selectedIndex + 1) === choicesList.length)


    return(
        <Drawer
            title={
                <Space>
                    <p className="hq-normal-font-weight">Reorder Choices</p>

                    <Button 
                        size="small" 
                        type="primary" 
                        loading={isLoadingReorderQuestionnaireQuestionChoices}
                        onClick={() => {

                            const data = ({
                                QuestionId: question.Id,
                                ReorderedChoices: choicesList.map((q, qi) => ({...q, Order: choicesList.length - (qi+1)}))
                            })

                            reorderQuestionnaireQuestionChoices(data).then(r => handleResponse(r, api, "Order updated", 1, () => {
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
                    <p className="default-gray">Select a choice and then move left/right</p>
                </Space>

                {selectedIndex !== null && 
                <Space>
                    <Button size="small" type="default" 
                            onClick={() => {
                                if(firstChoice) return;

                                let _choices = [...choicesList]
                                let _choices2 = [...choicesList]

                                _choices[selectedIndex-1] = _choices2[selectedIndex]
                                _choices[selectedIndex] = _choices2[selectedIndex-1]

                                setChoicesList(_choices)
                                setSelectedIndex(selectedIndex - 1)                                
                            }}>
                                <LeftCircleOutlined className={!firstChoice ? "default-title" : "default-gray"} />
                            </Button>

                            <Button size="small" type="default" 
                            onClick={() => {
                                    if(lastChoice) return;

                                    let _choices = [...choicesList]
                                    let _choices2 = [...choicesList]

                                    _choices[selectedIndex+1] = _choices2[selectedIndex]
                                    _choices[selectedIndex] = _choices2[selectedIndex+1]

                                    setChoicesList(_choices)
                                    setSelectedIndex(selectedIndex + 1)  
                                }}>
                                <RightCircleOutlined className={!lastChoice ? "default-title" : "default-gray"} /> 
                            </Button>
                </Space>}
            </Space>
            <Divider/>
            <Row>
                {choicesList.map((q, qi) => {
                    const {LaTex, ImageURL} = q
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
                            <Space align="start">
                            <p className="default-title">{qi+1}</p>
                            <div>
                                {LaTex && <LatexRenderer latex={LaTex} />}
                                {ImageURL && 
                                                <img 
                                                    alt="img"

                                                    src={ImageURL}

                                                    className="questionnaire-question-choice-image"

                                                    onClick={() => {
                                                        api.destroy()

                                                        api.info(
                                                            <Space align="start">
                                                                <img 
                                                                    alt="img"
                                                                    className="questionnaire-question-image-zoom"

                                                                    src={ImageURL}                                                    
                                                                />
                                                                <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                                            </Space>
                                                        , 0)
                                                    }}
                                                />}
                            </div>
                            </Space>
                        </Col>
                    )
                })}
            </Row>
        </Drawer>
    )
}
