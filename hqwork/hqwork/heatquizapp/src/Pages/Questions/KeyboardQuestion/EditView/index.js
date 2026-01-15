import React from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Button, Col, List, Popconfirm, Row, Space, Tooltip, message } from "antd";
import {PlusOutlined, PictureOutlined, AlignLeftOutlined, BarChartOutlined } from '@ant-design/icons';

import './index.css'
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { useState } from "react";
import { EditQuestionLatex } from "./EditQuestionLatex";
import { EditQuestionImage } from "./EditQuestionImage";
import { ViewWrongAnswers } from "./ViewWrongAnswers";
import { AddNewAnswer } from "./AddNewAnswer";
import { handleResponse } from "../../../../services/Auxillary";


export function KeyboardQuestionEditView({reloadQuestion}){

    const [showAddAnswer, setShowAddAnswer] = useState(false)

    const [showEditLatex, setShowEditLatex] = useState(false)
    const [showEditImage, setShowEditImage] = useState(false)

    const [showWrongAnswers, setShowWrongAnswers] = useState(false)

    const [api, contextHolder] = message.useMessage()

    const {keyboardQuestionPlay: question, isLoadingRemoveKeyboardQuestionAnswer, removeKeyboardQuestionAnswer,
        isLoadingAddKeyboardQuestionAnswer,
        isLoadingEditKeyboardQuestionImage,
        isLoadingEditKeyboardQuestionLatex,
        
    } = useQuestions()

    const {Base_ImageURL, Code, Latex, Keyboard, Answers, IsEnergyBalance, DisableDevision} = question
    const {Name: keyboardName} = Keyboard

    return(
        <div>
            {contextHolder}
            <Row
                gutter={12}
            >
                <Col 
                    xs={4}
                >
                    <img 
                        src={Base_ImageURL}
                        alt={Code}
                        className="keyboard-question-edit-view-img"
                    />
                </Col>

                <Col 
                    xs={19}
                >
                    <Space
                        size={'large'}
                        direction="vertical"
                    >
                        <Space align="start" size={'large'}>
                            <p className="default-gray">Question</p>

                            <LatexRenderer 
                                latex={Latex}
                            />
                        </Space>    

                        <Space align="start" size={'large'}>
                            <p className="default-gray">Keyboard</p>

                            <p className="default-gray">{keyboardName}</p>
                            {IsEnergyBalance && <p className="default-orange">Energy balance question</p>}
                            {DisableDevision && <p className="default-orange">Division disabled</p>}
                        </Space>  

                         <Space align="start" size={'large'}>
                            <p className="default-gray">Answers</p>

                            <List 
                                dataSource={Answers}

                                renderItem={(a, ai) => {
                                    const {Id} = a

                                    const answerReduced = a.AnswerElements
                                    .sort((c,d) => c.Id > d.Id ? 1 : -1)
                                    .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')
                                    
                                    return(
                                        <Tooltip
                                            key={Id}
                                            placement="right"
                                            title = {
                                                <Space
                                                    direction="vertical"
                                                > 
                                                    {Answers.length !== 1 && 
                                                    <Popconfirm
                                                        title="Delete answer"
                                                        description="Are you sure to delete this answer?"
                                                        onConfirm={() => {
                                                            const VM = ({
                                                                Id: question.Id,
                                                                AnswerId: a.Id
                                                            })

                                                            removeKeyboardQuestionAnswer(VM)
                                                            .then(r => handleResponse(r, api, 'Answer removed successfully', 1, () => reloadQuestion()))
                                                            
                                                        }}
                                                        onCancel={() => {}}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        placement="right"
                                                    >
                                                        <Button
                                                            size="small"
                                                            className="hq-full-width"
                                                            loading={isLoadingRemoveKeyboardQuestionAnswer}
                                                            >
                                                            Remove answer 
                                                        </Button>
                                                    </Popconfirm>
                                                    }
                                                </Space>
                                            }
                                            color="white"
                                        >
                                        <div
                                            className="keyboard-question-edit-view-answer"
                                        >
                                            <Space>
                                                <p>{ai+1}</p>

                                                <LatexRenderer latex={"$$" + answerReduced + "$$"} />
                                            </Space>
                                        </div>
                                    </Tooltip>
                                    )
                                }}
                            />
                        </Space>                     
                    </Space>
                    
                </Col>
                <Col 
                    xs={1}
                >
                    <Space 
                    align="end"
                    direction="vertical">
                        <Tooltip
                            color="white"
                            title={<p>Add answer</p>}
                            placement="left"
                        >
                            <Button
                                onClick={() => setShowAddAnswer(true)}
                            >
                                <PlusOutlined style={{color:'green'}} />
                            </Button>
                        </Tooltip>
                        <Tooltip
                            color="white"
                            title={<p>Update image</p>}
                            placement="left"
                        >
                            <Button
                                onClick={() => setShowEditImage(true)}
                            >
                                 <PictureOutlined />
                            </Button>
                        </Tooltip>

                        <Tooltip
                            color="white"
                            title={<p>Update text</p>}
                            placement="left"
                        >
                            <Button
                                onClick={() => setShowEditLatex(true)}
                            >
                                <AlignLeftOutlined />
                            </Button>
                        </Tooltip>     

                        <Tooltip
                            color="white"
                            title={<p>View wrong answers</p>}
                            placement="left"
                        >
                            <Button
                                onClick={() => setShowWrongAnswers(true)}
                            >
                                <BarChartOutlined  style = {{color:'red'}}/>
                            </Button>
                        </Tooltip>                    
                    </Space>           
                </Col>
                
            </Row>

            <EditQuestionLatex 
                open={showEditLatex}
                onClose={() => setShowEditLatex(false)}
                question={question}
                reloadQuestion = {reloadQuestion}
            />

            <EditQuestionImage 
                open={showEditImage}
                onClose={() => setShowEditImage(false)}
                question={question}
                reloadQuestion = {reloadQuestion}
            />

            <ViewWrongAnswers 
                open={showWrongAnswers}
                onClose={() => setShowWrongAnswers(false)}
                question={question}
            />

            <AddNewAnswer 
                open={showAddAnswer}
                onClose={() => setShowAddAnswer()}
                question={question}
                reloadQuestion = {reloadQuestion}
            />
            
        </div>
    )
}