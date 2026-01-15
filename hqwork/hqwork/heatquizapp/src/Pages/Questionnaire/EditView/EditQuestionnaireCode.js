import React, { useEffect, useState } from "react";
import {Button, Drawer, Input, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { MAX_QUESTION_CODE } from "../../Questions/Shared/Constants";
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import {handleResponse} from "../../../services/Auxillary";

export function EditQuestionnaireCode({open, onClose, survey, reloadSurvey}){
    if(!open) return <div/>;

    const {isLoadingEditQuestionnaireCode, editQuestionnaireCode} = useQuestionnaires()

    const [api, contextHolder] = message.useMessage()

    const [newCode, setNewCode] = useState("")
    
    useEffect(() => {
        const {Code} = survey

        setNewCode(Code)
    }, [open])

    return(
        <Drawer
            title="Edit Questionnaire Code"
            width={'50%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
        >
            {contextHolder}

            <small className="default-gray">Code</small>
            <Input 
                className="hq-full-width"
                value={newCode}
                maxLength={MAX_QUESTION_CODE}
                onChange={(v) => {
                    const value = v.target.value

                    setNewCode(value)
                }}
            />

            <br/>
            <br/>

            <Button
                size="small"
                type="primary"

                loading={isLoadingEditQuestionnaireCode}

                onClick={() => {
                    if(!newCode.trim()){
                        api.destroy()
                        api.warning("Please add code")

                        return
                    }

                    const data = new FormData()

                    data.append("SurveyId", survey.Id)
                    data.append("Code", newCode.trimEnd())

                    editQuestionnaireCode(data).then(r => handleResponse(r, api, "Updated successfully", 1, () => {
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
