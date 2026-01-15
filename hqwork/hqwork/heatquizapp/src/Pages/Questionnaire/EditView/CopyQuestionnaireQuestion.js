import React, { useEffect, useState } from "react";
import {Button, Drawer, Input, Space, message } from "antd";
import {ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import {handleResponse} from "../../../services/Auxillary";

export function CopyQuestionnaireQuestion({open, onClose, question, reloadSurvey}){
    if(!open) return <div/>;

    const {isLoadingCopyQuestionnaireQuestion, copyQuestionnaireQuestion,} = useQuestionnaires()

    const [api, contextHolder] = message.useMessage()

    const [newTitle, setNewTitle] = useState("")
    
    useEffect(() => {

        setNewTitle("")
    }, [open])

    const {Title, ImageURL} = question

    return(
        <Drawer
            title="Copy Question"
            width={'50%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}

            footer={
                <div>
                    <p className="default-gray">Copying question:</p>
                    <Space size="large" align="start">
                        <p className="default-title">{Title}</p>

                        {ImageURL && 
                        <img 
                            alt={Title}
                            src={ImageURL}
                            className="QuestionnaireQuestionImage"
                            onClick={() => {
                                api.destroy()

                                api.info(
                                    <Space align="start">
                                        <img 
                                            alt={Title}
                                            className="questionnaire-question-image-zoom"

                                            src={ImageURL}                                                    
                                        />
                                        <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                    </Space>
                                , 0)
                            }}
                        />}
                    </Space>
                </div>
            }
        >
            {contextHolder}

            <small className="default-gray">Title</small>
            <Input 
                className="hq-full-width"
                value={newTitle}
                onChange={(v) => {
                    const value = v.target.value

                    setNewTitle(value)
                }}
            />
            <small className="default-gray">Assign title for the new question</small>
            <br/>
            <br/>

            <Button
                size="small"
                type="primary"

                loading={isLoadingCopyQuestionnaireQuestion}

                onClick={() => {
                    if(!newTitle.trim()){
                        api.destroy()
                        api.warning("Please add title")

                        return
                    }

                    const data = new FormData()

                    data.append("Title", newTitle.trimEnd())

                    data.append("QuestionId", question.Id)
                    data.append("SurveyId", question.QuestionnaireId)

                    copyQuestionnaireQuestion(data).then(r => handleResponse(r, api, "Copied successfully", 1, () => {
                        onClose()
                        reloadSurvey()
                    }))
                }}
            >
                Copy
            </Button>
        </Drawer>
    )
}
