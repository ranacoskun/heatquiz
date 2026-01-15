import React from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Button, Col, List, Popconfirm, Row, Space, Tooltip, message } from "antd";
import {PlusOutlined, PictureOutlined, AlignLeftOutlined} from '@ant-design/icons';

import './index.css'
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { EditChoiceLatex } from "./EditChoiceLatex";
import { useState } from "react";
import { EditChoiceImage } from "./EditChoiceImage";
import { EditQuestionLatex } from "./EditQuestionLatex";
import { EditQuestionAdditionalInformation } from "./EditQuestionAdditionalInformation";
import { AddChoice } from "./AddChoice";
import { EditQuestionImage } from "./EditQuestionImage";
import { handleResponse } from "../../../../services/Auxillary";

export function MultipleChoiceQuestionEditView({reloadQuestion}){

    const [showAddChoice, setShowAddChoice] = useState(false)

    const [showEditLatex, setShowEditLatex] = useState(false)
    const [showEditAdditionalInfo, setShowEditAdditionalInfo] = useState(false)
    const [showEditImage, setShowEditImage] = useState(false)

    const [showEditChoiceLatex, setShowEditChoiceLatex] = useState(false)
    const [showEditChoiceImage, setShowEditChoiceImage] = useState(false)
    const [selectedChoice, setSelectedChoice] = useState(null)

    const [api, contextHolder] = message.useMessage()

    const {multipleChoiceQuestionPlay: question, isLoadingEditMultipleChoiceQuestionChoice, editMultipleChoiceQuestionChoice,
        isLoadingRemoveMultipleChoiceQuestionChoice, removeMultipleChoiceQuestionChoice,
        isLoadingRemoveMultipleChoiceQuestionChoiceLatex, removeMultipleChoiceQuestionChoiceLatex,
        isLoadingRemoveMultipleChoiceQuestionChoiceImage, removeMultipleChoiceQuestionChoiceImage
    } = useQuestions()

    const {Base_ImageURL, Code, Latex, AdditionalInfo, Choices} = question

    const flipCorrect = (c) => {
        
        const data = new FormData()
        data.append("QuestionId", question.Id)
        data.append("AnswerId", c.Id)
        data.append("Correct", !c.Correct)
        
        editMultipleChoiceQuestionChoice(data)
        .then(r => handleResponse(r, api, 'Updated successfully',1, () => reloadQuestion()))
       
    }

    const removeChoice = (c) => {
        
        const VM = ({
            Id: question.Id,
            AnswerId: c.Id
        })
        
        removeMultipleChoiceQuestionChoice(VM)
        .then(r => handleResponse(r, api, 'Removed successfully',1, () => reloadQuestion()))
    }

    const removeChoiceLatex = (c) => {
        
        const data = new FormData()
        data.append("QuestionId", question.Id)
        data.append("AnswerId", c.Id)
        
        removeMultipleChoiceQuestionChoiceLatex(data)
        .then(r => handleResponse(r, api, 'Removed successfully',1, () => reloadQuestion()))
    }

    const removeChoiceImage = (c) => {
        
        const data = new FormData()
        data.append("QuestionId", question.Id)
        data.append("AnswerId", c.Id)
        
        removeMultipleChoiceQuestionChoiceImage(data)
        .then(r => handleResponse(r, api, 'Removed successfully',1, () => reloadQuestion()))
    }

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
                        className="multiple-choice-question-edit-view-img"
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
                            <p className="default-gray">Additional info</p>
                            <p>*{AdditionalInfo}</p>
                        </Space>

                        <Space align="start" size={'large'}>
                            <p className="default-gray">Choices</p>
                            <List 
                                dataSource={Choices.sort((a, b) => b.Correct ? +1 : -1)}
                                renderItem={(c, ci) => {
                                    const {Id, Correct, ImageURL, Latex} = c
                                    return(
                                        <Tooltip
                                            key={Id}
                                            placement="right"
                                            title = {
                                                <Space
                                                    direction="vertical"
                                                > 
                                                    {Choices.length !== 1 && 
                                                    <Popconfirm
                                                        title="Delete choice"
                                                        description="Are you sure to delete this choice?"
                                                        onConfirm={() => removeChoice(c)}
                                                        onCancel={() => {}}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        placement="right"
                                                    >
                                                        <Button
                                                            size="small"
                                                            className="hq-full-width"
                                                            loading={isLoadingRemoveMultipleChoiceQuestionChoice}
                                                            >
                                                            Remove choice 
                                                        </Button>
                                                    </Popconfirm>
                                                    }

                                                    {Latex && ImageURL &&
                                                    <Popconfirm
                                                        title="Delete choice LaTeX"
                                                        description="Are you sure to remove this choice's LaTeX?"
                                                        onConfirm={() => removeChoiceLatex(c)}
                                                        onCancel={() => {}}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        placement="right"
                                                    >
                                                        <Button
                                                            size="small"
                                                            className="hq-full-width"
                                                            loading={isLoadingRemoveMultipleChoiceQuestionChoiceLatex}
                                                            onClick={() => {}}  
                                                        >
                                                            Remove LaTeX 
                                                        </Button>
                                                    </Popconfirm>}

                                                    {Latex && ImageURL &&

                                                    <Popconfirm
                                                        title="Delete choice image"
                                                        description="Are you sure to remove this choice's image?"
                                                        onConfirm={() => removeChoiceImage(c)}
                                                        onCancel={() => {}}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        placement="right"
                                                    >
                                                        <Button
                                                            size="small"
                                                            className="hq-full-width"
                                                            onClick={() => {}}  
                                                            loading={isLoadingRemoveMultipleChoiceQuestionChoiceImage}
                                                        >
                                                            Remove image 
                                                        </Button>
                                                    </Popconfirm>
                                                    }

                                                    <Button
                                                        size="small"
                                                        className="hq-full-width"
                                                        loading={isLoadingEditMultipleChoiceQuestionChoice}
                                                        onClick={() => flipCorrect(c)}  
                                                    >
                                                        {'Set '}{Correct ? 'incorrect': 'correct'}
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        className="hq-full-width"
                                                        onClick={() => {
                                                            setShowEditChoiceLatex(true)
                                                            setSelectedChoice({...c, index: ci})
                                                        }}
                                                    >
                                                        Update LaTeX
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        className="hq-full-width"
                                                        onClick={() => {
                                                            setShowEditChoiceImage(true)
                                                            setSelectedChoice({...c, index: ci})
                                                        }}
                                                    >
                                                        Update image
                                                    </Button>
                                                </Space>
                                            }
                                            color="white"
                                        >
                                            <div
                                            className="multiple-choice-question-edit-view-choice"
                                        >
                                            <Space 
                                                size={'small'} 
                                                align="start"
                                            >
                                                <p 
                                                    className={Correct ? 'default-green hq-bold-font-weight' : 'default-red hq-bold-font-weight'}
                                                >
                                                    {ci+1}
                                                </p>

                                                <Space size={'large'} align="start">
                                                    {Latex && <LatexRenderer latex={Latex} />}

                                                    {ImageURL && 
                                                    <img 
                                                        alt={"choice #" + ci + 1}
                                                        className="multiple-choice-question-edit-view-choice-img"
                                                        src={ImageURL}
                                                    />}
                                                </Space>
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
                            title={<p>Add choice</p>}
                            placement="left"
                        >
                            <Button
                                onClick={() => setShowAddChoice(true)}
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
                            title={<p>Update additional info</p>}
                            placement="left"
                        >
                            <Button
                                onClick={() => setShowEditAdditionalInfo(true)}
                            >
                                <AlignLeftOutlined />
                            </Button>
                        </Tooltip>

                       
                    </Space>           
                </Col>
                
            </Row>

            <AddChoice 
                open={showAddChoice}
                onClose={() => setShowAddChoice(false)}
                question={question}
                reloadQuestion = {reloadQuestion}
            />
            
            <EditQuestionLatex 
                open={showEditLatex}
                onClose={() => setShowEditLatex(false)}
                question={question}
                reloadQuestion = {reloadQuestion}
            />

            <EditQuestionAdditionalInformation 
                open={showEditAdditionalInfo}
                onClose={() => setShowEditAdditionalInfo(false)}
                question={question}
                reloadQuestion = {reloadQuestion}
            />

            <EditQuestionImage 
                open={showEditImage}
                onClose={() => setShowEditImage(false)}
                question={question}
                reloadQuestion = {reloadQuestion}
            />

            <EditChoiceLatex 
                open={showEditChoiceLatex}
                onClose={() => setShowEditChoiceLatex(false)}
                choice={selectedChoice}
                question={question}
                reloadQuestion = {reloadQuestion}
            />

            <EditChoiceImage 
                open={showEditChoiceImage}
                onClose={() => setShowEditChoiceImage(false)}
                choice={selectedChoice}
                question={question}
                reloadQuestion = {reloadQuestion}
            />


            
        </div>
    )
}