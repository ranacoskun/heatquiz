import { Button, Drawer, Space, message } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import TextArea from "antd/es/input/TextArea";

import './index.css'
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { handleResponse } from "../../../services/Auxillary";

export function EditQuestionnaireChoiceLatex({open, onClose, choice, reloadSurvey}){

    if(!open) return <div/>;

    const [newLatex, setNewLatex] = useState('')

    const {LaTex, ImageURL} = choice

    const [api, contextHolder] = message.useMessage()
    const {isLoadingUpdateQuestionnaireChoicLatex, updateQuestionnaireChoiceLatex} = useQuestionnaires()

    useEffect(() => {
        if(open){
            setNewLatex(LaTex || '')
        }
    }, [open])

    return(
        <Drawer
        title="Edit choice LaTeX"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
            <Space
                size={'large'}
                align="start"
            >
                {LaTex && <LatexRenderer latex={LaTex} />}
                {ImageURL && 
                <img 
                    alt={'Choice'}
                    className="multiple-choice-question-edit-view-choice-img"
                    src={ImageURL}
                />}
            </Space>
        }
        >
        {contextHolder}
        <Space
            direction="vertical"
            size={'large'}
            className="hq-full-width"
        >
            <TextArea 
                value={newLatex}
                rows={4} 
                onChange={(v) => setNewLatex(v.target.value)}
            />

            <LatexRenderer latex={newLatex} />
        </Space>

        <br/>
        <br/>
        
        <Button
            size="small"
            type="primary"
            onClick={() => {
                if(!newLatex.trim() && !ImageURL){
                    api.destroy()
                    api.warning('Please provide a LaTeX since this choice has no image')

                    return
                }

                const data = new FormData()
                data.append("ChoiceId", choice.Id)
                data.append("Latex", newLatex.trimEnd())

                updateQuestionnaireChoiceLatex(data)
                .then(r => handleResponse(r, api, 'Updated successfully', 1, () => {
                    onClose()
                    reloadSurvey()
                }))
              
            }}

            loading={isLoadingUpdateQuestionnaireChoicLatex}
        >
            Update
        </Button>
        </Drawer>
    )
}