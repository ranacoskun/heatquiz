import React, { useEffect, useState } from "react";
import {Button, Drawer, Input, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import {handleResponse} from "../../../services/Auxillary";
import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../../Components/LatexRenderer";

export function EditQuestionnaireFinalText({open, onClose, survey, reloadSurvey}){
    if(!open) return <div/>;

    const {isLoadingEditQuestionnaireFinalText, editQuestionnaireFinalText} = useQuestionnaires()

    const [api, contextHolder] = message.useMessage()

    const [newFinalText, setNewFinalText] = useState("")
    
    useEffect(() => {
        const {FinalText} = survey

        setNewFinalText(FinalText)
    }, [open])

    return(
        <Drawer
            title="Edit Questionnaire Post-sumbittion text"
            width={'50%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
        >
            {contextHolder}

            <small className="default-gray">Post-submittion text (optional)</small>
            <TextArea 
                className="hq-full-width"
                value={newFinalText}
                onChange={(v) => {
                    const value = v.target.value

                    setNewFinalText(value)
                }}
            />
            <small className="default-gray">You can remove explanation by adding blank text.</small>
            
            <br/>
            <br/>

            <Button
                size="small"
                type="primary"

                loading={isLoadingEditQuestionnaireFinalText}

                onClick={() => {
                    const data = new FormData()

                    data.append("SurveyId", survey.Id)
                    data.append("FinalText", newFinalText)

                    editQuestionnaireFinalText(data).then(r => handleResponse(r, api, "Updated successfully", 1, () => {
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
