import React, { useEffect, useState } from "react";
import {Button, Drawer, Input, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { MAX_QUESTION_CODE } from "../../Questions/Shared/Constants";
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import {handleResponse} from "../../../services/Auxillary";
import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../../Components/LatexRenderer";

export function EditQuestionnaireExplanation({open, onClose, survey, reloadSurvey}){
    if(!open) return <div/>;

    const {isLoadingEditQuestionnaireExplanation, editQuestionnaireExplanation} = useQuestionnaires()

    const [api, contextHolder] = message.useMessage()

    const [newExplanation, setNewExplanation] = useState("")
    
    useEffect(() => {
        const {Explanation} = survey

        setNewExplanation(Explanation)
    }, [open])

    return(
        <Drawer
            title="Edit Questionnaire Explanation"
            width={'50%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
        >
            {contextHolder}

            <small className="default-gray">Explanation (optional)</small>
            <TextArea 
                className="hq-full-width"
                value={newExplanation}
                onChange={(v) => {
                    const value = v.target.value

                    setNewExplanation(value)
                }}
            />
            <small className="default-gray">You can remove explanation by adding blank text.</small>
            <br/>
            <br/>
            <LatexRenderer latex={newExplanation || ""} />
            <br/>
            <br/>

            <Button
                size="small"
                type="primary"

                loading={isLoadingEditQuestionnaireExplanation}

                onClick={() => {
                    const data = new FormData()

                    data.append("SurveyId", survey.Id)
                    data.append("Explanation", newExplanation)

                    editQuestionnaireExplanation(data).then(r => handleResponse(r, api, "Updated successfully", 1, () => {
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
