import React, { useEffect, useState } from "react";
import {Button, Drawer, Input, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import {handleResponse} from "../../../services/Auxillary";

export function EditQuestionnaireQuestionTitle({open, onClose, question, reloadSurvey}){
    if(!open) return <div/>;

    const {isLoadingEditQuestionnaireQuestionTitle, editQuestionnaireQuestionTitle} = useQuestionnaires()

    const [api, contextHolder] = message.useMessage()

    const [newTitle, setNewTitle] = useState("")
    
    useEffect(() => {
        const {Title} = question

        setNewTitle(Title)
    }, [open])

    return(
        <Drawer
            title="Edit Question Title"
            width={'50%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
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

            <br/>
            <br/>

            <Button
                size="small"
                type="primary"

                loading={isLoadingEditQuestionnaireQuestionTitle}

                onClick={() => {
                    if(!newTitle.trim()){
                        api.destroy()
                        api.warning("Please add title")

                        return
                    }

                    const data = new FormData()

                    data.append("QuestionId", question.Id)
                    data.append("Title", newTitle.trimEnd())

                    editQuestionnaireQuestionTitle(data).then(r => handleResponse(r, api, "Updated successfully", 1, () => {
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
