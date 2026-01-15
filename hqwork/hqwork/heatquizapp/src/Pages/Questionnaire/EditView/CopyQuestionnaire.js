import React, { useEffect, useState } from "react";
import {Button, Drawer, Input, Space, message } from "antd";
import {ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import {handleResponse} from "../../../services/Auxillary";

export function CopyQuestionnaire({open, onClose, survey, reloadData}){
    if(!open) return <div/>;

    const {isLoadingCopySurvey,copySurvey,} = useQuestionnaires()

    const [api, contextHolder] = message.useMessage()

    const [newCode, setNewCode] = useState("")
    
    useEffect(() => {

        setNewCode("")
    }, [open])

    const {Code, ImageURL} = survey

    return(
        <Drawer
            title="Copy Questionnaire"
            width={'50%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}

            footer={
                <div>
                    <p className="default-gray">Copying questionnaire:</p>
                    <Space size="large" align="start">
                        <p className="default-title">{Code}</p>

                        {ImageURL && 
                        <img 
                            alt={Code}
                            src={ImageURL}
                            className="QuestionnaireQuestionImage"
                            onClick={() => {
                                api.destroy()

                                api.info(
                                    <Space align="start">
                                        <img 
                                            alt={Code}
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

            <small className="default-gray">Code</small>
            <Input 
                className="hq-full-width"
                value={newCode}
                onChange={(v) => {
                    const value = v.target.value

                    setNewCode(value)
                }}
            />
            <small className="default-gray">Assign code for the new questionnaire</small>
            <br/>
            <br/>

            <Button
                size="small"
                type="primary"

                loading={isLoadingCopySurvey}

                onClick={() => {
                    if(!newCode.trim()){
                        api.destroy()
                        api.warning("Please add code")

                        return
                    }

                    const data = new FormData()

                    data.append("Code", newCode.trimEnd())

                    data.append("SurveyId", survey.Id)

                    copySurvey(data).then(r => handleResponse(r, api, "Copied successfully", 1, () => {
                        onClose()
                        reloadData()
                    }))
                }}
            >
                Copy
            </Button>
        </Drawer>
    )
}
