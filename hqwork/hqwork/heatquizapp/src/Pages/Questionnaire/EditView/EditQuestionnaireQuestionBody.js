import React, { useEffect, useState } from "react";
import {Button, Drawer, Input, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import {handleResponse} from "../../../services/Auxillary";
import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../../Components/LatexRenderer";

export function EditQuestionnaireQuestionBody({open, onClose, question, reloadSurvey}){
    if(!open) return <div/>;

    const {isLoadingEditQuestionnaireQuestionBody, editQuestionnaireQuestionBody} = useQuestionnaires()

    const [api, contextHolder] = message.useMessage()

    const [newBody, setNewBody] = useState("")
    
    useEffect(() => {
        const {Body} = question

        setNewBody(Body)
    }, [open])

    return(
        <Drawer
            title="Edit Question Body"
            width={'50%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
        >
            {contextHolder}

            <small className="default-gray">Body</small>
            <TextArea 
                className="hq-full-width"
                value={newBody}
                onChange={(v) => {
                    const value = v.target.value

                    setNewBody(value)
                }}
            />
            <br/>
            <br/>
            <LatexRenderer latex={newBody || ""} />
            <br/>
            <br/>

            <Button
                size="small"
                type="primary"

                loading={isLoadingEditQuestionnaireQuestionBody}

                onClick={() => {
                    if(!newBody.trim()){
                        api.destroy()
                        api.warning("Please add body")

                        return
                    }

                    const data = new FormData()

                    data.append("QuestionId", question.Id)
                    data.append("Body", newBody.trim())

                    editQuestionnaireQuestionBody(data).then(r => handleResponse(r, api, "Updated successfully", 1, () => {
                        reloadSurvey()
                        onClose()
                    }))
                }}
            >
                Update
            </Button>
        </Drawer>
    )
}
